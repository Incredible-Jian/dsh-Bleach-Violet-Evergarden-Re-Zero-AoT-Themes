import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Package root keeps the bundle relocatable whether installed from npm or a
// local workspace link.
const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.')

function readAsset(name) {
  return fs.readFileSync(path.join(PACKAGE_ROOT, name), 'utf8')
}

// Build one self-contained inline script: it paints the dark base immediately
// (to limit the flash before the class lands), injects the stylesheet, then
// runs the decoration/toggle logic. Everything is gated behind a guard flag
// inside theme.js, so running twice (web tapIndex + desktop index-inject) is
// harmless.
function buildInlineScript() {
  const css = readAsset('theme.css')
  const js = readAsset('theme.js')
  return (
    '(function(){try{' +
    'var d=document.documentElement;if(d)d.style.background="#0a0e1a";' +
    'var s=document.createElement("style");s.id="dsh-anime-theme-css";' +
    's.textContent=' + JSON.stringify(css) + ';' +
    '(document.head||d).appendChild(s);' +
    js +
    '}catch(e){}})()'
  )
}

// Marker used to de-duplicate our row against stale copies left by earlier
// versions (the desktop injection table is collected once at boot and cached).
const MARKER = 'dsh-anime-theme-css'

export default {
  name: 'dsh-anime-theme',
  apply(root) {
    const disposers = []
    root.effect(() => () => {
      for (const dispose of disposers) {
        try { dispose() } catch (_) {}
      }
    })

    let cachedScript = null
    function script() {
      if (cachedScript === null) cachedScript = buildInlineScript()
      return cachedScript
    }

    // Desktop channel: structured injection row interpreted client-side.
    disposers.push(root.on('webserver/index-inject', (table) => {
      try {
        if (!Array.isArray(table)) return
        for (const row of table) {
          if (row && row.kind === 'script' && typeof row.text === 'string' && row.text.indexOf(MARKER) >= 0) return
        }
        table.push({ kind: 'script', placement: 'body', text: script() })
      } catch (_) {}
    }))

    // Web channel: rewrite the served index.html (ignored by the desktop shell).
    disposers.push(root.inject(['webServer'], (ctx) => {
      try {
        return ctx.webServer.tapIndex((html) => {
          if (typeof html !== 'string' || html.indexOf(MARKER) >= 0) return html
          return html.replace('</head>', '<script>' + script() + '</script></head>')
        })
      } catch (_) {
        return () => {}
      }
    }))
  },
}

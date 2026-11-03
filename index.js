import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Package root keeps the bundle relocatable whether installed from npm or a
// local workspace link.
const PACKAGE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '.')

function readAsset(name) {
  return fs.readFileSync(path.join(PACKAGE_ROOT, name), 'utf8')
}

// A small original monochrome "reiatsu" swirl used when the user has not
// dropped their own wallpaper into assets/background.jpg.
const DEFAULT_BACKGROUND =
  "<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='900'>" +
  "<defs><radialGradient id='g' cx='50%' cy='42%' r='65%'>" +
  "<stop offset='0' stop-color='#1b2436'/><stop offset='1' stop-color='#060912'/>" +
  '</radialGradient></defs>' +
  "<rect width='1600' height='900' fill='url(#g)'/>" +
  "<g fill='none' stroke='#0d1424' stroke-width='26' stroke-linecap='round'>" +
  "<path d='M120 760 C420 520 620 780 900 560 C1120 390 1330 520 1520 380'/>" +
  "<path d='M60 600 C360 380 560 620 840 420 C1060 260 1300 380 1500 240'/>" +
  "<path d='M140 880 C460 700 700 900 980 700 C1200 540 1380 640 1560 520'/>" +
  '</g></svg>'

// The wallpaper is inlined as a data URI. If the user drops a personal image
// into assets/background.jpg it wins; that file is git-ignored so a private
// wallpaper never has to be published. The same picture also drives the
// framed wall-art mural (--dsh-anime-mural): the full-canvas wallpaper is
// hidden behind DSH's opaque shell, but the mural lives *above* it and is
// always visible.
function backgroundCss() {
  let data = null
  try {
    const file = path.join(PACKAGE_ROOT, 'assets', 'background.jpg')
    if (fs.existsSync(file)) {
      data = 'url("data:image/jpeg;base64,' + fs.readFileSync(file).toString('base64') + '")'
    }
  } catch (_) {}
  if (!data) {
    data = 'url("data:image/svg+xml;charset=utf-8,' + encodeURIComponent(DEFAULT_BACKGROUND) + '")'
  }
  return ':root{--dsh-anime-bg:' + data + ';--dsh-anime-mural:' + data + '}'
}

// Optional personal portrait for the framed poster: assets/poster.jpg is also
// git-ignored, so a private picture never ships with the repo.
function posterCss() {
  try {
    const file = path.join(PACKAGE_ROOT, 'assets', 'poster.jpg')
    if (fs.existsSync(file)) {
      const base64 = fs.readFileSync(file).toString('base64')
      return ':root{--dsh-anime-poster:url("data:image/jpeg;base64,' + base64 + '")}'
    }
  } catch (_) {}
  return ''
}

// Build one self-contained inline script: it paints the dark base immediately
// (to limit the flash before the class lands), injects the stylesheet, then
// runs the decoration/toggle logic. Everything is gated behind a guard flag
// inside theme.js, so running twice (web tapIndex + desktop index-inject) is
// harmless.
function buildInlineScript() {
  const css = readAsset('theme.css') + '\n' + backgroundCss() + posterCss()
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

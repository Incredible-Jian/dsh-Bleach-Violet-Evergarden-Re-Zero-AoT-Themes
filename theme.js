/* Browser-side behaviour for dsh-anime-theme: a cinematic vignette, three
   titan silhouettes (Colossal, Armored, Cart) marching across the backdrop,
   senbonzakura petals, 卍 bankai corner marks, the Wings of Freedom emblem
   and a bottom-left toggle that enables/disables the whole skin. The skin is
   gated by the `dsh-anime` class on <html>, so toggling is instant and the
   preference is remembered across reloads. */
(function () {
  if (window.__dshAnimeTheme) return
  window.__dshAnimeTheme = true

  var STORAGE_KEY = 'dsh-anime-theme-enabled'
  var root = document.documentElement

  function enabled() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY)
      if (saved === '0') return false
      if (saved === '1') return true
    } catch (e) {}
    return true // default on while the plugin is installed
  }

  var toggle
  function apply(on) {
    root.classList.toggle('dsh-anime', on)
    var label = toggle && toggle.querySelector('.txt')
    if (label) label.textContent = on ? '二次元主题 · 开' : '二次元主题 · 关'
    try { localStorage.setItem(STORAGE_KEY, on ? '1' : '0') } catch (e) {}
  }

  /* ---- titan silhouettes -----------------------------------------------
     Original simplified outlines modelled on the three reference titans:
     the towering skinless Colossal, the bulky plated Armored, and the low
     quadrupedal Cart Titan. Shapes are deliberately stylised silhouettes. */

  // Colossal Titan — very tall standing figure, steam rising off the body.
  var COLOSSAL =
    '<svg viewBox="0 -40 120 340" fill="currentColor" aria-hidden="true">' +
    '<ellipse class="steam s1" cx="52" cy="-6" rx="9" ry="13"/>' +
    '<ellipse class="steam s2" cx="66" cy="-16" rx="7" ry="11"/>' +
    '<ellipse class="steam s3" cx="58" cy="-26" rx="10" ry="14"/>' +
    '<path d="M60 6 C67 6 71 13 71 23 C71 32 67 38 63 42 C70 45 76 50 80 58 ' +
    'L98 66 L104 73 L97 78 L84 72 L88 110 L92 168 L96 210 L88 212 L82 168 L78 120 ' +
    'L80 175 L82 250 L84 296 L74 296 L70 230 L66 185 L62 230 L58 296 L48 296 L50 250 ' +
    'L52 175 L54 120 L50 168 L44 212 L36 210 L40 168 L44 110 L48 72 L35 78 L28 73 L34 66 ' +
    'L52 58 C56 50 50 45 57 42 C53 38 49 32 49 23 C49 13 53 6 60 6 Z"/>' +
    '</svg>'

  // Armored Titan — broad, hunched, jagged armoured shoulders, glowing eyes.
  var ARMORED =
    '<svg viewBox="0 0 160 210" fill="currentColor" aria-hidden="true">' +
    '<path d="M80 10 C72 10 67 17 67 27 C67 34 70 39 74 43 L60 50 L40 56 L30 64 L24 60 ' +
    'L20 70 L34 76 L44 70 L40 96 L36 140 L33 188 L44 190 L48 142 L52 104 L50 150 L48 200 ' +
    'L60 202 L64 150 L70 110 L76 150 L80 202 L92 200 L90 150 L86 110 L92 150 L96 202 ' +
    'L108 200 L106 150 L104 104 L108 142 L112 190 L123 188 L120 140 L116 96 L126 70 L140 76 ' +
    'L136 60 L130 64 L120 56 L100 50 L86 43 C90 39 93 34 93 27 C93 17 88 10 80 10 Z"/>' +
    '<circle class="eye" cx="72" cy="30" r="3.1"/>' +
    '<circle class="eye" cx="88" cy="30" r="3.1"/>' +
    '</svg>'

  // Cart Titan — low quadruped: long body, four legs, forward snout, two
  // cargo humps on its back.
  var CART =
    '<svg viewBox="0 0 280 130" fill="currentColor" aria-hidden="true">' +
    '<path d="M40 72 C30 66 28 56 38 52 L72 48 C76 40 86 40 90 48 C96 40 106 40 110 48 ' +
    'L150 44 C175 34 205 34 228 46 L256 52 C272 56 276 66 268 74 L258 72 C250 67 240 67 234 72 ' +
    'L232 72 L230 106 L222 106 L221 73 L205 72 L203 106 L195 106 L194 72 L120 73 L118 106 ' +
    'L110 106 L109 73 L92 72 L90 106 L82 106 L81 73 L48 76 Z"/>' +
    '</svg>'

  var TITANS = [
    { cls: 't-colossal', html: COLOSSAL },
    { cls: 't-armored', html: ARMORED },
    { cls: 't-cart', html: CART }
  ]

  /* ---- Wings of Freedom emblem ----------------------------------------- */
  var EMBLEM =
    '<svg id="dsh-anime-emblem" viewBox="0 0 100 100" fill="none" aria-hidden="true">' +
    '<g stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' +
    '<path d="M50 20 C39 29 28 33 13 33 C22 44 24 57 22 72 C33 63 44 59 50 59 Z" fill="rgba(216,58,48,0.28)"/>' +
    '<path d="M50 20 C61 29 72 33 87 33 C78 44 76 57 78 72 C67 63 56 59 50 59 Z" fill="rgba(74,158,255,0.24)"/>' +
    '<path d="M50 20 L50 80"/><path d="M30 44 L50 52 L70 44"/>' +
    '</g></svg>'

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function buildDecor() {
    if (document.getElementById('dsh-anime-vignette')) return

    var vignette = document.createElement('div')
    vignette.id = 'dsh-anime-vignette'
    document.body.appendChild(vignette)

    /* titans */
    var field = document.createElement('div')
    field.id = 'dsh-anime-titans'
    TITANS.forEach(function (t) {
      var wrap = document.createElement('div')
      wrap.className = 'dsh-anime-titan ' + t.cls
      wrap.innerHTML = t.html
      field.appendChild(wrap)
    })
    document.body.appendChild(field)

    /* senbonzakura petals */
    if (!prefersReduced) {
      var petals = document.createElement('div')
      petals.id = 'dsh-anime-petals'
      for (var i = 0; i < 18; i++) {
        var p = document.createElement('span')
        p.className = 'dsh-anime-petal'
        p.style.left = (Math.random() * 100) + 'vw'
        var dur = 7 + Math.random() * 9
        p.style.animationDuration = dur + 's'
        p.style.animationDelay = (-Math.random() * dur) + 's'
        p.style.setProperty('--drift', ((Math.random() * 160) - 80).toFixed(0) + 'px')
        var scale = 0.55 + Math.random() * 0.85
        p.style.width = (7 * scale).toFixed(1) + 'px'
        p.style.height = (17 * scale).toFixed(1) + 'px'
        petals.appendChild(p)
      }
      document.body.appendChild(petals)
    }

    /* 卍 corner marks */
    ;['tl', 'tr', 'bl', 'br'].forEach(function (pos) {
      var c = document.createElement('span')
      c.className = 'dsh-anime-corner ' + pos
      c.textContent = '卍'
      c.setAttribute('aria-hidden', 'true')
      document.body.appendChild(c)
    })

    /* emblem */
    var holder = document.createElement('div')
    holder.innerHTML = EMBLEM
    document.body.appendChild(holder.firstChild)
  }

  function buildToggle() {
    if (document.getElementById('dsh-anime-toggle')) return
    toggle = document.createElement('button')
    toggle.id = 'dsh-anime-toggle'
    toggle.type = 'button'
    toggle.setAttribute('aria-label', '切换二次元主题')
    toggle.title = '切换二次元主题（进击的巨人 / 死神 / Re:Zero / 紫罗兰永恒花园）'
    toggle.innerHTML = '<span class="dot"></span><span class="txt"></span>'
    toggle.addEventListener('click', function () {
      apply(!root.classList.contains('dsh-anime'))
    })
    document.body.appendChild(toggle)
  }

  function start() {
    try {
      buildDecor()
      buildToggle()
      apply(enabled())
    } catch (e) {}
  }

  if (document.body) start()
  else document.addEventListener('DOMContentLoaded', start, { once: true })
})()

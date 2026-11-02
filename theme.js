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
     Built from round-capped limb strokes plus filled torso/head masses
     instead of one hand-traced contour: that keeps the proportions organic
     (thick deltoids, tapering legs) without exposing crude polygon edges.
     Three original silhouettes: the towering Colossal, the bulky hunched
     Armored, and the low quadrupedal Cart Titan. */

  // Colossal Titan — very tall, arms hanging wide, steam rising off the body.
  var COLOSSAL =
    '<svg viewBox="0 0 200 420" fill="currentColor" aria-hidden="true">' +
    // legs & arms as tapered tubes
    '<path class="limb" stroke-width="36" d="M84 244 C78 300 76 352 80 404"/>' +
    '<path class="limb" stroke-width="36" d="M116 244 C122 300 124 352 120 404"/>' +
    '<path class="limb" stroke-width="26" d="M62 126 C50 172 44 216 46 258"/>' +
    '<path class="limb" stroke-width="26" d="M138 126 C150 172 156 216 154 258"/>' +
    // torso: broad chest tapering into the waist
    '<path d="M100 62 C126 62 148 78 156 106 L162 148 C158 190 152 220 146 250 ' +
    'L54 250 C48 220 42 190 38 148 L44 106 C52 78 74 62 100 62 Z"/>' +
    // deltoids + head + jaw
    '<circle cx="60" cy="120" r="20"/><circle cx="140" cy="120" r="20"/>' +
    '<ellipse cx="100" cy="40" rx="17" ry="21"/>' +
    '<path d="M88 54 L100 70 L112 54 Z"/>' +
    '</svg>'

  // Armored Titan — broad, hunched, heavy shoulder plates, glowing eyes.
  var ARMORED =
    '<svg viewBox="0 0 200 340" fill="currentColor" aria-hidden="true">' +
    '<path class="limb" stroke-width="42" d="M80 208 C74 258 72 300 76 336"/>' +
    '<path class="limb" stroke-width="42" d="M120 208 C126 258 128 300 124 336"/>' +
    '<path class="limb" stroke-width="34" d="M40 112 C28 158 24 196 28 236"/>' +
    '<path class="limb" stroke-width="34" d="M160 112 C172 158 176 196 172 236"/>' +
    '<path d="M100 58 C132 58 158 74 168 104 L174 150 C170 186 164 210 158 234 ' +
    'L42 234 C36 210 30 186 26 150 L32 104 C42 74 68 58 100 58 Z"/>' +
    // heavy pauldrons + tucked head
    '<path d="M22 104 C22 84 44 74 62 82 L66 116 L26 122 Z"/>' +
    '<path d="M178 104 C178 84 156 74 138 82 L134 116 L174 122 Z"/>' +
    '<ellipse cx="100" cy="38" rx="18" ry="16"/>' +
    '<path d="M86 48 L100 62 L114 48 Z"/>' +
    '<circle class="eye" cx="93" cy="36" r="3.4"/>' +
    '<circle class="eye" cx="107" cy="36" r="3.4"/>' +
    '</svg>'

  // Cart Titan — low quadruped: long body, four legs, forward snout, cargo.
  var CART =
    '<svg viewBox="0 0 320 150" fill="currentColor" aria-hidden="true">' +
    '<path class="limb" stroke-width="12" d="M96 96 L92 140"/>' +
    '<path class="limb" stroke-width="12" d="M124 98 L122 140"/>' +
    '<path class="limb" stroke-width="12" d="M212 96 L214 140"/>' +
    '<path class="limb" stroke-width="12" d="M240 94 L242 138"/>' +
    '<path class="limb" stroke-width="44" d="M58 86 C110 66 200 62 248 78"/>' +
    '<path class="limb" stroke-width="14" d="M140 68 C146 44 170 44 176 66"/>' +
    '<path class="limb" stroke-width="14" d="M184 64 C190 42 214 42 220 62"/>' +
    '<ellipse cx="272" cy="74" rx="18" ry="14"/>' +
    '<path d="M286 72 L316 78 L312 92 L280 86 Z"/>' +
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

  /* ---- Violet Evergarden poster ----------------------------------------
     An original, stylised portrait: golden braids, white-and-blue dress,
     the emerald brooch and letters on the wind. No official artwork is used
     — only hand-drawn SVG shapes evoking the character. */
  var VIOLET_SVG =
    '<svg viewBox="0 0 140 190" class="dsh-poster-art" aria-hidden="true">' +
    '<defs>' +
    '<linearGradient id="veCloth" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#f4f7fb" stop-opacity="0.95"/>' +
    '<stop offset="1" stop-color="#9fc0e8" stop-opacity="0.85"/>' +
    '</linearGradient>' +
    '<linearGradient id="veHair" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#f3d9a4"/>' +
    '<stop offset="1" stop-color="#c9a24b"/>' +
    '</linearGradient>' +
    '<radialGradient id="veHalo" cx="50%" cy="38%" r="55%">' +
    '<stop offset="0" stop-color="#cfe3ff" stop-opacity="0.55"/>' +
    '<stop offset="1" stop-color="#cfe3ff" stop-opacity="0"/>' +
    '</radialGradient>' +
    '</defs>' +
    '<rect x="0" y="0" width="140" height="190" fill="url(#veHalo)"/>' +
    '<path d="M70 118 C52 118 34 132 28 152 L22 186 L118 186 L112 152 C106 132 88 118 70 118 Z" ' +
    'fill="url(#veCloth)" opacity="0.92"/>' +
    '<path d="M56 122 L70 134 L84 122 L78 116 L70 122 L62 116 Z" fill="#0e1626" opacity="0.7"/>' +
    '<ellipse cx="70" cy="84" rx="17" ry="20" fill="#f7e7d6" opacity="0.96"/>' +
    '<path d="M53 82 C53 62 60 52 70 52 C80 52 87 62 87 82 C84 70 78 66 70 66 C62 66 56 70 53 82 Z" ' +
    'fill="url(#veHair)"/>' +
    '<path d="M55 84 C48 104 46 128 40 150 C47 150 52 132 56 112 Z" fill="url(#veHair)"/>' +
    '<path d="M85 84 C92 104 94 128 100 150 C93 150 88 132 84 112 Z" fill="url(#veHair)"/>' +
    '<circle cx="63" cy="86" r="1.7" fill="#3b6ea5"/>' +
    '<circle cx="77" cy="86" r="1.7" fill="#3b6ea5"/>' +
    '<circle cx="70" cy="140" r="4.8" fill="#3fae8f"/>' +
    '<circle cx="70" cy="140" r="4.8" fill="none" stroke="#cda349" stroke-width="1.2"/>' +
    '<g transform="rotate(-12 103 170)">' +
    '<rect x="90" y="162" width="26" height="17" rx="2" fill="#f4efe2" opacity="0.92"/>' +
    '<path d="M90 162 L103 172 L116 162" fill="none" stroke="#c9a24b" stroke-width="1.3"/>' +
    '</g>' +
    '<g transform="rotate(9 36 172)">' +
    '<rect x="24" y="164" width="24" height="16" rx="2" fill="#f4efe2" opacity="0.82"/>' +
    '<path d="M24 164 L36 173 L48 164" fill="none" stroke="#c9a24b" stroke-width="1.2"/>' +
    '</g>' +
    '</svg>'

  var POSTER =
    '<div id="dsh-anime-poster" aria-hidden="true">' +
    '<div class="dsh-poster-frame">' + VIOLET_SVG +
    '<div class="dsh-poster-cap">' +
    '<b>Violet</b><i>Evergarden</i><em>Auto Memory Doll</em>' +
    '</div></div></div>'

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

    /* Violet Evergarden poster, bottom-right (above the emblem) */
    var poster = document.createElement('div')
    poster.innerHTML = POSTER
    document.body.appendChild(poster.firstChild)

    /* letters drifting on the wind */
    if (!prefersReduced) {
      var letterField = document.createElement('div')
      letterField.id = 'dsh-anime-letters'
      for (var j = 0; j < 5; j++) {
        var letter = document.createElement('span')
        letter.className = 'dsh-anime-letter'
        letter.style.top = (8 + Math.random() * 78) + 'vh'
        var ldur = 26 + Math.random() * 26
        letter.style.animationDuration = ldur + 's'
        letter.style.animationDelay = (-Math.random() * ldur) + 's'
        letter.style.opacity = (0.14 + Math.random() * 0.14).toFixed(2)
        letter.style.setProperty('--lrot', ((Math.random() * 40) - 20).toFixed(0) + 'deg')
        var lscale = 0.7 + Math.random() * 0.7
        letter.style.width = (16 * lscale).toFixed(1) + 'px'
        letter.style.height = (11 * lscale).toFixed(1) + 'px'
        letterField.appendChild(letter)
      }
      document.body.appendChild(letterField)
    }
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

/* Ankara Tur — site davranışları (bağımlılıksız). Veri: assets/js/data.js */
(function () {
  'use strict';

  var S = window.SITE || {};
  var TOURS = window.TOURS || [];
  var CATS = window.CATEGORIES || [];
  var STORIES = (window.STORIES || []).concat(window.HIGHLIGHTS || []); /* güncel hikayeler + öne çıkanlar */
  var IG = window.IG_POSTS || [];
  var FAQ = window.FAQ || [];
  var byId = {};
  TOURS.forEach(function (t) { byId[t.id] = t; });

  /* ---------- Yardımcılar ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return ESC[c]; }); };
  var icon = function (id) { return '<svg class="ic" aria-hidden="true"><use href="#i-' + id + '"/></svg>'; };
  var money = function (n) { return Math.round(n).toLocaleString('tr-TR'); };
  var TR = { 'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u', 'â': 'a', 'î': 'i', 'û': 'u' };
  var norm = function (s) {
    return String(s || '').toLocaleLowerCase('tr').replace(/[çğıöşüâîû]/g, function (c) { return TR[c]; })
      .normalize('NFD').replace(/[̀-ͯ]/g, '');
  };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('at:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('at:' + k, JSON.stringify(v)); } catch (e) { /* gizli mod */ } }
  };
  var waLink = function (text) { return 'https://wa.me/' + S.whatsapp + (text ? '?text=' + encodeURIComponent(text) : ''); };
  var askText = function (t) { return 'Merhaba, “' + t.title + '” turu hakkında bilgi almak istiyorum.'; };
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tarihler ---------- */
  var today = new Date(); today.setHours(0, 0, 0, 0);
  var parse = function (s) { var p = s.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); };
  var addDays = function (d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; };
  var fShort = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'short', weekday: 'short' });
  var fDM = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long' });
  var fLong = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
  var fMon = new Intl.DateTimeFormat('tr-TR', { month: 'short' });
  var fWd = new Intl.DateTimeFormat('tr-TR', { weekday: 'short' });
  function rangeLabel(start, days) {
    if (!days || days <= 1) return fDM.format(start);
    var end = addDays(start, days - 1);
    if (start.getMonth() === end.getMonth()) return start.getDate() + '–' + fDM.format(end);
    return fDM.format(start) + ' – ' + fDM.format(end);
  }
  var iso = function (d) { return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
  var HORIZON = 42; /* haftalık turlarda kaç gün ilerisi listelenir */
  var upCache = {};
  function upcoming(t) {
    if (upCache[t.id]) return upCache[t.id];
    var seen = {}, list = [];
    (t.dates || []).forEach(function (x) {
      var dt = parse(x.d);
      if (dt >= today && !seen[x.d]) { seen[x.d] = 1; list.push({ d: x.d, days: x.days || 1, note: x.note || '', date: dt }); }
    });
    var w = t.weekly;
    if (w && w.dow && w.dow.length) {
      var end = addDays(today, HORIZON);
      if (w.until && parse(w.until) < end) end = parse(w.until);
      for (var dt = new Date(today); dt <= end; dt = addDays(dt, 1)) {
        var k = iso(dt);
        if (w.dow.indexOf(dt.getDay()) > -1 && !seen[k]) { seen[k] = 1; list.push({ d: k, days: w.days || 1, note: w.note || '', date: new Date(dt) }); }
      }
    }
    return (upCache[t.id] = list.sort(function (a, b) { return a.date - b.date; }));
  }
  var cur = function (t) { return t.currency || '₺'; };
  var den = function (t) { return t.currency === '€' ? '’dan' : '’den'; };
  var amount = function (t, n) { return money(n) + ' ' + cur(t); };

  /* ---------- Ortak parçalar ---------- */
  function artHtml(t) {
    var head = t.title.split(' • ')[0];
    var rest = (t.route || []).slice(1, 4).join(' · ') || t.subtitle || '';
    return '<span class="art art-' + (t.art || 'default') + '"><b>' + esc(head) + '</b><small>' + esc(rest) + '</small></span>';
  }
  function priceHtml(t) {
    if (t.price == null) return '<div class="price ask"><small>Kişi başı</small><b>Fiyat için sorun</b></div>';
    return '<div class="price"><small>' + esc(t.priceNote || 'kişi başı') + '</small><b>' + money(t.price) + '<sup>' + cur(t) + den(t) + '</sup></b></div>';
  }
  function tagIcon(t) {
    if (t.tags.indexOf('tren') > -1) return '<span title="Tren turu">' + icon('train') + '</span>';
    if (t.tags.indexOf('yaz') > -1) return '<span title="Yaz tatili">' + icon('sun') + '</span>';
    return '';
  }
  function datesHtml(t, max) {
    var up = upcoming(t);
    if (!up.length) {
      return '<p class="recurring">' + icon('clock') + '<span>' + esc(t.recurring || 'Tarih ve müsaitlik için ekibimize danışın') + '</span></p>';
    }
    var h = up.slice(0, max).map(function (x) {
      return '<button type="button" class="date-pill" data-rez="' + t.id + '" data-date="' + x.d + '" title="' + esc(fLong.format(x.date)) + ' — yer ayırt">' + icon('cal') + esc(x.days > 1 ? rangeLabel(x.date, x.days) : fShort.format(x.date)) + '</button>';
    }).join('');
    if (up.length > max) h += '<button type="button" class="date-pill more" data-open="' + t.id + '">+' + (up.length - max) + ' tarih</button>';
    return '<div class="dates">' + h + '</div>';
  }

  /* ---------- WhatsApp bağlantıları ---------- */
  function wireWa(root) {
    $$('[data-wa]', root).forEach(function (a) { a.href = waLink(a.getAttribute('data-wa')); });
  }

  /* ---------- Menü ---------- */
  var nav = $('#nav'), navLinks = $('#navLinks'), navToggle = $('#navToggle');
  navToggle.addEventListener('click', function () {
    var open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  });
  navLinks.addEventListener('click', function (e) {
    if (e.target.closest('a')) { navLinks.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); }
  });
  document.addEventListener('click', function (e) {
    if (navLinks.classList.contains('open') && !e.target.closest('#navLinks') && !e.target.closest('#navToggle')) {
      navLinks.classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false');
    }
  });
  var onScroll = function () { nav.classList.toggle('scrolled', window.scrollY > 8); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Hero afiş yığını ---------- */
  var HERO = [
    { p: 'bulten', s: 'bu-hafta', a: 'Haftalık tur bülteni' },
    { p: '29-ekim', s: '29-ekim', a: '29 Ekim haftası turları' },
    { p: 'dogu-ekspresi', s: 'dogu', a: 'Doğu Ekspresi turu' },
    { p: 'batum-yilbasi', s: 'yilbasi', a: 'Yılbaşı Batum turu' },
    { p: 'karaelmas-bk', s: 'karaelmas', a: 'Karaelmas Ekspresi ile Batı Karadeniz' },
    { p: 'd-kapadokya', s: 'gunubirlik', a: 'Günübirlik turlar' },
    { p: 'ege-butik', s: 'kultur', a: 'Konaklamalı kültür turları' },
    { p: 'balkan', s: 'balkan', a: 'Büyük Balkan turu' },
    { p: 'yaz-tatili', s: 'yaz', a: 'Yaz tatili turları' }
  ];
  var stack = $('#posterStack'), heroCur = 0, heroTimer = null;
  stack.innerHTML = HERO.map(function (h, i) {
    return '<button type="button" data-hero="' + i + '" aria-label="' + esc(h.a) + ' — hikayeyi aç"><img src="assets/img/posters/thumb/' + h.p + '.webp" alt="' + esc(h.a) + '" width="480" height="600"' + (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async"></button>';
  }).join('');
  function heroLayout() {
    var n = HERO.length;
    $$('button', stack).forEach(function (b, i) {
      var rel = (i - heroCur + n) % n;
      var pos = rel === 0 ? 0 : rel === 1 ? 1 : rel === n - 1 ? 2 : 3;
      b.setAttribute('data-pos', pos);
      b.tabIndex = pos === 0 ? 0 : -1;
      b.setAttribute('aria-hidden', pos === 3 ? 'true' : 'false');
    });
  }
  function heroPlay() { if (reduceMotion) return; heroStop(); heroTimer = setInterval(function () { heroCur = (heroCur + 1) % HERO.length; heroLayout(); }, 3400); }
  function heroStop() { clearInterval(heroTimer); }
  stack.addEventListener('click', function (e) {
    var b = e.target.closest('[data-hero]'); if (!b) return;
    var i = +b.getAttribute('data-hero');
    if (i === heroCur) { openStoryById(HERO[i].s); } else { heroCur = i; heroLayout(); heroPlay(); }
  });
  stack.addEventListener('mouseenter', heroStop);
  stack.addEventListener('mouseleave', heroPlay);
  heroLayout(); heroPlay();
  document.addEventListener('visibilitychange', function () { document.hidden ? heroStop() : heroPlay(); });

  /* ---------- Destinasyon şeridi ---------- */
  (function () {
    var seen = {}, list = [];
    TOURS.forEach(function (t) {
      (t.route || []).forEach(function (r) {
        var n = r.split(' – ')[0].trim();
        if (n.length > 18 || /^(Ankara|Tarihi|Geleneksel|Vadiler|Şelaleler)/.test(n)) return;
        if (!seen[n]) { seen[n] = 1; list.push(n); }
      });
    });
    var html = list.slice(0, 34).map(function (n) { return '<span>' + esc(n) + '</span>'; }).join('');
    $('#marquee').innerHTML = html + html;
  })();

  /* ---------- Hikaye halkaları ---------- */
  var seenStories = store.get('seen', {});
  function renderStories() {
    $('#stories').innerHTML = STORIES.map(function (s, i) {
      var sep = s.highlight && !(STORIES[i - 1] || {}).highlight ? '<span class="story-sep" aria-hidden="true">Öne çıkanlar</span>' : '';
      return sep + '<button type="button" class="story' + (s.highlight ? ' hl' : '') + (seenStories[s.id] ? ' seen' : '') + '" role="listitem" data-story="' + i + '" aria-label="' + esc(s.title) + ' hikayesini aç">' +
        '<span class="story-ring"><img src="assets/img/stories/' + s.id + '.webp" alt="" width="70" height="70" loading="lazy" decoding="async"></span><span>' + esc(s.title) + '</span></button>';
    }).join('');
  }
  renderStories();

  /* ---------- Tur listesi ---------- */
  var state = { filter: 'hepsi', q: '' };
  var chips = $('#chips');
  chips.innerHTML = CATS.map(function (c) {
    var n = c.id === 'hepsi' ? TOURS.length : TOURS.filter(function (t) { return t.tags.indexOf(c.id) > -1; }).length;
    return '<button type="button" class="chip" role="tab" data-filter="' + c.id + '" aria-selected="' + (c.id === state.filter) + '">' + esc(c.label) + '<span class="n">' + n + '</span></button>';
  }).join('');
  chips.addEventListener('click', function (e) {
    var b = e.target.closest('[data-filter]'); if (!b) return;
    setFilter(b.getAttribute('data-filter'));
  });
  function setFilter(f) {
    state.filter = f;
    $$('.chip', chips).forEach(function (c) { c.setAttribute('aria-selected', c.getAttribute('data-filter') === f); });
    var active = $('.chip[aria-selected="true"]', chips);
    if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest', inline: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
    renderTours();
  }
  var searchTimer;
  $('#search').addEventListener('input', function (e) {
    clearTimeout(searchTimer);
    var v = e.target.value;
    searchTimer = setTimeout(function () { state.q = v; renderTours(); }, 120);
  });

  var hay = {};
  TOURS.forEach(function (t) {
    hay[t.id] = norm([t.title, t.subtitle, t.summary, t.duration, (t.route || []).join(' '), (t.variants || []).map(function (v) { return v.name; }).join(' '),
      t.tags.map(function (g) { var c = CATS.filter(function (c) { return c.id === g; })[0]; return c ? c.label : g; }).join(' ')].join(' '));
  });
  function matches(t) {
    if (state.filter !== 'hepsi' && t.tags.indexOf(state.filter) < 0) return false;
    if (!state.q.trim()) return true;
    return norm(state.q).split(/\s+/).filter(Boolean).every(function (w) { return hay[t.id].indexOf(w) > -1; });
  }
  function firstDate(t) { var u = upcoming(t); return u.length ? u[0].date.getTime() : Infinity; }

  function cardHtml(t, reveal) {
    var media = t.cover ? '<img src="' + t.cover + '" alt="' + esc(t.title) + '" loading="lazy" decoding="async" width="800" height="500">' : artHtml(t);
    var route = (t.route || []).slice(0, 4);
    return '<article class="card' + (reveal ? ' reveal' : '') + '">' +
      '<button type="button" class="card-media" data-open="' + t.id + '" aria-label="' + esc(t.title) + ' detayları">' + media +
      (t.badge ? '<span class="badge">' + esc(t.badge) + '</span>' : '') +
      '<span class="tagicons">' + tagIcon(t) + '</span>' +
      '<span class="dur">' + icon('clock') + esc(t.duration) + '</span></button>' +
      '<div class="card-body">' +
      (t.subtitle ? '<p class="card-sub">' + esc(t.subtitle) + '</p>' : '') +
      '<h4><button type="button" data-open="' + t.id + '">' + esc(t.title) + '</button></h4>' +
      '<p class="card-sum">' + esc(t.summary) + '</p>' +
      datesHtml(t, 2) +
      '<button type="button" class="more-link" data-open="' + t.id + '">Program ve detaylar' + icon('arrow') + '</button>' +
      '<div class="card-foot">' + priceHtml(t) +
      '<div class="card-actions"><button type="button" class="btn btn-dark" data-rez="' + t.id + '">Rezervasyon</button>' +
      '<a class="wa-round" href="' + waLink(askText(t)) + '" target="_blank" rel="noopener" aria-label="' + esc(t.title) + ' için WhatsApp’tan sor">' + icon('wa') + '</a></div>' +
      '</div></div></article>';
  }
  function dayCardHtml(t, reveal) {
    var up = upcoming(t);
    var next = up.length ? icon('cal') + 'İlk çıkış: ' + esc(fShort.format(up[0].date)) + (up.length > 1 ? ' · +' + (up.length - 1) + ' tarih' : '') : icon('clock') + 'Tarih için danışın';
    var img = t.tile || t.cover;
    return '<article class="dcard' + (reveal ? ' reveal' : '') + '">' +
      '<button type="button" class="dcard-media" data-open="' + t.id + '" aria-label="' + esc(t.title) + ' detayları">' +
      (img ? '<img src="' + img + '" alt="' + esc(t.title) + '" loading="lazy" decoding="async" width="221" height="142">' : artHtml(t)) +
      (t.badge ? '<span class="badge">' + esc(t.badge) + '</span>' : '') +
      (t.price != null ? '<span class="dcard-price">' + money(t.price) + cur(t) + '<small>/kişi</small></span>' : '') + '</button>' +
      '<div class="dcard-body"><h4><button type="button" data-open="' + t.id + '">' + esc(t.title) + '</button></h4>' +
      '<p class="dcard-next">' + next + '</p>' +
      '<div class="dcard-actions"><button type="button" class="btn btn-outline" data-open="' + t.id + '">Detay</button><button type="button" class="btn btn-dark" data-rez="' + t.id + '">Yer ayırt</button>' +
      '<a class="wa-round" href="' + waLink(askText(t)) + '" target="_blank" rel="noopener" aria-label="' + esc(t.title) + ' için WhatsApp’tan sor">' + icon('wa') + '</a></div></div></article>';
  }

  var firstRender = true;
  function renderTours() {
    var list = TOURS.filter(matches);
    var stay = list.filter(function (t) { return t.tags.indexOf('gunubirlik') < 0; })
      .map(function (t, i) { return { t: t, i: i, d: firstDate(t) }; })
      .sort(function (a, b) { return a.d - b.d || a.i - b.i; }).map(function (x) { return x.t; });
    var day = list.filter(function (t) { return t.tags.indexOf('gunubirlik') > -1; });
    $('#gridStay').innerHTML = stay.map(function (t) { return cardHtml(t, firstRender); }).join('');
    $('#gridDay').innerHTML = day.map(function (t) { return dayCardHtml(t, firstRender); }).join('');
    $('#blockStay').hidden = !stay.length;
    $('#blockDay').hidden = !day.length;
    $('#countStay').textContent = stay.length + ' tur';
    $('#countDay').textContent = day.length + ' tur';
    $('#empty').hidden = !!list.length;
    if (firstRender) { firstRender = false; observeReveal(); }
  }

  /* ---------- Tur takvimi ---------- */
  var calExpanded = false, expandedDays = {};
  function renderCalendar() {
    var groups = {};
    TOURS.forEach(function (t) {
      upcoming(t).forEach(function (x) { (groups[x.d] = groups[x.d] || []).push({ t: t, x: x }); });
    });
    var keys = Object.keys(groups).sort();
    var limit = calExpanded ? keys.length : 8;
    $('#calendar').innerHTML = keys.slice(0, limit).map(function (k) {
      var items = groups[k], dt = parse(k), isToday = dt.getTime() === today.getTime();
      var showAll = expandedDays[k], max = 5;
      var rows = (showAll ? items : items.slice(0, max)).map(function (it) {
        var t = it.t, meta = [it.x.days > 1 ? rangeLabel(it.x.date, it.x.days) : 'Günübirlik', t.price != null ? amount(t, t.price) + den(t) : 'Fiyat için sorun'];
        if (it.x.note) meta.push(it.x.note);
        return '<div class="cal-item"><button type="button" class="t" data-open="' + t.id + '">' + esc(t.title) + '<span class="meta">' + esc(meta.join(' · ')) + '</span></button>' +
          '<button type="button" class="go" data-rez="' + t.id + '" data-date="' + k + '">Yer ayırt</button></div>';
      }).join('');
      if (!showAll && items.length > max) rows += '<div class="cal-item"><button type="button" class="go" data-expand-day="' + k + '">+' + (items.length - max) + ' tur daha</button></div>';
      return '<div class="cal-day"><div class="cal-date' + (isToday ? ' today' : '') + '"><b>' + dt.getDate() + '</b><span>' + esc(fMon.format(dt)) + '</span><small>' + (isToday ? 'Bugün' : esc(fWd.format(dt))) + '</small></div><div class="cal-list">' + rows + '</div></div>';
    }).join('') || '<p class="sec-sub">Yakın tarihli çıkış bulunmuyor. Güncel program için WhatsApp’tan yazın.</p>';
    var more = $('#calMore');
    more.hidden = keys.length <= 8;
    more.textContent = calExpanded ? 'Daha az göster' : 'Tüm tarihleri göster (' + keys.length + ')';
  }
  $('#calMore').addEventListener('click', function () {
    calExpanded = !calExpanded; renderCalendar();
    if (!calExpanded) $('#takvim').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
  $('#calendar').addEventListener('click', function (e) {
    var b = e.target.closest('[data-expand-day]'); if (!b) return;
    expandedDays[b.getAttribute('data-expand-day')] = true; renderCalendar();
  });

  /* ---------- Avantajlar, kalkış noktaları, Instagram, SSS ---------- */
  var perks = (S.payment || []).concat([{ icon: 'shield', title: 'TÜRSAB güvencesi', text: 'Belge No ' + S.tursab + ' · seyahat sağlık sigortası.' }]);
  $('#perks').innerHTML = perks.map(function (p) {
    return '<div class="perk"><span class="p-ic">' + icon(p.icon) + '</span><div><b>' + esc(p.title) + '</b><p>' + esc(p.text) + '</p></div></div>';
  }).join('');

  var mapFrame = $('#mapFrame');
  var mapUrl = function (q) { return 'https://www.google.com/maps?q=' + encodeURIComponent(q) + '&output=embed'; };
  $('#stops').innerHTML = (S.departures || []).map(function (d, i) {
    return '<li><button type="button" class="stop' + (i === 0 ? ' active' : '') + '" data-map="' + esc(d.map) + '"><time>' + esc(d.time) + '</time><span><b>' + esc(d.name) + '</b><small>Haritada göster</small></span>' + icon('pin') + '</button></li>';
  }).join('');
  $('#stops').addEventListener('click', function (e) {
    var b = e.target.closest('[data-map]'); if (!b) return;
    $$('.stop', $('#stops')).forEach(function (s) { s.classList.toggle('active', s === b); });
    mapFrame.src = mapUrl(b.getAttribute('data-map'));
  });
  if ('IntersectionObserver' in window) {
    var mio = new IntersectionObserver(function (en) {
      if (en[0].isIntersecting) { mapFrame.src = mapFrame.getAttribute('data-src'); mio.disconnect(); }
    }, { rootMargin: '400px' });
    mio.observe(mapFrame);
  } else { mapFrame.src = mapFrame.getAttribute('data-src'); }

  var fIg = new Intl.DateTimeFormat('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
  $('#igGrid').innerHTML = IG.map(function (p) {
    return '<a class="ig-post reveal" href="' + p.url + '" target="_blank" rel="noopener" aria-label="Instagram: ' + esc(p.title) + '">' +
      '<img src="assets/img/posters/thumb/' + p.img + '.webp" alt="' + esc(p.title) + '" loading="lazy" decoding="async" width="480" height="600">' +
      '<span class="ig-mark">' + icon('ig') + '</span><span class="ov"><b>' + esc(p.title) + '</b><small>' + esc(fIg.format(parse(p.date))) + '</small></span></a>';
  }).join('');

  $('#faq').innerHTML = FAQ.map(function (f, i) {
    return '<details class="reveal"' + (i === 0 ? ' open' : '') + '><summary>' + esc(f.q) + '</summary><p>' + esc(f.a) + '</p></details>';
  }).join('');

  /* ---------- Kaydırma kilidi ---------- */
  function syncLock() {
    var any = $$('dialog[open]').length || !$('#storyViewer').hidden;
    document.body.classList.toggle('lock', !!any);
  }

  /* ---------- Tur detay penceresi ---------- */
  var tourModal = $('#tourModal'), tourBody = $('#tourModalBody');
  var tourDepth = 0, ignorePop = false; /* tourDepth: pencere için eklenen geçmiş kaydı (0/1) */
  function list(items, cls, ic) {
    return '<ul class="checks ' + (cls || '') + '">' + items.map(function (x) { return '<li>' + icon(ic || 'check') + '<span>' + esc(x) + '</span></li>'; }).join('') + '</ul>';
  }
  function variantsHtml(t) {
    if (!t.variants || !t.variants.length) return '';
    var two = t.variants.some(function (v) { return v.price2; });
    var head = two ? '<tr><th>Seçenek</th><th class="p">3 gece</th><th class="p">4 gece</th></tr>' : '<tr><th>Seçenek</th><th class="p">Kişi başı</th></tr>';
    var rows = t.variants.map(function (v) {
      var p = v.price != null ? (v.addon ? '+' : '') + money(v.price) + ' ' + cur(t) : 'Sorun';
      return '<tr><td>' + esc(v.name) + '</td><td class="p">' + p + '</td>' + (two ? '<td class="p">' + (v.price2 ? money(v.price2) + ' ' + cur(t) : '—') + '</td>' : '') + '</tr>';
    }).join('');
    return '<section><h5>' + esc(t.variantsTitle || 'Seçenekler ve fiyatlar') + '</h5><table class="vtable"><thead>' + head + '</thead><tbody>' + rows + '</tbody></table></section>';
  }
  function renderTourModal(t) {
    var up = upcoming(t);
    var posters = (t.posters || []).map(function (p) { return { thumb: 'assets/img/posters/thumb/' + p + '.webp', full: 'assets/img/posters/' + p + '.webp' }; });
    var gallery = (t.gallery || []).map(function (g) { return { thumb: 'assets/img/gallery/thumb/' + g + '.webp', full: 'assets/img/gallery/' + g + '.webp' }; });
    var media = posters.concat(gallery);
    var h = '';
    h += '<div class="tm-hero">' + (t.cover ? '<img src="' + t.cover + '" alt="">' : (t.tile ? '<img src="' + t.tile + '" alt="">' : artHtml(t))) +
      '<button type="button" class="icon-btn tm-close" data-close aria-label="Kapat">' + icon('x') + '</button>' +
      '<button type="button" class="icon-btn tm-share" data-share="' + t.id + '" aria-label="Paylaş">' + icon('share') + '</button>' +
      '<div class="tm-head">' + (t.subtitle ? '<p class="card-sub">' + esc(t.subtitle) + '</p>' : '') + '<h3 id="tmTitle">' + esc(t.title) + '</h3><div class="pills">' +
      '<span>' + icon('clock') + esc(t.duration) + '</span>' + (t.badge ? '<span>' + esc(t.badge) + '</span>' : '') +
      '<span>' + icon('pin') + esc(t.departure || 'Ankara çıkışlı') + '</span></div></div></div>';

    h += '<div class="tm-grid"><div class="tm-main">';
    h += '<p class="tm-sum">' + esc(t.summary) + '</p>';
    if (t.route && t.route.length) h += '<section><h5>Rota</h5><div class="route">' + t.route.map(function (r, i) { return (i ? '<i></i>' : '') + '<span>' + esc(r) + '</span>'; }).join('') + '</div></section>';
    h += variantsHtml(t);
    if (t.highlights && t.highlights.length) h += '<section><h5>Öne çıkanlar</h5>' + list(t.highlights, 'hl', 'check') + '</section>';
    if (t.program && t.program.length) h += '<section><h5>Program</h5><ol class="program">' + t.program.map(function (p) { return '<li><small>' + esc(p.day) + '</small><b>' + esc(p.title) + '</b><p>' + esc(p.text) + '</p></li>'; }).join('') + '</ol></section>';
    if ((t.includes && t.includes.length) || (t.excludes && t.excludes.length)) {
      h += '<div class="two">' + (t.includes && t.includes.length ? '<section><h5>Fiyata dahil</h5>' + list(t.includes) + '</section>' : '') +
        (t.excludes && t.excludes.length ? '<section><h5>Dahil değil</h5>' + list(t.excludes, 'no', 'x') + '</section>' : '') + '</div>';
    } else {
      h += '<section><h5>Fiyata dahil hizmetler</h5><p class="tm-sum" style="font-size:15px">Program ve fiyata dahil hizmetlerin güncel listesi için ekibimize WhatsApp’tan danışın.</p></section>';
    }
    if (t.useSiteDepartures) h += '<section><h5>Hareket saatleri</h5>' + list((S.departures || []).map(function (d) { return d.time + ' — ' + d.name; }), 'hl', 'clock') + '</section>';
    var notes = (t.notes || []).concat(['Program, fiyat ve tarihlerde değişiklik olabilir; rezervasyon öncesi teyit alın.']);
    h += '<section><h5>Bilgilendirme</h5><ul class="notes">' + notes.map(function (n) { return '<li>' + esc(n) + '</li>'; }).join('') + '</ul></section>';
    if (media.length) {
      h += '<section><h5>Afişler ve fotoğraflar</h5><div class="thumbs">' + media.map(function (m, i) {
        return '<button type="button" data-lb="' + i + '" aria-label="Görseli büyüt"><img src="' + m.thumb + '" alt="" loading="lazy" decoding="async"></button>';
      }).join('') + '</div>' + (t.galleryCredit ? '<p class="credit">' + esc(t.galleryCredit) + '</p>' : '') + '</section>';
    }
    h += '</div>';

    var disc = t.price != null ? '<p class="disc">Nakit ödemede %5 indirimle ' + money(t.price * 0.95) + ' ' + cur(t) + '</p>' : '';
    h += '<aside class="tm-side"><div class="side-card">' + priceHtml(t) + disc +
      '<button type="button" class="btn btn-dark btn-block" data-rez="' + t.id + '">' + icon('cal') + 'Rezervasyon yap</button>' +
      '<a class="btn btn-wa btn-block" href="' + waLink(askText(t)) + '" target="_blank" rel="noopener">' + icon('wa') + 'WhatsApp’tan sor</a>' +
      '<div class="side-links"><a href="tel:' + S.tel + '">' + icon('phone') + 'Ara</a>' + (t.ig ? '<a href="' + t.ig + '" target="_blank" rel="noopener">' + icon('ig') + 'Instagram’da gör</a>' : '') + '</div></div>';
    h += '<div class="side-card"><h5 style="margin:0;font-size:13px;letter-spacing:.07em;text-transform:uppercase;color:var(--ink-3)">Yaklaşan tarihler</h5>';
    if (up.length) {
      h += '<div class="side-dates">' + up.map(function (x) {
        return '<button type="button" data-rez="' + t.id + '" data-date="' + x.d + '"><span>' + esc(x.days > 1 ? rangeLabel(x.date, x.days) : fLong.format(x.date)) + (x.note ? '<br><small>' + esc(x.note) + '</small>' : '') + '</span>' + icon('arrow') + '</button>';
      }).join('') + '</div>';
      if (t.recurring) h += '<p class="recurring">' + icon('clock') + '<span>' + esc(t.recurring) + '</span></p>';
    } else {
      h += '<p class="recurring">' + icon('clock') + '<span>' + esc(t.recurring || 'Tarih ve müsaitlik için ekibimize danışın') + '</span></p>';
    }
    h += '</div></aside></div>';
    h += '<div class="tm-bar"><button type="button" class="btn btn-dark" data-rez="' + t.id + '">Rezervasyon yap</button>' +
      '<a class="wa-round" href="' + waLink(askText(t)) + '" target="_blank" rel="noopener" aria-label="WhatsApp’tan sor">' + icon('wa') + '</a>' +
      '<a class="wa-round" style="background:#eef1fb;color:var(--navy)" href="tel:' + S.tel + '" aria-label="Ara">' + icon('phone') + '</a></div>';

    tourBody.innerHTML = h;
    tourBody.scrollTop = 0;
    tourBody._media = media.map(function (m) { return m.full; });
  }
  function openTour(id, fromHash) {
    var t = byId[id]; if (!t) return;
    renderTourModal(t);
    var wasOpen = tourModal.open;
    if (!wasOpen) tourModal.showModal();
    syncLock();
    if (fromHash) { if (!wasOpen) tourDepth = 0; }
    else if (location.hash !== '#tur/' + id) {
      try {
        if (wasOpen && tourDepth) history.replaceState({ tour: id }, '', '#tur/' + id);
        else { history.pushState({ tour: id }, '', '#tur/' + id); tourDepth = 1; }
      } catch (e) { /* file:// vb. */ }
    }
    document.title = t.title + ' — Ankara Tur';
  }
  var baseTitle = document.title;
  tourModal.addEventListener('close', function () {
    document.title = baseTitle;
    syncLock();
    if (/^#tur\//.test(location.hash)) {
      if (tourDepth) { tourDepth = 0; ignorePop = true; history.back(); }
      else { try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { location.hash = ''; } }
    }
  });
  window.addEventListener('popstate', function () {
    if (ignorePop) { ignorePop = false; return; }
    var m = location.hash.match(/^#tur\/(.+)$/);
    if (m) openTour(decodeURIComponent(m[1]), true);
    else if (tourModal.open) { tourDepth = 0; tourModal.close(); }
  });

  /* Dialog ortak: dışına tıklayınca ve [data-close] ile kapanır */
  $$('dialog.modal').forEach(function (d) {
    d.addEventListener('click', function (e) {
      if (e.target === d || e.target.closest('[data-close]')) d.close();
    });
    d.addEventListener('close', syncLock);
  });

  /* ---------- Rezervasyon ---------- */
  var rez = $('#rezModal'), form = $('#rezForm');
  var f = {
    tour: $('#rezTour'), date: $('#rezDate'), variant: $('#rezVariant'), variantWrap: $('#rezVariantWrap'),
    adult: $('#rezAdult'), child: $('#rezChild'), stop: $('#rezStop'), stopWrap: $('#rezStopWrap'),
    name: $('#rezName'), phone: $('#rezPhone'), note: $('#rezNote'), sum: $('#rezSum')
  };
  (function () {
    var stay = TOURS.filter(function (t) { return t.tags.indexOf('gunubirlik') < 0; });
    var day = TOURS.filter(function (t) { return t.tags.indexOf('gunubirlik') > -1; });
    var opt = function (t) { return '<option value="' + t.id + '">' + esc(t.title) + ' — ' + esc(t.duration) + '</option>'; };
    f.tour.innerHTML = '<optgroup label="Konaklamalı turlar & tatiller">' + stay.map(opt).join('') + '</optgroup><optgroup label="Günübirlik turlar">' + day.map(opt).join('') + '</optgroup>';
  })();
  function variantOptions(t) {
    var out = [];
    (t.variants || []).forEach(function (v, i) {
      if (v.price2) {
        out.push({ v: i + ':3', label: v.name + ' · 3 gece', price: v.price });
        out.push({ v: i + ':4', label: v.name + ' · 4 gece', price: v.price2 });
      } else {
        out.push({ v: String(i), label: v.name + (v.price != null ? ' — ' + (v.addon ? '+' : '') + money(v.price) + ' ' + cur(t) : ''), price: v.price, addon: !!v.addon });
      }
    });
    if (out.length && out.some(function (o) { return o.addon; })) out.unshift({ v: '', label: 'Paket istemiyorum', price: 0, addon: true });
    return out;
  }
  function fillRezForTour(t, date) {
    var up = upcoming(t);
    f.date.innerHTML = up.map(function (x) {
      return '<option value="' + x.d + '">' + esc((x.days > 1 ? rangeLabel(x.date, x.days) + ' (' + fWd.format(x.date) + ')' : fLong.format(x.date)) + (x.note ? ' · ' + x.note : '')) + '</option>';
    }).join('') + '<option value="">' + (up.length ? 'Farklı / esnek tarih' : 'Tarih için danışacağım') + '</option>';
    f.date.value = date && up.some(function (x) { return x.d === date; }) ? date : (up[0] ? up[0].d : '');
    var vo = variantOptions(t);
    f.variantWrap.hidden = !vo.length;
    f.variant.innerHTML = vo.map(function (o) { return '<option value="' + o.v + '">' + esc(o.label) + '</option>'; }).join('');
    f.variant._opts = vo;
    var stops = [];
    if (t.useSiteDepartures || t.tags.indexOf('gunubirlik') > -1) stops = (S.departures || []).map(function (d) { return d.time + ' · ' + d.name; });
    else if (t.departure) stops = t.departure.split(' / ').map(function (s) { return s.trim(); });
    f.stopWrap.hidden = !stops.length;
    f.stop.innerHTML = stops.map(function (s) { return '<option>' + esc(s) + '</option>'; }).join('') + (stops.length ? '<option value="">Fark etmez / sonra bildireceğim</option>' : '');
  }
  function unitPrice(t) {
    var opts = f.variant._opts || [], o = opts.filter(function (x) { return x.v === f.variant.value; })[0];
    if (!o) return { unit: t.price, label: '' };
    if (o.addon) return { unit: t.price != null ? t.price + (o.price || 0) : null, label: o.price ? '+ ' + money(o.price) + ' ' + cur(t) + ' paket' : '' };
    return { unit: o.price != null ? o.price : null, label: '' };
  }
  function num(input) {
    var w = input.closest('.stepper'), min = +w.getAttribute('data-min'), max = +w.getAttribute('data-max');
    var v = parseInt(input.value, 10); if (isNaN(v)) v = min;
    return Math.max(min, Math.min(max, v));
  }
  function clampStep(input) { input.value = num(input); }
  function updateSum() {
    var t = byId[f.tour.value]; if (!t) return;
    var a = num(f.adult), c = num(f.child), up = unitPrice(t);
    var h = '<div class="row"><span>Kişi</span><b>' + a + ' yetişkin' + (c ? ', ' + c + ' çocuk' : '') + '</b></div>';
    if (up.unit != null) {
      var total = up.unit * a;
      h += '<div class="row"><span>Kişi başı</span><b>' + money(up.unit) + ' ' + cur(t) + '</b></div>' +
        '<div class="row total"><span>Tahmini tutar' + (c ? ' (yetişkin)' : '') + '</span><b>' + money(total) + ' ' + cur(t) + '</b></div>' +
        '<div class="row"><span>Nakit ödemede %5 indirimle</span><b>' + money(total * 0.95) + ' ' + cur(t) + '</b></div>';
      if (c) h += '<p class="hint">Çocuk fiyatı yaşa ve otele göre ayrıca bildirilir.</p>';
      h += '<p class="hint">Kesin fiyat ve müsaitlik ekibimizin teyidiyle netleşir.</p>';
    } else {
      h += '<div class="row total"><span>Fiyat</span><b>WhatsApp’tan iletilecek</b></div>';
    }
    f.sum.innerHTML = h;
  }
  function buildMessage() {
    var t = byId[f.tour.value], a = num(f.adult), c = num(f.child), up = unitPrice(t);
    var dateTxt = f.date.value ? (function () { var x = upcoming(t).filter(function (y) { return y.d === f.date.value; })[0]; return x ? (x.days > 1 ? rangeLabel(x.date, x.days) + ' ' + x.date.getFullYear() : fLong.format(x.date)) : f.date.value; })() : 'Esnek / danışacağım';
    var vo = (f.variant._opts || []).filter(function (o) { return o.v === f.variant.value; })[0];
    var lines = [
      'Merhaba, web sitenizden rezervasyon talebi:',
      '',
      '• Tur: ' + t.title + ' (' + t.duration + ')',
      '• Tarih: ' + dateTxt
    ];
    if (vo && !f.variantWrap.hidden) lines.push('• Seçenek: ' + vo.label);
    lines.push('• Kişi: ' + a + ' yetişkin' + (c ? ', ' + c + ' çocuk' : ''));
    if (!f.stopWrap.hidden && f.stop.value) lines.push('• Biniş noktası: ' + f.stop.value);
    lines.push('• Ad soyad: ' + (f.name.value.trim() || '-'));
    if (f.phone.value.trim()) lines.push('• Telefon: ' + f.phone.value.trim());
    if (f.note.value.trim()) lines.push('• Not: ' + f.note.value.trim());
    if (up.unit != null) lines.push('', 'Tahmini tutar: ' + money(up.unit * a) + ' ' + cur(t) + ' (' + a + ' × ' + money(up.unit) + ' ' + cur(t) + ')');
    lines.push('', 'Müsaitlik ve ödeme bilgisi rica ederim.');
    return lines.join('\n');
  }
  function validate() {
    var ok = true;
    var nameF = f.name.closest('.field'), phoneF = f.phone.closest('.field');
    var nOk = f.name.value.trim().length >= 2;
    nameF.classList.toggle('invalid', !nOk); ok = ok && nOk;
    var digits = f.phone.value.replace(/\D/g, '');
    var pOk = !digits.length || (digits.length >= 10 && digits.length <= 13);
    phoneF.classList.toggle('invalid', !pOk); ok = ok && pOk;
    if (!nOk) f.name.focus(); else if (!pOk) f.phone.focus();
    return ok;
  }
  function showRezForm(show) {
    $('.rez-body', form).hidden = !show; $('.rez-foot', form).hidden = !show;
    var done = $('.rez-done', form); if (done) done.hidden = show;
  }
  function openRez(id, date) {
    var t = byId[id] || TOURS[0];
    showRezForm(true);
    f.tour.value = t.id;
    fillRezForTour(t, date);
    f.name.value = store.get('name', '') || f.name.value;
    f.phone.value = store.get('phone', '') || f.phone.value;
    $$('.field.invalid', form).forEach(function (x) { x.classList.remove('invalid'); });
    updateSum();
    if (!rez.open) rez.showModal();
    syncLock();
  }
  f.tour.addEventListener('change', function () { fillRezForTour(byId[f.tour.value]); updateSum(); });
  [f.variant, f.date, f.adult, f.child].forEach(function (el) { el.addEventListener('change', updateSum); el.addEventListener('input', updateSum); });
  [f.adult, f.child].forEach(function (el) { el.addEventListener('change', function () { clampStep(el); updateSum(); }); });
  f.name.addEventListener('input', function () { f.name.closest('.field').classList.remove('invalid'); });
  f.phone.addEventListener('input', function () { f.phone.closest('.field').classList.remove('invalid'); });
  $$('.stepper', form).forEach(function (st) {
    st.addEventListener('click', function (e) {
      var b = e.target.closest('[data-step]'); if (!b) return;
      var input = $('input', st); input.value = num(input) + (+b.getAttribute('data-step')); clampStep(input); updateSum();
    });
  });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) return;
    clampStep(f.adult); clampStep(f.child);
    store.set('name', f.name.value.trim()); store.set('phone', f.phone.value.trim());
    var url = waLink(buildMessage());
    var w = window.open(url, '_blank');
    if (w) { try { w.opener = null; } catch (er) { /* yoksay */ } } else { location.href = url; return; }
    var done = $('.rez-done', form);
    if (!done) { done = document.createElement('div'); done.className = 'rez-done'; form.appendChild(done); }
    done.innerHTML = '<span class="ok">' + icon('check') + '</span><h3>Talebiniz hazır!</h3><p>WhatsApp’ta açılan mesajı gönderin; ekibimiz kontenjanı teyit edip size dönüş yapacak.</p>' +
      '<a class="btn btn-wa" href="' + url + '" target="_blank" rel="noopener">' + icon('wa') + 'WhatsApp açılmadıysa tıklayın</a>' +
      '<button type="button" class="btn btn-outline" data-close>Kapat</button>';
    showRezForm(false);
  });
  $('#rezCopy').addEventListener('click', function () {
    copy(buildMessage(), 'Mesaj kopyalandı');
  });

  /* ---------- Hikaye görüntüleyici ---------- */
  var sv = { el: $('#storyViewer'), img: $('#svImg'), vid: $('#svVid'), bars: $('#svBars'), s: 0, f: 0, start: 0, elapsed: 0, paused: false, raf: 0, dur: 6000, lastFocus: null, muted: true, isVideo: false };
  function frameAt(s, k) { var fr = s.frames[k]; return typeof fr === 'string' ? { img: fr } : fr; }
  function openStoryById(id) { var i = STORIES.map(function (s) { return s.id; }).indexOf(id); if (i > -1) openStory(i); }
  function openStory(i, fi) {
    if (sv.el.hidden) sv.lastFocus = document.activeElement;
    sv.s = i; sv.f = fi || 0;
    var s = STORIES[i];
    sv.el.hidden = false; syncLock();
    $('#svTitle').textContent = s.title + (s.highlight ? ' · öne çıkan' : '');
    sv.bars.innerHTML = s.frames.map(function () { return '<span><i></i></span>'; }).join('');
    var acts = '', t = s.tour && byId[s.tour];
    if (s.highlight) acts += '<button type="button" class="btn btn-gold" data-sv-goto="#turlar">Güncel turlar</button>';
    else if (s.tour) acts += '<button type="button" class="btn btn-gold" data-sv-tour="' + s.tour + '">Turu incele</button>';
    else if (s.filter) acts += '<button type="button" class="btn btn-gold" data-sv-filter="' + s.filter + '">Turları gör</button>';
    else acts += '<button type="button" class="btn btn-gold" data-sv-goto="#takvim">Tur takvimi</button>';
    acts += '<a class="btn btn-wa" href="' + waLink(t ? askText(t) : 'Merhaba, “' + s.title + '” paylaşımınızdaki turlar hakkında bilgi almak istiyorum.') + '" target="_blank" rel="noopener">' + icon('wa') + 'WhatsApp’tan sor</a>';
    $('#svActions').innerHTML = acts;
    seenStories[s.id] = 1; store.set('seen', seenStories);
    var ring = $('.story[data-story="' + i + '"]'); if (ring) ring.classList.add('seen');
    showFrame();
    $('#svClose').focus({ preventScroll: true });
  }
  function stopVideo() {
    var v = sv.vid; v.pause(); v.onended = v.onerror = v.onloadeddata = null;
    if (v.getAttribute('src')) { v.removeAttribute('src'); v.load(); }
    v.hidden = true;
  }
  function showFrame() {
    var s = STORIES[sv.s], fr = frameAt(s, sv.f), n = s.frames.length;
    cancelAnimationFrame(sv.raf); stopVideo();
    $$('i', sv.bars).forEach(function (b, k) { b.style.width = k < sv.f ? '100%' : '0%'; });
    $('#svCap').textContent = s.highlight ? 'Öne çıkan hikaye · ' + (fr.date || 'arşiv') : (sv.f === 0 ? (s.caption || '') : (s.caption && s.caption.indexOf('@') > -1 ? s.caption : ''));
    var src = 'assets/img/' + fr.img + '.webp';
    sv.img.alt = s.title + ' — ' + (sv.f + 1) + '/' + n;
    sv.elapsed = 0; sv.start = 0; sv.isVideo = !!fr.video;
    $('#svMute').hidden = !fr.video;
    if (fr.video) {
      var v = sv.vid;
      sv.img.hidden = true; sv.img.removeAttribute('src');
      v.hidden = false; v.muted = sv.muted; v.poster = src;
      v.onloadeddata = function () { sv.start = performance.now(); if (!sv.paused) v.play().catch(function () { }); tick(); };
      v.onended = function () { svNext(); };
      v.onerror = function () { stopVideo(); sv.isVideo = false; sv.img.hidden = false; sv.img.src = src; sv.start = performance.now(); tick(); };
      v.src = 'assets/' + fr.video; v.load();
    } else {
      sv.img.hidden = false;
      var go = function () { if (sv.img.getAttribute('src') !== src) return; sv.start = performance.now(); tick(); };
      sv.img.onload = go; sv.img.onerror = go;
      sv.img.src = src;
      if (sv.img.complete && sv.img.naturalWidth) go();
    }
    var nx = sv.f + 1 < n ? frameAt(s, sv.f + 1) : null;
    if (nx) { var pre = new Image(); pre.src = 'assets/img/' + nx.img + '.webp'; }
  }
  function tick() {
    cancelAnimationFrame(sv.raf);
    sv.raf = requestAnimationFrame(function step(now) {
      if (sv.el.hidden) return;
      if (sv.paused || !sv.start) { sv.raf = requestAnimationFrame(step); return; }
      var p = sv.isVideo ? (sv.vid.duration ? Math.min(1, sv.vid.currentTime / sv.vid.duration) : 0) : Math.min(1, (sv.elapsed + now - sv.start) / sv.dur);
      var bar = $$('i', sv.bars)[sv.f]; if (bar) bar.style.width = (p * 100) + '%';
      if (!sv.isVideo && p >= 1) { svNext(); return; }
      sv.raf = requestAnimationFrame(step);
    });
  }
  function svPause(p) {
    if (p === sv.paused) return;
    if (p) { sv.elapsed += performance.now() - sv.start; } else { sv.start = performance.now(); }
    sv.paused = p;
    if (sv.isVideo) { if (p) sv.vid.pause(); else sv.vid.play().catch(function () { }); }
    $('#svPause').innerHTML = icon(p ? 'play' : 'pause');
    $('#svPause').setAttribute('aria-label', p ? 'Devam et' : 'Duraklat');
  }
  function svNext() { var s = STORIES[sv.s]; if (sv.f < s.frames.length - 1) { sv.f++; showFrame(); } else if (sv.s < STORIES.length - 1) openStory(sv.s + 1); else closeStory(); }
  function svPrev() { if (sv.f > 0) { sv.f--; showFrame(); } else if (sv.s > 0) openStory(sv.s - 1); else showFrame(); }
  function closeStory() {
    cancelAnimationFrame(sv.raf); stopVideo(); sv.el.hidden = true; svPause(false); sv.img.removeAttribute('src'); syncLock();
    if (sv.lastFocus && sv.lastFocus.focus) sv.lastFocus.focus({ preventScroll: true });
  }
  $('#svMute').addEventListener('click', function () {
    sv.muted = !sv.muted; sv.vid.muted = sv.muted;
    this.innerHTML = icon(sv.muted ? 'mute' : 'vol');
    this.setAttribute('aria-label', sv.muted ? 'Sesi aç' : 'Sesi kapat');
  });
  $('#svNext').addEventListener('click', function () { if (!sv.held) svNext(); });
  $('#svPrev').addEventListener('click', function () { if (!sv.held) svPrev(); });
  $('#svClose').addEventListener('click', closeStory);
  $('#svPause').addEventListener('click', function () { svPause(!sv.paused); });
  $('#svPrevStory').addEventListener('click', function () { if (sv.s > 0) openStory(sv.s - 1); });
  $('#svNextStory').addEventListener('click', function () { if (sv.s < STORIES.length - 1) openStory(sv.s + 1); else closeStory(); });
  sv.el.addEventListener('click', function (e) {
    if (e.target === sv.el) { closeStory(); return; }
    var b = e.target.closest('[data-sv-tour]');
    if (b) { closeStory(); openTour(b.getAttribute('data-sv-tour')); return; }
    b = e.target.closest('[data-sv-filter]');
    if (b) { closeStory(); setFilter(b.getAttribute('data-sv-filter')); $('#turlar').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    b = e.target.closest('[data-sv-goto]');
    if (b) { closeStory(); $(b.getAttribute('data-sv-goto')).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    if (e.target.closest('a')) svPause(true);
  });
  /* Basılı tutunca duraklat, kaydırarak geç/kapat */
  (function () {
    var stage = $('.sv-stage', sv.el), holdT, sx = 0, sy = 0, down = false;
    stage.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button, a')) { if (!e.target.closest('.sv-nav')) return; }
      down = true; sx = e.clientX; sy = e.clientY; sv.held = false;
      holdT = setTimeout(function () { sv.held = true; svPause(true); }, 260);
    });
    var end = function (e) {
      if (!down) return; down = false; clearTimeout(holdT);
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (sv.held) { svPause(false); setTimeout(function () { sv.held = false; }, 0); return; }
      if (Math.abs(dy) > 90 && dy > 0 && Math.abs(dy) > Math.abs(dx)) { sv.held = true; closeStory(); setTimeout(function () { sv.held = false; }, 0); }
      else if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy)) { sv.held = true; if (dx < 0) { if (sv.s < STORIES.length - 1) openStory(sv.s + 1); else closeStory(); } else if (sv.s > 0) openStory(sv.s - 1); setTimeout(function () { sv.held = false; }, 0); }
    };
    stage.addEventListener('pointerup', end);
    stage.addEventListener('pointercancel', function () { down = false; clearTimeout(holdT); if (sv.held) { svPause(false); sv.held = false; } });
  })();

  /* ---------- Lightbox ---------- */
  var lb = { el: $('#lightbox'), img: $('#lbImg'), list: [], i: 0, lastFocus: null };
  function openLB(list, i) {
    lb.lastFocus = document.activeElement; lb.list = list; lb.i = i; showLB(); if (!lb.el.open) lb.el.showModal(); syncLock(); $('#lbClose').focus({ preventScroll: true });
  }
  function showLB() {
    lb.img.src = lb.list[lb.i];
    $('#lbCount').textContent = (lb.i + 1) + ' / ' + lb.list.length;
    $('#lbPrev').hidden = $('#lbNext').hidden = lb.list.length < 2;
  }
  function closeLB() { if (lb.el.open) lb.el.close(); }
  lb.el.addEventListener('close', function () { lb.img.removeAttribute('src'); syncLock(); if (lb.lastFocus && lb.lastFocus.focus) lb.lastFocus.focus({ preventScroll: true }); });
  var lbStep = function (d) { lb.i = (lb.i + d + lb.list.length) % lb.list.length; showLB(); };
  $('#lbClose').addEventListener('click', closeLB);
  $('#lbPrev').addEventListener('click', function () { lbStep(-1); });
  $('#lbNext').addEventListener('click', function () { lbStep(1); });
  lb.el.addEventListener('click', function (e) { if (e.target === lb.el) closeLB(); });
  (function () {
    var sx = 0;
    lb.el.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    lb.el.addEventListener('pointerup', function (e) { var dx = e.clientX - sx; if (Math.abs(dx) > 60 && e.target === lb.img) lbStep(dx < 0 ? 1 : -1); });
  })();

  /* ---------- Klavye ---------- */
  document.addEventListener('keydown', function (e) {
    if (lb.el.open) {
      if (e.key === 'ArrowRight') lbStep(1);
      else if (e.key === 'ArrowLeft') lbStep(-1);
      return;
    }
    if (!sv.el.hidden) {
      if (e.key === 'Escape') { e.preventDefault(); closeStory(); }
      else if (e.key === 'ArrowRight') svNext();
      else if (e.key === 'ArrowLeft') svPrev();
      else if (e.key === ' ' && !e.target.closest('button, a')) { e.preventDefault(); svPause(!sv.paused); }
    }
  });

  /* ---------- Kopyala & bildirim ---------- */
  var toastT;
  function toast(msg) {
    var t = $('#toast'), host = $$('dialog[open]').pop() || document.body;
    if (t.parentNode !== host) host.appendChild(t); /* açık pencerenin üstünde görünsün */
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }
  function copy(text, msg) {
    var fallback = function () {
      var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;opacity:0';
      (document.querySelector('dialog[open]') || document.body).appendChild(ta); ta.select();
      try { document.execCommand('copy'); toast(msg); } catch (e) { toast('Kopyalanamadı'); }
      ta.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(function () { toast(msg); }, fallback);
    else fallback();
  }
  $('#copyPhone').addEventListener('click', function () { copy(S.phone.replace(/[()]/g, ''), 'Telefon numarası kopyalandı'); });

  /* ---------- Genel tıklama yönlendirmesi ---------- */
  document.addEventListener('click', function (e) {
    var el;
    if ((el = e.target.closest('[data-rez]'))) { e.preventDefault(); openRez(el.getAttribute('data-rez'), el.getAttribute('data-date')); return; }
    if ((el = e.target.closest('[data-open]'))) { e.preventDefault(); openTour(el.getAttribute('data-open')); return; }
    if ((el = e.target.closest('[data-story]'))) { openStory(+el.getAttribute('data-story')); return; }
    if ((el = e.target.closest('[data-lb]'))) { openLB(tourBody._media || [], +el.getAttribute('data-lb')); return; }
    if ((el = e.target.closest('[data-share]'))) {
      var t = byId[el.getAttribute('data-share')];
      var url = location.href.split('#')[0] + '#tur/' + t.id;
      if (navigator.share) navigator.share({ title: t.title + ' — Ankara Tur', text: t.summary, url: url }).catch(function () {});
      else copy(url, 'Tur bağlantısı kopyalandı');
    }
  });

  /* ---------- Menüde aktif bölüm ---------- */
  if ('IntersectionObserver' in window) {
    var links = $$('a', navLinks);
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) { var s = $(a.getAttribute('href')); if (s) spy.observe(s); });
  }

  /* ---------- Görünür olunca animasyon ---------- */
  function observeReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-reveal');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -40px 0px' });
    $$('.reveal:not(.in)').forEach(function (el) { io.observe(el); });
  }

  /* ---------- Yapısal veri (SEO) ---------- */
  (function () {
    var base = location.href.split('#')[0];
    var abs = function (p) { try { return new URL(p, base).href; } catch (e) { return p; } };
    var graph = [{
      '@type': 'TravelAgency', name: S.brand, alternateName: S.igName, telephone: S.tel, url: base, image: abs('assets/img/logo.webp'),
      sameAs: [S.instagram, S.instagram2 && S.instagram2.url].filter(Boolean),
      address: { '@type': 'PostalAddress', addressLocality: 'Ankara', addressCountry: 'TR' }, areaServed: 'Türkiye'
    }];
    TOURS.forEach(function (t) {
      var trip = { '@type': 'TouristTrip', name: t.title, description: t.summary, url: base + '#tur/' + t.id, provider: { '@type': 'TravelAgency', name: S.brand } };
      if (t.cover || t.tile) trip.image = abs(t.cover || t.tile);
      if (t.price != null) trip.offers = { '@type': 'Offer', price: t.price, priceCurrency: t.currency === '€' ? 'EUR' : 'TRY', url: base + '#tur/' + t.id, availability: 'https://schema.org/InStock' };
      graph.push(trip);
    });
    var s = document.createElement('script'); s.type = 'application/ld+json';
    s.textContent = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph });
    document.head.appendChild(s);
  })();

  /* ---------- Duyuru ---------- */
  (function () {
    var n = S.notice, el = $('#notice');
    if (!n || !el || (n.until && parse(n.until) < today)) return;
    el.innerHTML = '<div class="wrap notice-in"><span class="n-ic">' + icon('clock') + '</span><p><b>' + esc(n.title) + '</b> ' + esc(n.text) + '</p>' +
      (n.poster ? '<button type="button" class="n-link" data-notice-poster>Duyuruyu gör</button>' : '') +
      '<a class="btn btn-wa btn-sm" href="' + waLink('Merhaba, fiyat artışı öncesi mevcut fiyatlarla rezervasyon yaptırmak istiyorum.') + '" target="_blank" rel="noopener">' + icon('wa') + 'Yer ayırt</a></div>';
    el.hidden = false;
    el.addEventListener('click', function (e) {
      if (e.target.closest('[data-notice-poster]')) openLB(['assets/img/posters/' + n.poster + '.webp'], 0);
    });
  })();

  /* ---------- Başlat ---------- */
  wireWa(document);
  $('#statTours').textContent = TOURS.length;
  $('#year').textContent = new Date().getFullYear();
  renderTours();
  renderCalendar();
  var m0 = location.hash.match(/^#tur\/(.+)$/);
  if (m0) openTour(decodeURIComponent(m0[1]), true);
})();

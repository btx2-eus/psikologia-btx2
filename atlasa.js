/* =================================================================
   PSIKOLOGIAREN LENTEEN ATLASA — script.js
   Edukia content/psikologiaren-historia.json fitxategitik kargatzen da
   eta dena dinamikoki marrazten da. JavaScript hutsa, frameworkik gabe.
   ================================================================= */

const ICON = (id, klase = '') =>
  `<svg class="${klase}" aria-hidden="true"><use href="#ic-${id}"></use></svg>`;

const esc = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// *hitza* → <em>hitza</em> (nabarmentze sinplea testuetan)
const markup = (s = '') => esc(s).replace(/\*([^*]+)\*/g, '<em>$1</em>');

// Lente bakoitzaren ikonoa eta CSS kolore-aldagaia
const LENTE_IKONO = {
  barnera: 'begia', portaerara: 'portaera', garunera: 'garuna',
  gizartera: 'taldea', harremanetara: 'lotura', zentzura: 'bihotza'
};
const lenteKolorea = (id) => `var(--l-${id})`;
const blokeKolorea = (id) => `var(--b-${id})`;

// Harremanen maparen gezi moten koloreak (atzealde ilunerako)
const MOTA_KOLORE = {
  'erantzuna':     '#E79090',
  'beste-bidea':   '#C9A8FF',
  'eragina':       '#8FB4E0',
  'jarraipena':    '#8FD0B0',
  'konbergentzia': '#E6C77A'
};

let DATA = null;
let LENTEAK = {}; // id -> lente objektua

document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    const erantzuna = await fetch('content/psikologiaren-historia.json', { cache: 'no-cache' });
    if (!erantzuna.ok) throw new Error('HTTP ' + erantzuna.status);
    DATA = await erantzuna.json();
  } catch (e) {
    document.getElementById('eduki-nagusia').insertAdjacentHTML('afterbegin',
      `<p style="max-width:60ch;margin:6rem auto;padding:1.5rem;background:#fff;border-radius:12px;text-align:center">
        Ezin izan da edukia kargatu (<code>content/psikologiaren-historia.json</code>).
        Webgunea zerbitzari batetik ireki behar da (adib. GitHub Pages edo <code>python3 -m http.server</code>),
        ez fitxategia zuzenean nabigatzailean.</p>`);
    console.error(e);
    return;
  }

  LENTEAK = Object.fromEntries(DATA.lenteak.map(l => [l.id, l]));

  renderHeroa();
  renderIbilbidea();
  renderHelburuak();
  renderGalderak();
  renderKronologia();
  renderIragazkiak();
  renderEskolak();
  renderMapa();
  renderKritika();
  renderSintesia();
  renderOharKritikoa();

  hasiBehatzaileak();
  hasiKontrolak();
}

/* ---------- IBILBIDEA (nabigazioko aurrerapena) ---------- */
function renderIbilbidea() {
  const nav = document.getElementById('ibilbide-nav');
  nav.innerHTML = DATA.ibilbidea.map((p, i) => `
    <a class="ibil-lotura" href="#${p.id}" data-atal="${p.id}">
      <span class="pausoa">${i + 1}</span><span>${esc(p.izena)}</span>
    </a>`).join('');
}

/* ---------- HEROA (azalpen praktikoa JSONetik) ---------- */
function renderHeroa() {
  const el = document.getElementById('hero-azalpena');
  if (el && DATA.meta && DATA.meta.azalpenPraktikoa) el.innerHTML = markup(DATA.meta.azalpenPraktikoa);
}

/* ---------- ZER IKASIKO DUZU ---------- */
function renderHelburuak() {
  const h = DATA.helburuak;
  if (!h) return;
  document.getElementById('helburu-izenburua').textContent = h.izenburua;
  document.getElementById('helburu-sarrera').textContent = h.sarrera || '';
  document.getElementById('helburu-zerrenda').innerHTML = h.zerrenda.map(z => `
    <li>
      <span class="helburu-ikono">${ICON(z.ikonoa)}</span>
      <span>${esc(z.testua)}</span>
    </li>`).join('');
}

/* ---------- 01 · GALDERA HANDIAK ---------- */
function renderGalderak() {
  const k = document.getElementById('galderak-edukia');
  k.innerHTML = DATA.galderaHandiak.map(g => `
    <article class="galdera-atea reveal">
      <div class="galdera-atea__ikono">${ICON(g.ikonoa)}</div>
      <h3>${esc(g.galdera)}</h3>
      <p>${esc(g.azalpena)}</p>
    </article>`).join('');
}

/* ---------- 02 · KRONOLOGIA ---------- */
function renderKronologia() {
  const k = document.getElementById('kronologia-edukia');
  k.innerHTML = DATA.kronologia.map(e => `
    <article class="krono-txartela reveal" style="--bloke:${blokeKolorea(e.blokea)}">
      <span class="krono-garaia">${esc(e.garaia)}</span>
      <span class="krono-data">${esc(e.data)}</span>
      <h3 class="krono-mugarria">${esc(e.mugarria)}</h3>
      <div class="krono-autoreak">${e.autoreak.map(a => `<span class="txikiloa">${esc(a)}</span>`).join('')}</div>
      <p class="krono-galdera">«${esc(e.galdera)}»</p>
      <div class="krono-xeheak"><div>
        <div class="xehe-lerroa"><b>Ekarpena</b>${esc(e.ekarpena)}</div>
        <div class="xehe-lerroa"><b>Muga edo kritika</b>${esc(e.muga)}</div>
        <div class="xehe-lerroa"><b>Gaur egun</b>${esc(e.gaurEgun)}</div>
      </div></div>
      <button class="krono-zabaldu" aria-expanded="false">
        <span class="zab-testua">Ekarpena eta muga</span>${ICON('fletxa')}
      </button>
    </article>`).join('');

  k.querySelectorAll('.krono-zabaldu').forEach(btn => {
    btn.querySelector('svg').style.transform = 'rotate(90deg)';
    btn.addEventListener('click', () => {
      const txartela = btn.closest('.krono-txartela');
      const zabalik = txartela.classList.toggle('is-zabalik');
      btn.setAttribute('aria-expanded', zabalik);
      btn.querySelector('.zab-testua').textContent = zabalik ? 'Itxi' : 'Ekarpena eta muga';
    });
  });
}

/* ---------- 03 · ESKOLAK (iragazkiak + txartelak) ---------- */
function renderIragazkiak() {
  const k = document.getElementById('iragazkiak');
  const guztiak = `<button class="iragazki-botoia is-aktibo" data-lente="guztiak" aria-pressed="true">
      ${ICON('lente')} Guztiak</button>`;
  const lenteBotoiak = DATA.lenteak.map(l => `
    <button class="iragazki-botoia" data-lente="${l.id}" style="--lente:${lenteKolorea(l.id)}"
            aria-pressed="false" title="${esc(l.deskribapena)}">
      ${ICON(LENTE_IKONO[l.id])} ${esc(l.izena)}
    </button>`).join('');
  k.innerHTML = guztiak + lenteBotoiak;

  k.querySelectorAll('.iragazki-botoia').forEach(btn => {
    btn.addEventListener('click', () => {
      k.querySelectorAll('.iragazki-botoia').forEach(b => {
        b.classList.remove('is-aktibo'); b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('is-aktibo'); btn.setAttribute('aria-pressed', 'true');
      iragaziEskolak(btn.dataset.lente);
    });
  });
}

function iragaziEskolak(lente) {
  document.querySelectorAll('.eskola-txartela').forEach(t => {
    const lenteak = t.dataset.lenteak.split(',');
    t.classList.toggle('is-ezkutatua', lente !== 'guztiak' && !lenteak.includes(lente));
  });
}

const FITXAK = [
  { id: 'ulertu',   izena: 'Ulertu' },
  { id: 'adibidea', izena: 'Adibidea' },
  { id: 'kritika',  izena: 'Kritika' },
  { id: 'gaur',     izena: 'Gaur egun' }
];

function fitxaEdukia(e, fitxa) {
  switch (fitxa) {
    case 'adibidea':
      return `<h4>Adibidea</h4><p>${esc(e.adibidea)}</p>`;
    case 'kritika':
      return `<h4>Zer sinplifikatu zuen edo non geratu zen motz</h4><p>${esc(e.sinplifikazioa)}</p>`;
    case 'gaur':
      return `<h4>Gaur egun zer geratu da</h4><p>${esc(e.gaurEgun)}</p>`;
    default:
      return `<h4>Zer aztertzen du</h4><p>${esc(e.zerAztertzen)}</p>
              <h4>Autore nagusiak</h4>
              <div class="autore-zerr">${e.autoreak.map(a => `<span class="txikiloa">${esc(a)}</span>`).join('')}</div>
              <h4>Zer ekarri zuen</h4><p>${esc(e.ekarpena)}</p>`;
  }
}

function renderEskolak() {
  const k = document.getElementById('eskolak-edukia');
  k.innerHTML = DATA.eskolak.map(e => {
    const lenteMarkak = e.lenteak.map(id => `
      <span class="lente-marka" style="background:${lenteKolorea(id)}">
        ${ICON(LENTE_IKONO[id])}${esc(LENTEAK[id].izena.replace(' begiratu', ''))}
      </span>`).join('');
    const fitxaBotoiak = FITXAK.map((f, i) =>
      `<button class="fitxa-botoia${i === 0 ? ' is-aktibo' : ''}" data-fitxa="${f.id}" aria-pressed="${i === 0}">${f.izena}</button>`
    ).join('');

    return `
    <article class="eskola-txartela reveal" data-id="${e.id}" data-lenteak="${e.lenteak.join(',')}"
             style="--lente:${lenteKolorea(e.lenteak[0])}">
      <div class="eskola-buru"><span class="eskola-garaia">${esc(e.garaia)}</span></div>
      <h3 class="eskola-izena">${esc(e.izena)}</h3>
      <p class="eskola-galdera">${esc(e.galdera)}</p>
      <div class="eskola-lenteak">${lenteMarkak}</div>
      <div class="klase-galdera">${esc(e.klaseGaldera)}</div>
      <button class="eskola-zabaldu-handi" aria-expanded="false">Zabaldu txartela ▾</button>
      <div class="eskola-edukia"><div>
        <div class="eskola-fitxak" role="tablist">${fitxaBotoiak}</div>
        <div class="eskola-panela">${fitxaEdukia(e, 'ulertu')}</div>
      </div></div>
      <p class="eskola-esaldia">${esc(e.esaldia)}</p>
    </article>`;
  }).join('');

  // zabaldu/itxi
  k.querySelectorAll('.eskola-zabaldu-handi').forEach(btn => {
    btn.addEventListener('click', () => {
      const t = btn.closest('.eskola-txartela');
      const zabalik = t.classList.toggle('is-zabalik');
      btn.setAttribute('aria-expanded', zabalik);
      btn.textContent = zabalik ? 'Itxi txartela ▴' : 'Zabaldu txartela ▾';
    });
  });

  // fitxak (Ulertu / Adibidea / Kritika / Gaur egun)
  k.querySelectorAll('.eskola-txartela').forEach(t => {
    const datu = DATA.eskolak.find(x => x.id === t.dataset.id);
    const panela = t.querySelector('.eskola-panela');
    t.querySelectorAll('.fitxa-botoia').forEach(fb => {
      fb.addEventListener('click', () => {
        t.querySelectorAll('.fitxa-botoia').forEach(b => {
          b.classList.remove('is-aktibo'); b.setAttribute('aria-pressed', 'false');
        });
        fb.classList.add('is-aktibo'); fb.setAttribute('aria-pressed', 'true');
        panela.innerHTML = fitxaEdukia(datu, fb.dataset.fitxa);
        if (!t.classList.contains('is-zabalik')) t.querySelector('.eskola-zabaldu-handi').click();
      });
    });
  });
}

/* ---------- 04 · HARREMANEN MAPA ---------- */
function renderMapa() {
  document.getElementById('harremanak-azalpena').textContent = DATA.harremanak.azalpena;
  const { nodoak, loturak, motak } = DATA.harremanak;
  const svg = document.getElementById('mapa-svg');
  const nodoMap = Object.fromEntries(nodoak.map(n => [n.id, n]));
  const SVGNS = 'http://www.w3.org/2000/svg';

  // marker (geziburua) — context-stroke bidez lerroaren kolorea hartzen du
  svg.innerHTML = `
    <defs>
      <marker id="gezi" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="4.6" markerHeight="4.6" orient="auto-start-reverse">
        <path d="M0 0 L8 4 L0 8 z" fill="context-stroke"/>
      </marker>
    </defs>`;

  // loturak (kurbatuak, mota bakoitza kolore batez, norabide bikoak bi geziekin)
  loturak.forEach((l, i) => {
    const a = nodoMap[l.iturria], b = nodoMap[l.helburua];
    if (!a || !b) return;
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 6; // kurbatura arina
    const path = document.createElementNS(SVGNS, 'path');
    path.setAttribute('d', `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`);
    path.setAttribute('class', 'mapa-lotura');
    path.setAttribute('stroke', MOTA_KOLORE[l.mota] || '#8aa3c2');
    if (l.mota === 'beste-bidea') path.setAttribute('stroke-dasharray', '1.6 1.3');
    path.setAttribute('marker-end', 'url(#gezi)');
    if (l.norabide === 'bi') path.setAttribute('marker-start', 'url(#gezi)');
    path.dataset.iturria = l.iturria;
    path.dataset.helburua = l.helburua;
    path.dataset.indizea = i;
    svg.appendChild(path);
  });

  // nodoak
  nodoak.forEach(n => {
    const g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('class', 'mapa-nodo-g');
    g.dataset.id = n.id;
    g.setAttribute('tabindex', '0');
    g.setAttribute('role', 'button');
    g.setAttribute('aria-label', n.izena + ' — harremanak ikusi');

    const lerroak = wrapEtiketa(n.izena);
    const zabal = Math.max(...lerroak.map(t => t.length)) * 1.18 + 3.5;
    const altu = lerroak.length * 2.9 + 3.2;

    const rect = document.createElementNS(SVGNS, 'rect');
    rect.setAttribute('class', 'mapa-nodo-kutxa');
    rect.setAttribute('x', n.x - zabal / 2);
    rect.setAttribute('y', n.y - altu / 2);
    rect.setAttribute('width', zabal);
    rect.setAttribute('height', altu);
    rect.setAttribute('rx', 1.6);
    g.appendChild(rect);

    const text = document.createElementNS(SVGNS, 'text');
    text.setAttribute('class', 'mapa-nodo-testua');
    text.setAttribute('x', n.x);
    text.setAttribute('y', n.y);
    text.setAttribute('text-anchor', 'middle');
    text.setAttribute('font-size', '2.2');
    lerroak.forEach((t, i) => {
      const ts = document.createElementNS(SVGNS, 'tspan');
      ts.setAttribute('x', n.x);
      ts.setAttribute('dy', i === 0 ? `${-(lerroak.length - 1) * 1.4}` : '2.8');
      ts.textContent = t;
      text.appendChild(ts);
    });
    g.appendChild(text);

    g.addEventListener('click', () => hautatuNodoa(n.id));
    g.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); hautatuNodoa(n.id); } });
    svg.appendChild(g);
  });

  // legenda (gezi moten kolore-azalpena)
  const legenda = document.getElementById('mapa-legenda');
  if (legenda) {
    legenda.innerHTML = Object.entries(motak).map(([id, izena]) =>
      `<li><span class="swatch${id === 'beste-bidea' ? ' dash' : ''}" style="border-top-color:${MOTA_KOLORE[id] || '#8aa3c2'}"></span>${esc(izena)}</li>`
    ).join('');
  }

  // tentsio-zerrenda osoa (irisgarria, mugikorrerako ere bai)
  const zerr = document.getElementById('tentsio-zerrenda');
  zerr.innerHTML = loturak.map(l => {
    const lotura = `${esc(nodoMap[l.iturria]?.izena)} ${ehLotura(l.norabide)} ${esc(nodoMap[l.helburua]?.izena)}`;
    return `
    <li data-iturria="${l.iturria}" data-helburua="${l.helburua}" style="border-left-color:${MOTA_KOLORE[l.mota] || '#8aa3c2'}">
      <span class="tentsio-mota">${esc(motak[l.mota] || l.mota)}</span>
      <div class="tentsio-bide">${lotura}</div>
      <p>${esc(l.testua)}</p>
    </li>`; }).join('');

  // "Nola irakurri mapa hau" — gidatutako irakurketa
  const ir = document.getElementById('mapa-irakurketa-zerr');
  if (ir && DATA.harremanak.irakurketa) {
    ir.innerHTML = DATA.harremanak.irakurketa.map(t => `<li>${esc(t)}</li>`).join('');
  }

  panelaHasieratu();
}

// Norabidearen arabera konektore egokia (→ edo ↔)
function ehLotura(norabide) {
  return `<span class="bide-gezi" aria-hidden="true">${norabide === 'bi' ? '↔' : '→'}</span>`;
}

function wrapEtiketa(izena) {
  if (izena.length <= 14) return [izena];
  const hitzak = izena.split(' ');
  if (hitzak.length === 1) return [izena];
  // bi lerrotan banatu, lerro luzeena ahalik eta laburrena izan dadin
  let onena = [izena], onenaPunt = Infinity;
  for (let i = 1; i < hitzak.length; i++) {
    const a = hitzak.slice(0, i).join(' '), b = hitzak.slice(i).join(' ');
    const punt = Math.max(a.length, b.length);
    if (punt < onenaPunt) { onenaPunt = punt; onena = [a, b]; }
  }
  return onena;
}

function panelaHasieratu() {
  document.getElementById('mapa-panela').innerHTML =
    `<p class="mapa-panela__hutsa">Egin klik nodo batean (edo behean dauden tentsioetan) eskola horren harremanak nabarmentzeko.</p>`;
}

function hautatuNodoa(id) {
  const { loturak, nodoak, motak } = DATA.harremanak;
  const nodoMap = Object.fromEntries(nodoak.map(n => [n.id, n]));
  const svg = document.getElementById('mapa-svg');

  const lotutakoak = loturak.filter(l => l.iturria === id || l.helburua === id);
  const lotutaIdak = new Set([id]);
  lotutakoak.forEach(l => { lotutaIdak.add(l.iturria); lotutaIdak.add(l.helburua); });

  svg.querySelectorAll('.mapa-nodo-g').forEach(g => {
    g.classList.toggle('is-hauta', g.dataset.id === id);
    g.classList.toggle('is-lauso', !lotutaIdak.has(g.dataset.id));
  });
  svg.querySelectorAll('.mapa-lotura').forEach(p => {
    const bat = p.dataset.iturria === id || p.dataset.helburua === id;
    p.classList.toggle('is-nabarmen', bat);
    p.classList.toggle('is-lauso', !bat);
  });

  const panela = document.getElementById('mapa-panela');
  if (!lotutakoak.length) { panela.innerHTML = `<p class="mapa-panela__hutsa">Eskola honek ez du lotura zuzenik mapa honetan.</p>`; return; }
  panela.innerHTML = `<h3>${esc(nodoMap[id].izena)}</h3>` + lotutakoak.map(l => `
    <div class="mapa-tentsioa" style="border-left:3px solid ${MOTA_KOLORE[l.mota] || '#8aa3c2'};padding-left:.7rem">
      <div class="nondik-nora">${esc(nodoMap[l.iturria].izena)} ${ehLotura(l.norabide)} ${esc(nodoMap[l.helburua].izena)}</div>
      <p><strong>${esc(motak[l.mota] || l.mota)}.</strong> ${esc(l.testua)}</p>
    </div>`).join('');

  // tentsio-zerrendan ere nabarmendu
  document.querySelectorAll('#tentsio-zerrenda li').forEach(li => {
    const bat = li.dataset.iturria === id || li.dataset.helburua === id;
    li.style.opacity = bat ? '1' : '.4';
  });
}

/* ---------- 05 · KRITIKA ---------- */
function renderKritika() {
  const sar = document.getElementById('kritika-sarrera');
  if (sar) sar.textContent = DATA.kritikaSarrera || '';
  const azp = document.getElementById('kritika-azpimarra');
  if (azp) azp.textContent = DATA.kritikaAzpimarra || '';

  const k = document.getElementById('kritika-edukia');
  k.innerHTML = DATA.kritikak.map(c => `
    <article class="kritika-txartela reveal">
      <h3><span class="kritika-alerta" aria-hidden="true">!</span>${esc(c.izenburua)}</h3>
      <p>${esc(c.testua)}</p>
    </article>`).join('');
}

/* ---------- 06 · SINTESIA ---------- */
function renderSintesia() {
  const s = DATA.sintesia;
  const adarrak = s.miniMapa.adarrak.map(a => `
    <div class="mini-adarra" style="--lente:${lenteKolorea(a.lentea)}">
      <div class="mini-adarra__ikono">${ICON(LENTE_IKONO[a.lentea])}</div>
      <b>${esc(a.izena)}</b><span>${esc(a.galdera)}</span>
    </div>`).join('');

  document.getElementById('sintesia-edukia').innerHTML = `
    <p class="sintesi-esaldia reveal">«${esc(s.esaldia)}»</p>
    <p class="sintesi-testua reveal">${esc(s.testua)}</p>
    <div class="mini-mapa reveal">
      <div class="mini-mapa__sarea">
        <div class="mini-mapa__erdi">${esc(s.miniMapa.erdigunea)}</div>
        ${adarrak}
      </div>
    </div>
    <div class="sintesi-galderak reveal">
      <h3>${ICON('lente')} 5 galdera zuretzat</h3>
      <ol>${s.galderak.map(g => `<li>${esc(g)}</li>`).join('')}</ol>
    </div>`;
}

/* ---------- OHAR KRITIKOA ---------- */
function renderOharKritikoa() {
  const el = document.getElementById('ohar-kritikoa-testua');
  if (el && DATA.oharKritikoa) el.textContent = DATA.oharKritikoa;
}

/* ---------- BEHATZAILEAK (scroll-spy + reveal) ---------- */
function hasiBehatzaileak() {
  // reveal animazioa
  const revBeh = new IntersectionObserver((sarrerak) => {
    sarrerak.forEach(s => { if (s.isIntersecting) { s.target.classList.add('ikusgai'); revBeh.unobserve(s.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => revBeh.observe(el));

  // scroll-spy: zein atal dagoen ikusgai
  const loturaMap = {};
  document.querySelectorAll('.ibil-lotura').forEach(a => loturaMap[a.dataset.atal] = a);
  const atalak = DATA.ibilbidea.map(p => document.getElementById(p.id)).filter(Boolean);
  const lehenLotura = loturaMap[DATA.ibilbidea[0].id];
  if (lehenLotura) lehenLotura.classList.add('is-aktibo'); // lehenetsia goian gaudenean
  const spy = new IntersectionObserver((sarrerak) => {
    sarrerak.forEach(s => {
      if (s.isIntersecting) {
        Object.values(loturaMap).forEach(a => a.classList.remove('is-aktibo'));
        const a = loturaMap[s.target.id];
        if (a) a.classList.add('is-aktibo');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  atalak.forEach(a => spy.observe(a));
}

/* ---------- KONTROLAK (modua + mugimendua) ---------- */
function hasiKontrolak() {
  // Ikasle / Irakasle modua
  document.querySelectorAll('.modu-aldagailua button').forEach(btn => {
    btn.addEventListener('click', () => {
      const modua = btn.dataset.modua;
      document.body.classList.toggle('modua-irakasle', modua === 'irakasle');
      document.body.classList.toggle('modua-ikasle', modua === 'ikasle');
      document.querySelectorAll('.modu-aldagailua button').forEach(b => {
        const aktibo = b === btn;
        b.classList.toggle('is-aktibo', aktibo);
        b.setAttribute('aria-pressed', aktibo);
      });
    });
  });

  // Animazioak gaitu / desgaitu
  const mb = document.getElementById('mugimendu-botoia');
  mb.addEventListener('click', () => {
    const ez = document.body.classList.toggle('mugimendurik-ez');
    mb.setAttribute('aria-pressed', ez);
  });
}

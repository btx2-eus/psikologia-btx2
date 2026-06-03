/* =================================================================
   ZER DA PSIKOLOGIA? — gaiaren orria
   Edukia content/zer-da-psikologia.json fitxategitik kargatzen da.
   ================================================================= */

const ICON = (id, k = '') => `<svg class="${k}" aria-hidden="true"><use href="#ic-${id}"></use></svg>`;
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

document.addEventListener('DOMContentLoaded', async () => {
  let D;
  try {
    const r = await fetch('content/zer-da-psikologia.json');
    if (!r.ok) throw new Error('HTTP ' + r.status);
    D = await r.json();
  } catch (e) {
    document.getElementById('eduki-nagusia').insertAdjacentHTML('beforeend',
      `<p style="max-width:60ch;margin:3rem auto;padding:1.5rem;background:#fff;border-radius:12px;text-align:center">
        Ezin izan da edukia kargatu (<code>content/zer-da-psikologia.json</code>). Zerbitzaritik ireki behar da.</p>`);
    console.error(e);
    return;
  }

  renderHero(D);
  renderKontratua(D.kontratua);
  renderSaioak(D);
  renderLanabesak(D.lanabesak);
  if (D.errepasoa) renderErrepasoa(D.errepasoa);
  renderAtlas(D.atlasLotura);
});

/* ---------- HEROA + NIETZSCHE ---------- */
function renderHero(D) {
  const m = D.meta;
  document.getElementById('kokapena').textContent = m.ebaluazioa;
  document.getElementById('hero-zenb').textContent = m.zenbakia;
  document.getElementById('hero-ebal').textContent = m.ebaluazioa;
  document.getElementById('hero-izenburua').textContent = m.izenburua;
  document.getElementById('hero-galdera').textContent = '«' + m.galdera + '»';
  document.getElementById('hero-sarrera').textContent = m.sarrera;

  const n = D.nietzsche;
  document.getElementById('nietzsche').innerHTML = `
    <span class="nietzsche__etiketa">${esc(n.etiketa)}</span>
    <blockquote class="nietzsche__aipua">${esc(n.aipua)}</blockquote>
    <figcaption class="nietzsche__egilea">${esc(n.egilea)} <span>${esc(n.urteak)}</span></figcaption>
    <p class="nietzsche__sarrera">${esc(n.sarrera)}</p>
    <ul class="nietzsche__galderak">
      ${n.galderak.map(g => `<li>${esc(g)}</li>`).join('')}
    </ul>`;
}

/* ---------- LEHEN KONTRATUA ---------- */
function renderKontratua(k) {
  const s = document.getElementById('kontratua');
  s.innerHTML = `
    <div class="atal__goiburua">
      <span class="atal__etiketa">${ICON('kontratu')} ${esc(k.etiketa)}</span>
      <h2 id="kontratua-h">${esc(k.izenburua)}</h2>
      <p class="atal__sarrera">${esc(k.sarrera)}</p>
    </div>
    <ol class="kontratua-zerrenda">
      ${k.arauak.map(a => `<li>${esc(a)}</li>`).join('')}
    </ol>
    <p class="kontratua-oharra">${ICON('begia')} ${esc(k.oharra)}</p>`;
}

/* ---------- SAIOEN SEKUENTZIA (fasetan) ---------- */
function renderSaioak(D) {
  const s = document.getElementById('saioak');
  const faseak = D.faseak || [{ id: 1, izena: '', azalpena: '' }];

  const faseBlokeak = faseak.map(f => {
    const saioak = D.saioak.filter(x => (x.fasea || 1) === f.id);
    if (!saioak.length) return '';
    return `
      <div class="fase-blokea">
        <div class="fase-buru">
          <span class="fase-txartela">${esc(f.izena)}</span>
          ${f.azalpena ? `<p class="fase-azalpena">${esc(f.azalpena)}</p>` : ''}
        </div>
        <div class="saioak-zerrenda">
          ${saioak.map(saioTxartela).join('')}
        </div>
      </div>`;
  }).join('');

  s.innerHTML = `
    <div class="atal__goiburua">
      <span class="atal__etiketa">${ICON('denbora')} ${D.saioak.length} saio</span>
      <h2 id="saioak-h">${esc(D.saioakIzenburua)}</h2>
      <p class="atal__sarrera">${esc(D.saioakSarrera)}</p>
    </div>
    ${faseBlokeak}`;

  s.querySelectorAll('.saio-zabaldu').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.saio');
      const zabalik = card.classList.toggle('is-zabalik');
      btn.setAttribute('aria-expanded', zabalik);
    });
  });
}

function saioTxartela(s) {
  const guztira = s.denborak.reduce((a, d) => a + (parseInt(d.min, 10) || 0), 0);

  // Aurkezpena: Drive-lotura badu, klikagarri (kanpora); bestela marka soila
  const aurkTxiki = s.aurkezpenaLotura
    ? `<a class="saio-baliabide saio-baliabide--aurkezpena" href="${esc(s.aurkezpenaLotura)}" target="_blank" rel="noopener">${ICON('aurkezpena')} ${esc(s.aurkezpena)}</a>`
    : `<span class="saio-baliabide saio-baliabide--aurkezpena">${ICON('aurkezpena')} ${esc(s.aurkezpena)}</span>`;

  // Fitxa: lotura + aukeran PDF txiki bat
  const fitxaLotura = s.fitxa && s.fitxa.lotura;
  const fitxaTxiki = s.fitxa
    ? (fitxaLotura
        ? `<a class="saio-baliabide saio-baliabide--lotura" href="${esc(s.fitxa.lotura)}">${ICON('fitxa')} ${esc(s.fitxa.izena)}${s.fitxa.pdf ? '' : ''}</a>`
        : `<span class="saio-baliabide">${ICON('fitxa')} ${esc(s.fitxa.izena)}</span>`)
    : '';
  const fitxaPdf = s.fitxa && s.fitxa.pdf
    ? `<a class="saio-baliabide saio-baliabide--pdf" href="${esc(s.fitxa.pdf)}" download title="${esc(s.fitxa.izena)} — PDF">${ICON('fitxa')} PDF</a>`
    : '';
  const atlasTxiki = s.atlas
    ? `<a class="saio-baliabide saio-baliabide--atlas" href="lenteen-atlasa.html">${ICON('lente')} Lenteen Atlasa</a>`
    : '';

  return `
  <article class="saio">
    <div class="saio__buru">
      <span class="saio__zenb">${s.zenb}</span>
      <div class="saio__titulua">
        <h3>${esc(s.izenburua)}</h3>
        <p class="saio__galdera">«${esc(s.galdera)}»</p>
      </div>
    </div>

    <p class="saio__fenomenoa"><span class="saio__label">Fenomenoa</span>${esc(s.fenomenoa)}</p>

    <div class="saio__baliabideak">
      ${aurkTxiki}
      ${fitxaTxiki}
      ${fitxaPdf}
      ${atlasTxiki}
    </div>

    <button class="saio-zabaldu" aria-expanded="false">
      <span>Irakaslearen denborak · ${guztira} min</span>${ICON('fletxa')}
    </button>
    <div class="saio__denborak"><div>
      <ol class="denbora-zerrenda">
        ${s.denborak.map(d => `<li><span class="denbora-min">${esc(d.min)}'</span><span>${esc(d.egitekoa)}</span></li>`).join('')}
      </ol>
    </div></div>
  </article>`;
}

/* ---------- LANABES-KUTXA ---------- */
function renderLanabesak(l) {
  const s = document.getElementById('lanabesak');
  s.innerHTML = `
    <div class="atal__goiburua">
      <span class="atal__etiketa">${ICON('eraikuntza')} ${esc(l.etiketa)}</span>
      <h2 id="lanabesak-h">${esc(l.izenburua)}</h2>
      <p class="atal__sarrera">${esc(l.sarrera)}</p>
    </div>
    <div class="lanabes-sareta">
      ${l.fitxak.map(f => `
        <article class="lanabes-txartela">
          <a class="lanabes-azala" href="${esc(f.lotura)}" aria-label="${esc(f.izena)} — ireki">
            <div class="lanabes-buru">
              <span class="lanabes-ikono">${ICON(f.ikonoa || 'fitxa')}</span>
              <span class="lanabes-kodea">${esc(f.kodea)}</span>
            </div>
            <h3>${esc(f.izena)}</h3>
            <p>${esc(f.deskribapena)}</p>
          </a>
          <div class="lanabes-ekintzak">
            <a class="lanabes-sartu" href="${esc(f.lotura)}">Ireki eta inprimatu ${ICON('fletxa')}</a>
            ${f.pdf ? `<a class="lanabes-pdf" href="${esc(f.pdf)}" download>PDF</a>` : ''}
          </div>
        </article>`).join('')}
    </div>`;
}

/* ---------- ATLAS LOTURA ---------- */
function renderAtlas(a) {
  const s = document.getElementById('atlas-lotura');
  s.innerHTML = `
    <div class="atlas-blokea">
      <div class="atlas-blokea__testua">
        <span class="atlas-blokea__etiketa">${esc(a.etiketa)}</span>
        <h2>${esc(a.izenburua)}</h2>
        <p>${esc(a.testua)}</p>
      </div>
      <a class="atlas-botoia" href="${esc(a.lotura)}">${esc(a.botoia)} ${ICON('fletxa')}</a>
    </div>`;
}

/* ---------- ERREPASO INTERAKTIBOA ---------- */
function renderErrepasoa(e) {
  const s = document.getElementById('errepasoa');
  s.innerHTML = `
    <div class="atal__goiburua">
      <span class="atal__etiketa">${ICON('begia')} ${esc(e.etiketa)}</span>
      <h2 id="errepasoa-h">${esc(e.izenburua)}</h2>
      <p class="atal__sarrera">${esc(e.sarrera)}</p>
    </div>
    <div class="errepaso-blokeak">
      <div class="errepaso-zatia" id="sailkapen-jokoa"></div>
      <div class="errepaso-zatia" id="autotesta"></div>
    </div>`;
  if (e.sailkapena) renderSailkapena(e.sailkapena);
  if (e.autotesta) renderAutotesta(e.autotesta);
}

/* ----- Sailkapen-jokoa ----- */
function renderSailkapena(d) {
  const wrap = document.getElementById('sailkapen-jokoa');
  const azalpenaId = 'sailk-azalpena';
  wrap.innerHTML = `
    <div class="errepaso-buru">
      <h3>${ICON('lente')} ${esc(d.izenburua)}</h3>
      <p>${esc(d.argibidea)}</p>
    </div>
    <div class="sailk-aurrera"><span class="sailk-kont">1</span> / ${d.itemak.length}
      <span class="sailk-emaitza" aria-live="polite"></span>
    </div>
    <div class="sailk-txartela">
      <p class="sailk-esaldia"></p>
      <div class="sailk-botoiak" role="group" aria-label="Sailkatu esaldia">
        ${d.kategoriak.map(k => `<button class="sailk-botoi" data-id="${k.id}" title="${esc(k.definizioa)}">${esc(k.izena)}</button>`).join('')}
      </div>
      <div class="sailk-feedback" id="${azalpenaId}" hidden></div>
      <button class="errepaso-hurrengo" hidden>Hurrengoa ${ICON('fletxa')}</button>
    </div>
    <div class="sailk-amaiera" hidden></div>`;

  const kat = Object.fromEntries(d.kategoriak.map(k => [k.id, k.izena]));
  let i = 0, zuzenak = 0, erantzunda = false;
  const esaldiaEl = wrap.querySelector('.sailk-esaldia');
  const botoiak = [...wrap.querySelectorAll('.sailk-botoi')];
  const feedback = wrap.querySelector('.sailk-feedback');
  const hurrengoBtn = wrap.querySelector('.errepaso-hurrengo');
  const kontEl = wrap.querySelector('.sailk-kont');
  const emaitzaEl = wrap.querySelector('.sailk-emaitza');
  const txartela = wrap.querySelector('.sailk-txartela');
  const amaiera = wrap.querySelector('.sailk-amaiera');

  function kargatu() {
    const item = d.itemak[i];
    esaldiaEl.textContent = '«' + item.esaldia + '»';
    kontEl.textContent = i + 1;
    erantzunda = false;
    feedback.hidden = true; feedback.innerHTML = '';
    hurrengoBtn.hidden = true;
    botoiak.forEach(b => { b.disabled = false; b.className = 'sailk-botoi'; });
  }

  botoiak.forEach(b => b.addEventListener('click', () => {
    if (erantzunda) return;
    erantzunda = true;
    const item = d.itemak[i];
    const ondo = b.dataset.id === item.erantzuna;
    if (ondo) zuzenak++;
    botoiak.forEach(x => {
      x.disabled = true;
      if (x.dataset.id === item.erantzuna) x.classList.add('is-zuzena');
      else if (x === b) x.classList.add('is-oker');
    });
    feedback.hidden = false;
    feedback.className = 'sailk-feedback ' + (ondo ? 'is-ondo' : 'is-gaizki');
    feedback.innerHTML = `<strong>${ondo ? 'Bai.' : 'Erantzun zuzena: ' + esc(kat[item.erantzuna]) + '.'}</strong> ${esc(item.azalpena)}`;
    hurrengoBtn.hidden = false;
    hurrengoBtn.textContent = (i + 1 < d.itemak.length) ? 'Hurrengoa →' : 'Ikusi emaitza →';
  }));

  hurrengoBtn.addEventListener('click', () => {
    if (i + 1 < d.itemak.length) { i++; kargatu(); hurrengoBtn.scrollIntoView({block:'nearest'}); }
    else amaitu();
  });

  function amaitu() {
    txartela.hidden = true;
    amaiera.hidden = false;
    const ehuneko = Math.round(zuzenak / d.itemak.length * 100);
    amaiera.innerHTML = `
      <p class="amaiera-emaitza">${zuzenak} / ${d.itemak.length}</p>
      <p class="amaiera-mezua">${emaitzaMezua(ehuneko)}</p>
      <button class="errepaso-berriz">↻ Berriz egin</button>`;
    amaiera.querySelector('.errepaso-berriz').addEventListener('click', () => {
      i = 0; zuzenak = 0; amaiera.hidden = true; txartela.hidden = false; kargatu();
    });
    emaitzaEl.textContent = '· Amaituta';
  }

  kargatu();
}

/* ----- Autotesta ----- */
function renderAutotesta(d) {
  const wrap = document.getElementById('autotesta');
  wrap.innerHTML = `
    <div class="errepaso-buru">
      <h3>${ICON('garuna')} ${esc(d.izenburua)}</h3>
      <p>${esc(d.argibidea)}</p>
    </div>
    <div class="test-aurrera"><span class="test-kont">1</span> / ${d.galderak.length}</div>
    <div class="test-txartela">
      <p class="test-galdera"></p>
      <div class="test-aukerak" role="group" aria-label="Aukeratu erantzuna"></div>
      <div class="test-feedback" hidden></div>
      <button class="errepaso-hurrengo" hidden>Hurrengoa ${ICON('fletxa')}</button>
    </div>
    <div class="test-amaiera" hidden></div>`;

  let i = 0, zuzenak = 0, erantzunda = false;
  const galderaEl = wrap.querySelector('.test-galdera');
  const aukeraketa = wrap.querySelector('.test-aukerak');
  const feedback = wrap.querySelector('.test-feedback');
  const hurrengoBtn = wrap.querySelector('.errepaso-hurrengo');
  const kontEl = wrap.querySelector('.test-kont');
  const txartela = wrap.querySelector('.test-txartela');
  const amaiera = wrap.querySelector('.test-amaiera');

  function kargatu() {
    const g = d.galderak[i];
    galderaEl.textContent = g.galdera;
    kontEl.textContent = i + 1;
    erantzunda = false;
    feedback.hidden = true; feedback.innerHTML = '';
    hurrengoBtn.hidden = true;
    aukeraketa.innerHTML = g.aukerak.map((a, idx) =>
      `<button class="test-aukera" data-idx="${idx}">${esc(a)}</button>`).join('');
    aukeraketa.querySelectorAll('.test-aukera').forEach(b => b.addEventListener('click', () => erantzun(b, g)));
  }

  function erantzun(b, g) {
    if (erantzunda) return;
    erantzunda = true;
    const idx = +b.dataset.idx;
    const ondo = idx === g.zuzena;
    if (ondo) zuzenak++;
    aukeraketa.querySelectorAll('.test-aukera').forEach((x, xi) => {
      x.disabled = true;
      if (xi === g.zuzena) x.classList.add('is-zuzena');
      else if (x === b) x.classList.add('is-oker');
    });
    feedback.hidden = false;
    feedback.className = 'test-feedback ' + (ondo ? 'is-ondo' : 'is-gaizki');
    feedback.innerHTML = `<strong>${ondo ? 'Bai.' : 'Ez guztiz.'}</strong> ${esc(g.azalpena)}`;
    hurrengoBtn.hidden = false;
    hurrengoBtn.textContent = (i + 1 < d.galderak.length) ? 'Hurrengoa →' : 'Ikusi emaitza →';
  }

  hurrengoBtn.addEventListener('click', () => {
    if (i + 1 < d.galderak.length) { i++; kargatu(); }
    else amaitu();
  });

  function amaitu() {
    txartela.hidden = true;
    amaiera.hidden = false;
    const ehuneko = Math.round(zuzenak / d.galderak.length * 100);
    amaiera.innerHTML = `
      <p class="amaiera-emaitza">${zuzenak} / ${d.galderak.length}</p>
      <p class="amaiera-mezua">${emaitzaMezua(ehuneko)}</p>
      <button class="errepaso-berriz">↻ Berriz egin</button>`;
    amaiera.querySelector('.errepaso-berriz').addEventListener('click', () => {
      i = 0; zuzenak = 0; amaiera.hidden = true; txartela.hidden = false; kargatu();
    });
  }

  kargatu();
}

function emaitzaMezua(ehuneko) {
  if (ehuneko >= 85) return 'Bikain! Kontzeptuak argi dituzu eta behaketa eta interpretazioa ondo bereizten dituzu.';
  if (ehuneko >= 60) return 'Ondo bidean. Begiratu berriz huts egin dituzun azalpenak: askotan behaketa eta iritzia nahasten dira.';
  return 'Lasai: hau ez da azterketa. Irakurri berriz azalpenak eta egin berriz — pentsatzeko da, ez asmatzeko.';
}

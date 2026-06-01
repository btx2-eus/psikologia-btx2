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

/* ---------- SAIOEN SEKUENTZIA ---------- */
function renderSaioak(D) {
  const s = document.getElementById('saioak');
  s.innerHTML = `
    <div class="atal__goiburua">
      <span class="atal__etiketa">${ICON('denbora')} 5 saio</span>
      <h2 id="saioak-h">${esc(D.saioakIzenburua)}</h2>
      <p class="atal__sarrera">${esc(D.saioakSarrera)}</p>
    </div>
    <div class="saioak-zerrenda">
      ${D.saioak.map(saioTxartela).join('')}
    </div>`;

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
  const fitxaLotura = s.fitxa && s.fitxa.lotura;
  const fitxaTxiki = s.fitxa
    ? (fitxaLotura
        ? `<a class="saio-baliabide saio-baliabide--lotura" href="${esc(s.fitxa.lotura)}">${ICON('fitxa')} ${esc(s.fitxa.izena)}</a>`
        : `<span class="saio-baliabide">${ICON('fitxa')} ${esc(s.fitxa.izena)}</span>`)
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
      <span class="saio-baliabide saio-baliabide--aurkezpena">${ICON('aurkezpena')} ${esc(s.aurkezpena)}</span>
      ${fitxaTxiki}
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
        <a class="lanabes-txartela" href="${esc(f.lotura)}">
          <div class="lanabes-buru">
            <span class="lanabes-ikono">${ICON(f.ikonoa || 'fitxa')}</span>
            <span class="lanabes-kodea">${esc(f.kodea)}</span>
          </div>
          <h3>${esc(f.izena)}</h3>
          <p>${esc(f.deskribapena)}</p>
          <span class="lanabes-sartu">Ireki eta inprimatu ${ICON('fletxa')}</span>
        </a>`).join('')}
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

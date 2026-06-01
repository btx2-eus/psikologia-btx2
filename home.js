/* =================================================================
   PSIKOLOGIA BTX2 — ATARIA (home.js)
   Edukia content/atari.json fitxategitik kargatzen da.
   ================================================================= */

const ICON = (id, k = '') => `<svg class="${k}" aria-hidden="true"><use href="#ic-${id}"></use></svg>`;
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const blokeKolorea = (id) => `var(--b-${id})`;

let DATA = null;

document.addEventListener('DOMContentLoaded', init);

async function init() {
  try {
    const e = await fetch('content/atari.json');
    if (!e.ok) throw new Error('HTTP ' + e.status);
    DATA = await e.json();
  } catch (err) {
    document.getElementById('blokeak-edukia').innerHTML =
      `<p style="padding:1.5rem;background:#fff;border-radius:12px">Ezin izan da edukia kargatu
      (<code>content/atari.json</code>). Webgunea zerbitzari batetik ireki behar da.</p>`;
    console.error(err);
    return;
  }

  // Heroa
  if (DATA.meta) {
    document.getElementById('atari-izenburua').textContent = DATA.meta.izenburua || 'Psikologia';
    document.getElementById('atari-esaldia').textContent = DATA.meta.esaldia || '';
    document.getElementById('atari-sarrera').textContent = DATA.meta.sarrera || '';
  }

  renderBlokeak();
}

function renderBlokeak() {
  const k = document.getElementById('blokeak-edukia');
  const et = DATA.egoeraEtiketak || { prest: 'Prest', laster: 'Laster' };

  k.innerHTML = DATA.blokeak.map(b => `
    <section class="bloke" style="--bloke:${blokeKolorea(b.kolorea)}">
      <div class="bloke__buru">
        <span class="bloke__txartela">${esc(b.izena)}</span>
        <p class="bloke__deskribapena">${esc(b.deskribapena || '')}</p>
      </div>
      <div class="gai-sareta">
        ${b.gaiak.map(g => gaiTxartela(g, et)).join('')}
      </div>
    </section>`).join('');
}

function gaiTxartela(g, et) {
  const prest = g.egoera === 'prest';
  const etag = g.etiketak && g.etiketak.length
    ? `<div class="gai-etiketak">${g.etiketak.map(t => `<span class="gai-etiketa">${esc(t)}</span>`).join('')}</div>`
    : '';
  const azpi = g.azpititulua ? `<p class="gai-azpititulua">${esc(g.azpititulua)}</p>` : '';

  const barnea = `
    <div class="gai-buru">
      <span class="gai-ikono">${ICON(g.ikonoa || 'lente')}</span>
      <span class="gai-egoera gai-egoera--${prest ? 'prest' : 'laster'}">${esc(prest ? et.prest : et.laster)}</span>
    </div>
    <h3 class="gai-izenburua">${esc(g.izenburua)}</h3>
    ${azpi}
    <p class="gai-deskribapena">${esc(g.deskribapena || '')}</p>
    ${etag}
    ${prest
      ? `<span class="gai-sartu">Hasi gaia ${ICON('fletxa')}</span>`
      : `<span class="gai-sartu" style="color:var(--ink-3)">Prestatzen…</span>`}`;

  if (prest && g.lotura) {
    return `<a class="gai-txartela gai-txartela--prest" href="${esc(g.lotura)}"
              aria-label="${esc(g.izenburua)} — gaia ireki">${barnea}</a>`;
  }
  return `<article class="gai-txartela gai-txartela--laster"
            aria-label="${esc(g.izenburua)} — laster">${barnea}</article>`;
}

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
    const e = await fetch('content/atari.json', { cache: 'no-cache' });
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
    setText('atari-mapa', DATA.meta.mapaIzena);
    setText('atari-esaldia', DATA.meta.esaldia);
    setText('atari-azentua', DATA.meta.azentua);
  }

  // Helburu nagusia
  if (DATA.helburuNagusia) {
    setText('helburu-etiketa', DATA.helburuNagusia.etiketa || 'Helburu nagusia');
    setText('helburua-testua', DATA.helburuNagusia.testua);
    setText('helburua-oharra', DATA.helburuNagusia.oharra);
  }

  if (DATA.hasiHemen) renderHasiHemen(DATA.hasiHemen);
  renderBlokeak();
  renderLegenda();
  renderLanModua();
}

function setText(id, t) { const el = document.getElementById(id); if (el && t != null) el.textContent = t; }

/* ---------- HASI HEMEN ---------- */
function renderHasiHemen(h) {
  const s = document.getElementById('hasi-hemen');
  if (!s) return;
  s.innerHTML = `
    <div class="hasi-hemen__bilgarria">
      <div class="hasi-hemen__buru">
        <span class="hasi-hemen__etiketa" id="hasi-hemen-h">${ICON('fletxa')} ${esc(h.izenburua)}</span>
        <p>${esc(h.sarrera)}</p>
      </div>
      <ol class="hasi-hemen__pausoak">
        ${h.pausoak.map(p => `
          <a class="hasi-pauso" href="${esc(p.lotura)}">
            <span class="hasi-pauso__zenb">${p.zenb}</span>
            <span class="hasi-pauso__testua">
              <strong>${esc(p.izena)}</strong>
              <span>${esc(p.deskribapena)}</span>
            </span>
            <span class="hasi-pauso__gezi">${ICON('fletxa')}</span>
          </a>`).join('')}
      </ol>
    </div>`;
}

/* ---------- EGOERA-LEGENDA ---------- */
function renderLegenda() {
  const el = document.getElementById('egoera-legenda');
  if (!el || !DATA.egoeraLegenda) return;
  const et = DATA.egoeraEtiketak || {};
  el.innerHTML = DATA.egoeraLegenda.map(l => `
    <li><span class="legenda-domina gai-egoera--${esc(l.egoera)}">${esc(et[l.egoera] || l.egoera)}</span>${esc(l.azalpena)}</li>`).join('');
}

function renderBlokeak() {
  const k = document.getElementById('blokeak-edukia');
  const et = DATA.egoeraEtiketak || { prest: 'Prest', laster: 'Laster' };

  k.innerHTML = DATA.blokeak.map(b => {
    // ebaluazio-blokeek gaia + galdera dute; abiapuntuak deskribapena soilik
    const buru = b.gaia
      ? `<div class="bloke__buru bloke__buru--ebal">
           <span class="bloke__txartela">${esc(b.izena)}</span>
           <div class="bloke__titulua">
             <h3 class="bloke__gaia">${esc(b.gaia)}</h3>
             ${b.galdera ? `<p class="bloke__galdera">${esc(b.galdera)}</p>` : ''}
           </div>
         </div>`
      : `<div class="bloke__buru">
           <span class="bloke__txartela">${esc(b.izena)}</span>
           <p class="bloke__deskribapena">${esc(b.deskribapena || '')}</p>
         </div>`;

    return `
    <section class="bloke" style="--bloke:${blokeKolorea(b.kolorea)}">
      ${buru}
      <div class="gai-sareta">
        ${b.gaiak.map(g => gaiTxartela(g, et)).join('')}
      </div>
    </section>`;
  }).join('');
}

/* ---------- LAN MODUA ---------- */
function renderLanModua() {
  const lm = DATA.lanModua;
  if (!lm) return;
  setText('lan-modua-etiketa', lm.etiketa);
  setText('lan-modua-sarrera', lm.sarrera);
  setText('lan-modua-ikasteko', DATA.ikastekoModua);
  const z = document.getElementById('lan-modua-zerrenda');
  if (z) {
    z.innerHTML = lm.zerrenda.map(item => `
      <li class="lan-modua__item lan-modua__item--${esc(item.mota || 'azalpena')}">
        <span class="lan-modua__ikono">${ICON(item.ikonoa || 'lente')}</span>
        <span>${esc(item.testua)}</span>
      </li>`).join('');
  }
}

function gaiTxartela(g, et) {
  const egoera = g.egoera || 'laster';
  const klikagarri = (egoera === 'prest' || egoera === 'abian') && g.lotura;
  const etiketa = et[egoera] || egoera;

  const etag = g.etiketak && g.etiketak.length
    ? `<div class="gai-etiketak">${g.etiketak.map(t => `<span class="gai-etiketa">${esc(t)}</span>`).join('')}</div>`
    : '';
  const azpi = g.azpititulua ? `<p class="gai-azpititulua">${esc(g.azpititulua)}</p>` : '';

  const sartu = {
    prest: `<span class="gai-sartu">Hasi gaia ${ICON('fletxa')}</span>`,
    abian: `<span class="gai-sartu">Ireki gunea ${ICON('fletxa')}</span>`,
    laster: `<span class="gai-sartu" style="color:var(--ink-3)">Prestatzen…</span>`
  }[egoera] || '';

  const barnea = `
    <div class="gai-buru">
      <span class="gai-ikono">${ICON(g.ikonoa || 'lente')}</span>
      <span class="gai-egoera gai-egoera--${esc(egoera)}">${esc(etiketa)}</span>
    </div>
    <h3 class="gai-izenburua">${esc(g.izenburua)}</h3>
    ${azpi}
    <p class="gai-deskribapena">${esc(g.deskribapena || '')}</p>
    ${etag}
    ${sartu}`;

  if (klikagarri) {
    return `<a class="gai-txartela gai-txartela--${esc(egoera)}" href="${esc(g.lotura)}"
              aria-label="${esc(g.izenburua)} — gaia ireki">${barnea}</a>`;
  }
  return `<article class="gai-txartela gai-txartela--laster"
            aria-label="${esc(g.izenburua)} — laster">${barnea}</article>`;
}

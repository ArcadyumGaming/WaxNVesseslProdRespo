const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg = p => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const ICON = {
  Candles: svg('<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'),
  Frames: svg('<line x1="22" x2="2" y1="6" y2="6"/><line x1="22" x2="2" y1="18" y2="18"/><line x1="6" x2="6" y1="2" y2="22"/><line x1="18" x2="18" y1="2" y2="22"/>'),
  'Gift Boxes': svg('<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13"/><path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5"/>'),
};
const CATS = [
  ['Candles', 'Scented, unscented and customised.'],
  ['Frames', 'Decorative and personalised.'],
  ['Gift Boxes', 'Curated and customisable.'],
];
const FLAME = '<svg viewBox="0 0 40 40"><path d="M20 3c2.6 4.6 6.6 7.2 6.6 12.4a6.6 6.6 0 0 1-13.2 0c0-2.6 1.3-4 2.7-5.8.7 1.9 1.4 2.6 2.6 2.6 0-3.3-.7-5.9.9-9.2Z" fill="currentColor"/><path d="M13 31.5h14l-1.2 5.3a2 2 0 0 1-2 1.5h-7.6a2 2 0 0 1-2-1.5L13 31.5Z" fill="currentColor" opacity=".85"/></svg>';

let S = { brand_name: 'Wax n Vessels', whatsapp: '923295423551', hero_title: 'Thoughtful Gifts, Beautifully Made.', hero_text: 'Handcrafted candles, meaningful frames, and curated gift boxes for the moments that matter.', about_text: '', logo_url: '', hero_url: '' };
let P = [], cat = 'All', q = '', sort = 'rec';

const digits = n => String(n || '').replace(/\D/g, '').replace(/^0(\d{10})$/, '92$1');
const fmt = n => 'PKR ' + Number(n).toLocaleString('en-US');
const eff = p => (p.sale_price != null && Number(p.sale_price) < Number(p.price)) ? Number(p.sale_price) : Number(p.price);
const wa = (text) => 'https://wa.me/' + digits(S.whatsapp) + (text ? '?text=' + encodeURIComponent(text) : '');

async function load() {
  try {
    const [s, p] = await Promise.all([
      sb.from('settings').select('*').eq('id', 1).single(),
      sb.from('products').select('*').eq('published', true).order('created_at', { ascending: false }),
    ]);
    if (s.data) S = { ...S, ...s.data };
    P = p.data || [];
    if (p.error) throw p.error;
  } catch (e) {
    console.error(e);
    $('#grid').innerHTML = '<div class="empty">Could not load the shop. Check config.js and that setup.sql was run.</div>';
  }
  render();
}

function render() {
  const brand = esc(S.brand_name);
  document.title = `${S.brand_name} | Handmade candles, frames and gift boxes`;
  const logo = S.logo_url ? `<img src="${esc(S.logo_url)}" alt="${brand}">` : `${FLAME}<b>${brand}</b>`;
  $('#logo').innerHTML = logo;
  $('#flogo').innerHTML = S.logo_url ? `<img src="${esc(S.logo_url)}" alt="${brand}" style="filter:brightness(0) invert(1)">` : `${FLAME}<b>${brand}</b>`;
  $('#heroTitle').textContent = S.hero_title;
  $('#heroText').textContent = S.hero_text;
  $('#heroArt').innerHTML = S.hero_url
    ? `<img src="${esc(S.hero_url)}" alt="${brand}" fetchpriority="high">`
    : `${FLAME}<p>Candles, frames and gift boxes, made by hand.</p>`;
  $('#aboutText').textContent = S.about_text;
  $('#cb').textContent = S.brand_name;
  $('#yr').textContent = new Date().getFullYear();
  const hi = `Hello ${S.brand_name}! `;
  $('#waTop').href = wa(hi + 'I have a question.');
  $('#waCustom').href = wa(hi + 'I would like a customised gift.');
  $('#waFoot').href = wa(hi + 'I have a question.');
  [['ig', 'instagram'], ['fb', 'facebook'], ['tt', 'tiktok']].forEach(([id, k]) => { const a = $('#' + id); a.hidden = !S[k]; a.href = S[k] || '#'; });

  $('#cats').innerHTML = CATS.map(([n, d]) => `<button class="cat" data-cat="${n}">${ICON[n]}<h3>${n}</h3><p>${d}</p></button>`).join('');
  $('#pills').innerHTML = ['All', ...CATS.map(c => c[0])].map(n => `<button class="pill ${n === cat ? 'on' : ''}" data-cat="${n}">${n}</button>`).join('');
  renderGrid();
}

function renderGrid() {
  const needle = q.trim().toLowerCase();
  let list = P.filter(p => (cat === 'All' || p.category === cat) && (!needle || `${p.name} ${p.description} ${p.sku}`.toLowerCase().includes(needle)));
  if (sort === 'lo') list.sort((a, b) => eff(a) - eff(b));
  if (sort === 'hi') list.sort((a, b) => eff(b) - eff(a));
  $('#grid').innerHTML = list.length ? list.map(card).join('') : `<div class="empty">${P.length ? 'Nothing matches your search.' : 'New gifts are on their way. Message us on WhatsApp and we will help you choose.'}</div>`;
}

const photo = (p, i = 0) => p.images && p.images[i]
  ? `<img src="${esc(p.images[i])}" alt="${esc(p.name)}" loading="lazy">`
  : `${ICON[p.category] || ICON.Candles}<span>Photo coming soon</span>`;

function card(p) {
  const sale = eff(p) < Number(p.price);
  return `<button class="card" data-sku="${esc(p.sku)}">
    <div class="ph">${sale ? '<span class="tag">Sale</span>' : ''}${!p.in_stock ? '<span class="tag oos" style="' + (sale ? 'top:42px' : '') + '">Out of stock</span>' : ''}${photo(p)}</div>
    <h3>${esc(p.name)}</h3><div class="cc">${esc(p.category)}</div>
    <div class="price">${fmt(eff(p))}${sale ? `<s>${fmt(p.price)}</s>` : ''}</div></button>`;
}

function openProduct(sku) {
  const p = P.find(x => x.sku === sku);
  if (!p) return;
  const sale = eff(p) < Number(p.price);
  const imgs = p.images || [];
  $('#pd').innerHTML = `<div class="pd">
    <div class="gal"><div class="main" id="mainPh">${photo(p)}</div>
      ${imgs.length > 1 ? `<div class="thumbs">${imgs.map((u, i) => `<img src="${esc(u)}" alt="" data-i="${i}" class="${i ? '' : 'on'}">`).join('')}</div>` : ''}</div>
    <div class="info">
      <div class="sku">${esc(p.category)} · Product ID ${esc(p.sku)}</div>
      <h2>${esc(p.name)}</h2>
      <div class="big">${fmt(eff(p))}${sale ? `<s>${fmt(p.price)}</s>` : ''}</div>
      ${p.description ? `<div class="desc">${esc(p.description)}</div>` : ''}
      ${p.in_stock ? `
        <label for="note">Personalisation or notes (optional)</label>
        <textarea id="note" rows="2" maxlength="400" placeholder="Name, message, colour, scent…"></textarea>
        <label>Quantity</label>
        <div class="qty"><button type="button" id="mn" aria-label="Less">−</button><input id="qty" value="1" inputmode="numeric" aria-label="Quantity"><button type="button" id="pl" aria-label="More">+</button></div>
        <a class="btn" id="order" target="_blank" rel="noopener">Order on WhatsApp</a>
        <p class="note">WhatsApp opens with your order typed out. Press <b>Send</b> to message us. Nothing is ordered until we reply and confirm.</p>`
      : `<p class="note" style="font-size:15px">This item is out of stock right now.</p><a class="btn" target="_blank" rel="noopener" href="${wa(`Hello ${S.brand_name}! When will ${p.name} (${p.sku}) be available again?`)}">Ask on WhatsApp</a>`}
    </div></div>`;
  const dlg = $('#dlg');
  if (!dlg.open) dlg.showModal();
  history.replaceState(null, '', '#p=' + encodeURIComponent(p.sku));

  $('#pd').querySelectorAll('.thumbs img').forEach(t => t.onclick = () => {
    $('#mainPh').innerHTML = photo(p, +t.dataset.i);
    $('#pd').querySelectorAll('.thumbs img').forEach(x => x.classList.toggle('on', x === t));
  });
  if (p.in_stock) {
    const upd = () => {
      const qty = Math.min(99, Math.max(1, parseInt($('#qty').value, 10) || 1));
      const note = $('#note').value.trim().replace(/\s*\n\s*/g, ' ');
      const link = location.origin + location.pathname + '#p=' + encodeURIComponent(p.sku);
      const msg = [`Hello ${S.brand_name}! I'd like to order:`, '', `Product: ${p.name}`, `Product ID: ${p.sku}`, `Product link: ${link}`,
        `Price: ${fmt(eff(p))}`, `Quantity: ${qty}`, `Customization: ${note || 'None'}`, '', 'Please confirm availability, delivery charges, and payment instructions.'].join('\n');
      $('#order').href = wa(msg);
    };
    $('#mn').onclick = () => { $('#qty').value = Math.max(1, (parseInt($('#qty').value, 10) || 1) - 1); upd(); };
    $('#pl').onclick = () => { $('#qty').value = Math.min(99, (parseInt($('#qty').value, 10) || 1) + 1); upd(); };
    $('#qty').oninput = upd; $('#note').oninput = upd; upd();
  }
}

function setCat(c) { cat = c; render(); document.getElementById('shop').scrollIntoView({ behavior: 'smooth' }); }

document.addEventListener('click', e => {
  const c = e.target.closest('[data-cat]'); if (c) { e.preventDefault(); return setCat(c.dataset.cat); }
  const k = e.target.closest('[data-sku]'); if (k) openProduct(k.dataset.sku);
});
$('#close').onclick = () => $('#dlg').close();
$('#dlg').addEventListener('click', e => { if (e.target === $('#dlg')) $('#dlg').close(); });
$('#dlg').addEventListener('close', () => history.replaceState(null, '', location.pathname + location.search));
$('#q').oninput = e => { q = e.target.value; renderGrid(); };
$('#sort').onchange = e => { sort = e.target.value; renderGrid(); };
function fromHash() { const m = location.hash.match(/^#p=(.+)$/); if (m && P.length) openProduct(decodeURIComponent(m[1])); }
window.addEventListener('hashchange', fromHash);

load().then(fromHash);
// Live updates: when you change something in the admin, the shop refreshes by itself.
try { sb.channel('live').on('postgres_changes', { event: '*', schema: 'public' }, () => load()).subscribe(); } catch (e) {}

// app.js - central script for Spotlight Picks (hybrid workflow)

// --- Storage & fetching ---
async function fetchProductsJson(){
  try{
    const res = await fetch('products.json', {cache:'no-store'});
    if(!res.ok) throw new Error('no products.json');
    const data = await res.json();
    return Array.isArray(data.products) ? data.products : [];
  }catch(e){
    return [];
  }
}

function loadLocalProducts(){ return JSON.parse(localStorage.getItem('products') || '[]') }
function saveLocalProducts(arr){ localStorage.setItem('products', JSON.stringify(arr)) }
function loadFavorites(){ return JSON.parse(localStorage.getItem('favorites') || '[]') }
function saveFavorites(favs){ localStorage.setItem('favorites', JSON.stringify(favs)) }

// merge repo + local (repo first so published items show for all)
async function getAllProducts(){
  const repo = await fetchProductsJson();
  const local = loadLocalProducts();
  const merged = [...repo];
  local.forEach(lp=>{ if(!merged.some(r=>r.id===lp.id)) merged.push(lp) });
  return merged;
}

// --- UI helpers ---
function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

function updateProfileButtons(topBtnId='topProfileBtn', bottomBtnId='bottomProfileBtn'){
  const t = document.getElementById(topBtnId);
  const b = document.getElementById(bottomBtnId);
  const user = localStorage.getItem('userName');
  if(t) t.onclick = ()=> user ? location.href='profile.html' : location.href='signin.html';
  if(b){
    if(user){ b.innerHTML = `<i class="fas fa-user"></i>${escapeHtml(user)}`; b.onclick = ()=> location.href='profile.html'; }
    else { b.innerHTML = `<i class="fas fa-user"></i>Profile`; b.onclick = ()=> location.href='signin.html'; }
  }
}

// --- Search setup ---
function setupSearch(){
  const s = document.getElementById('searchInput'); if(!s) return;
  s.addEventListener('input', async ()=>{
    const q = s.value.toLowerCase();
    // If homepage present, re-render categories (lighter)
    if(document.getElementById('categoriesContainer')) {
      renderHomepageCategories(q);
    } else {
      // fallback: do nothing
    }
  });
}

// --- Homepage rendering with animations ---
async function renderHomepageCategories(filter='', highlightId=''){
  const products = await getAllProducts();
  const categories = ['hoodies','shirts','pants'];
  const container = document.getElementById('categoriesContainer');
  if(!container) return;
  container.innerHTML = '';

  categories.forEach(cat=>{
    const filtered = products.filter(p=>p.category===cat && p.name.toLowerCase().includes(filter.toLowerCase()));
    if(filtered.length===0) return;
    const section = document.createElement('div');
    section.className = 'section';
    section.innerHTML = `<div class="section-title">${cat.charAt(0).toUpperCase()+cat.slice(1)}</div>`;
    const row = document.createElement('div'); row.className = 'row';
    filtered.forEach((p,i)=>{
      const card = document.createElement('div'); card.className = 'card';
      card.innerHTML = `
        <button class="favorite" title="Favorite">♡</button>
        <img src="${escapeHtml(p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/600')}" alt="${escapeHtml(p.name)}">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="price">${escapeHtml(p.price||'')}</div>
        <div style="margin-top:8px;display:flex;gap:8px;justify-content:center">
          <a class="btn-small" href="${escapeHtml(p.link||'#')}" target="_blank">Buy</a>
          <a class="btn-small" href="product.html?id=${encodeURIComponent(p.id)}" style="background:#fff;color:#ff3d8e;border:1px solid #ff3d8e">View</a>
        </div>
      `;
      // favorite toggler
      const favBtn = card.querySelector('.favorite');
      favBtn.addEventListener('click', (ev)=>{
        ev.stopPropagation();
        const favs = loadFavorites();
        const idx = favs.indexOf(p.name);
        if(idx === -1){ favs.unshift(p.name); favBtn.innerText = '❤️'; }
        else { favs.splice(idx,1); favBtn.innerText = '♡'; }
        saveFavorites(favs);
      });

      // click card -> product
      card.addEventListener('click', ()=> location.href = `product.html?id=${encodeURIComponent(p.id)}`);

      // hover image zoom
      const img = card.querySelector('img');
      img.style.transition = 'transform .28s';
      card.addEventListener('mouseenter', ()=> img.style.transform = 'scale(1.05)');
      card.addEventListener('mouseleave', ()=> img.style.transform = 'scale(1)');

      // initial invisible for animate
      card.style.opacity = 0;
      card.style.transform = 'translateY(20px)';
      // append then animate with stagger
      row.appendChild(card);
      setTimeout(()=> {
        card.style.transition = 'all .5s cubic-bezier(.2,.9,.2,1)';
        card.style.opacity = 1;
        card.style.transform = 'translateY(0)';
        if(highlightId && p.id === highlightId){
          card.style.boxShadow = '0 0 20px 4px rgba(255,74,158,0.7)';
          setTimeout(()=> card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.16)', 1800);
        }
      }, i*80);
    });
    section.appendChild(row);
    container.appendChild(section);
  });
}

// --- Product page renderer (reads from combined list) ---
async function renderProductPage(productId){
  const all = await getAllProducts();
  let product = null;
  if(productId) product = all.find(p => p.id === productId);
  if(!product) return null;
  // build HTML (product.html will call)
  return product;
}

// --- Save product locally (used by add-product.html) ---
function saveProductLocally(productObj){
  const arr = loadLocalProducts();
  arr.push(productObj);
  saveLocalProducts(arr);
}

// --- Exports / attach to window for pages to call ---
window.app = {
  fetchProductsJson,
  getAllProducts,
  loadLocalProducts,
  saveLocalProducts,
  saveProductLocally,
  renderHomepageCategories,
  renderProductPage,
  updateProfileButtons,
  setupSearch,
  loadFavorites,
  saveFavorites,
  escapeHtml
};

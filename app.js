// app.js - Spotlight Picks shared JS
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

async function getAllProducts(){
  const repo = await fetchProductsJson();
  const local = loadLocalProducts();
  const merged = [...repo];
  local.forEach(lp => { if(!merged.some(r=>r.id===lp.id)) merged.push(lp) });
  return merged;
}

async function renderHomepageProducts(){
  const products = await getAllProducts();
  const hoodies = document.getElementById('hoodies'), shirts = document.getElementById('shirts'), pants = document.getElementById('pants');
  if(hoodies) hoodies.innerHTML = ''; if(shirts) shirts.innerHTML = ''; if(pants) pants.innerHTML = '';
  products.forEach(p=>{
    const card = document.createElement('div'); card.className='card';
    const img = p.images && p.images[0] ? p.images[0] : 'https://via.placeholder.com/600';
    card.innerHTML = `
      <button class="favorite" onclick="toggleFavoriteFromCard(event,'${p.id}')">♡</button>
      <img src="${img}" alt="${escapeHtml(p.name)}">
      <h3>${escapeHtml(p.name)}</h3>
      <div class="price">${escapeHtml(p.price||'')}</div>
      <div style="margin-top:8px;display:flex;gap:8px;justify-content:center">
        <a class="btn-small" href="${p.link||'#'}" target="_blank">Buy</a>
        <a class="btn-small" href="product.html?id=${p.id}" style="background:#fff;color:#ff3d8e;border:1px solid #ff3d8e">View</a>
      </div>`;
    if(p.category==='hoodies' && hoodies) hoodies.appendChild(card);
    else if(p.category==='shirts' && shirts) shirts.appendChild(card);
    else if((p.category==='pants'||p.category==='sweats') && pants) pants.appendChild(card);
    else if(shirts) shirts.appendChild(card);
  });
}

function toggleFavoriteFromCard(e,id){
  e.stopPropagation();
  getAllProducts().then(all=>{
    const p = all.find(x=>x.id===id); if(!p) return;
    let favs = JSON.parse(localStorage.getItem('favorites')||'[]');
    const idx = favs.indexOf(p.name);
    if(idx===-1){ favs.unshift(p.name); e.currentTarget.innerText='❤️'; }
    else{ favs.splice(idx,1); e.currentTarget.innerText='♡'; }
    localStorage.setItem('favorites', JSON.stringify(favs));
  });
}

function escapeHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') }

function updateProfileButtons(topBtnId='topProfileBtn', bottomBtnId='bottomProfileBtn'){
  const t=document.getElementById(topBtnId); const b=document.getElementById(bottomBtnId);
  const user=localStorage.getItem('userName');
  if(t) t.onclick=()=> user? location.href='profile.html':location.href='signin.html';
  if(b){
    if(user){ b.innerHTML=`<i class="fas fa-user"></i>${user}`; b.onclick=()=>location.href='profile.html'; }
    else{ b.innerHTML=`<i class="fas fa-user"></i>Profile`; b.onclick=()=>location.href='signin.html'; }
  }
}

function setupSearch(){
  const s=document.getElementById('searchInput'); if(!s) return;
  s.addEventListener('input', async ()=>{
    const q=s.value.toLowerCase();
    document.querySelectorAll('.card').forEach(card=>{
      const name=card.querySelector('h3')?.innerText.toLowerCase()||'';
      card.style.display=name.includes(q)?'':'none';
    });
  });
}

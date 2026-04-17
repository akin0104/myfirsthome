// ══════════════════════════════════════════════════════════════
//  MyFirstHome – script.js
//  Features: Add, Edit, Delete, Favourite, Search, Sort,
//            Image URL, Total Value, Success Message, localStorage
// ══════════════════════════════════════════════════════════════

// ── State 
const starterHomes = [
  { id: 1, name: "123 Rideau Street – Ottawa", price: 525000, note: "3 bed, 2 bath. Located in downtown Ottawa. Includes all furniture and appliances. Close to Parliament Hill.", imageUrl: "images/house1.jpg", favourite: false, dateAdded: "2026-04-01" },
  { id: 2, name: "456 King Street West – Toronto", price: 899000, note: "4 bed, 3 bath. Modern finishes in the heart of Toronto. Walking distance to CN Tower and transit.", imageUrl: "images/house2.jpg", favourite: false, dateAdded: "2026-04-02" },
  { id: 3, name: "789 Sainte-Catherine – Montreal", price: 475000, note: "2 bed, 1 bath. Charming stone exterior in Old Montreal. Fully furnished, move-in ready.", imageUrl: "images/house3.jpg", favourite: false, dateAdded: "2026-04-03" },
  { id: 4, name: "22 Portage Avenue – Winnipeg", price: 389000, note: "3 bed, 2 bath. Spacious backyard. Recently renovated kitchen. Great family neighbourhood.", imageUrl: "images/house4.jpg", favourite: false, dateAdded: "2026-04-04" },
  { id: 5, name: "88 Jasper Avenue – Edmonton", price: 445000, note: "3 bed, 2 bath. Corner lot with double garage. New roof 2024. Near top-rated schools.", imageUrl: "images/house5.jpg", favourite: false, dateAdded: "2026-04-05" },
  { id: 6, name: "310 Granville Street – Vancouver", price: 1250000, note: "4 bed, 3 bath. Stunning mountain views. Open-concept living. Steps from Stanley Park.", imageUrl: "images/house6.jpg", favourite: false, dateAdded: "2026-04-06" },
  { id: 7, name: "14 Spring Garden Road – Halifax", price: 349000, note: "2 bed, 1 bath. Cozy Cape Cod style home. Hardwood floors throughout. Near the waterfront.", imageUrl: "images/house7.jpg", favourite: false, dateAdded: "2026-04-07" },
  { id: 8, name: "55 Douglas Street – Victoria", price: 780000, note: "3 bed, 2 bath. Beautiful heritage home with modern upgrades. Lush garden. Near the Inner Harbour.", imageUrl: "images/house8.jpg", favourite: false, dateAdded: "2026-04-08" },
];

let properties = JSON.parse(localStorage.getItem('myfirsthome_properties'));
if (!properties || properties.length === 0) {
  properties = starterHomes;
  localStorage.setItem('myfirsthome_properties', JSON.stringify(properties));
}
let currentFilter = 'all';
let currentSort   = null; // 'asc' | 'desc' | null

// ── Fallback house images (used when no URL is provided) ───────
const fallbackImages = [
  'images/house1.jpg',
  'images/house2.jpg',
  'images/house3.jpg',
  'images/house4.jpg',
  'images/house5.jpg',
  'images/house6.jpg',
  'images/house7.jpg',
  'images/house8.jpg',
];

function getFallbackImage(id) {
  return fallbackImages[id % fallbackImages.length];
}

// ── Save to localStorage ───────────────────────────────────────
function saveToStorage() {
  localStorage.setItem('myfirsthome_properties', JSON.stringify(properties));
}

// ── Show success message ───────────────────────────────────────
function showSuccess() {
  const msg = document.getElementById('successMsg');
  msg.style.display = 'block';
  setTimeout(() => { msg.style.display = 'none'; }, 3000);
}

// ── Add a new property ─────────────────────────────────────────
function addProperty() {
  const name     = document.getElementById('propName').value.trim();
  const price    = document.getElementById('propPrice').value.trim();
  const note     = document.getElementById('propNote').value.trim();
  const imageUrl = document.getElementById('propImageUrl').value.trim();

  if (!name) {
    alert('Please enter a property name.');
    document.getElementById('propName').focus();
    return;
  }
  if (!price || isNaN(price) || Number(price) < 0) {
    alert('Please enter a valid price.');
    document.getElementById('propPrice').focus();
    return;
  }

  const property = {
    id:        Date.now(),
    name:      name,
    price:     Number(price),
    note:      note,
    imageUrl:  imageUrl,
    favourite: false,
    dateAdded: new Date().toLocaleDateString('en-CA')
  };

  properties.push(property);
  saveToStorage();

  // Clear form
  document.getElementById('propName').value     = '';
  document.getElementById('propPrice').value    = '';
  document.getElementById('propNote').value     = '';
  document.getElementById('propImageUrl').value = '';

  showSuccess();
  renderAll();
}

// ── Toggle favourite ───────────────────────────────────────────
function toggleFavourite(id) {
  const prop = properties.find(p => p.id === id);
  if (prop) {
    prop.favourite = !prop.favourite;
    saveToStorage();
    renderAll();
  }
}

// ── Delete a property ──────────────────────────────────────────
function deleteProperty(id) {
  if (!confirm('Are you sure you want to remove this property?')) return;
  properties = properties.filter(p => p.id !== id);
  saveToStorage();
  renderAll();
}

// ── Open edit modal ────────────────────────────────────────────
function openEdit(id) {
  const prop = properties.find(p => p.id === id);
  if (!prop) return;

  document.getElementById('editId').value       = prop.id;
  document.getElementById('editName').value     = prop.name;
  document.getElementById('editPrice').value    = prop.price;
  document.getElementById('editNote').value     = prop.note;
  document.getElementById('editImageUrl').value = prop.imageUrl || '';

  document.getElementById('modalOverlay').classList.add('open');
}

// ── Save edit ──────────────────────────────────────────────────
function saveEdit() {
  const id       = Number(document.getElementById('editId').value);
  const name     = document.getElementById('editName').value.trim();
  const price    = document.getElementById('editPrice').value.trim();
  const note     = document.getElementById('editNote').value.trim();
  const imageUrl = document.getElementById('editImageUrl').value.trim();

  if (!name) { alert('Please enter a property name.'); return; }
  if (!price || isNaN(price) || Number(price) < 0) { alert('Please enter a valid price.'); return; }

  const prop = properties.find(p => p.id === id);
  if (prop) {
    prop.name     = name;
    prop.price    = Number(price);
    prop.note     = note;
    prop.imageUrl = imageUrl;
    saveToStorage();
  }

  document.getElementById('modalOverlay').classList.remove('open');
  renderAll();
}

// ── Close modal if clicking outside ───────────────────────────
function closeModalOutside(event) {
  if (event.target.id === 'modalOverlay') {
    document.getElementById('modalOverlay').classList.remove('open');
  }
}

// ── Filter handler ─────────────────────────────────────────────
function filterProperties(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderCards();
}

// ── Sort handler ───────────────────────────────────────────────
function sortProperties(direction) {
  currentSort = direction;

  // Highlight active sort button
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active-sort'));
  event.target.classList.add('active-sort');

  renderCards();
}

// ── Format price as currency ───────────────────────────────────
function formatPrice(price) {
  return '$' + price.toLocaleString('en-CA');
}

// ── Escape HTML to prevent XSS ─────────────────────────────────
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

// ── Build a single card element ────────────────────────────────
function createCard(prop) {
  const card = document.createElement('div');
  card.className = 'card' + (prop.favourite ? ' favourite' : '');
  card.setAttribute('data-id', prop.id);

  // Image section
  let imgHTML = '';
  if (prop.imageUrl) {
    imgHTML = `<img class="card-img" src="${escapeHTML(prop.imageUrl)}" alt="Property image"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
               <div class="card-img-placeholder" style="display:none;">🏡</div>`;
  } else {
    imgHTML = `<div class="card-img-placeholder">🏡</div>`;
  }

  card.innerHTML = `
    ${imgHTML}
    <div class="card-body">
      <div class="card-header">
        <div class="card-name">${escapeHTML(prop.name)}</div>
        <span class="fav-badge">⭐</span>
      </div>
      <div class="card-price">${formatPrice(prop.price)}</div>
      <div class="card-note ${prop.note ? '' : 'no-note'}">
        ${prop.note ? escapeHTML(prop.note) : 'No notes added yet.'}
      </div>
      <div class="card-date">Added: ${prop.dateAdded}</div>
      <div class="card-actions">
        <button class="btn-fav"    onclick="toggleFavourite(${prop.id})">
          ${prop.favourite ? '★ Unfav' : '☆ Fav'}
        </button>
        <button class="btn-edit"   onclick="openEdit(${prop.id})">✏️ Edit</button>
        <button class="btn-delete" onclick="deleteProperty(${prop.id})">🗑 Delete</button>
      </div>
    </div>
  `;
  return card;
}

// ── Render cards with search + filter + sort ───────────────────
function renderCards() {
  const grid       = document.getElementById('cardsGrid');
  const emptyState = document.getElementById('emptyState');
  const searchTerm = document.getElementById('searchInput')
    ? document.getElementById('searchInput').value.toLowerCase().trim()
    : '';

  grid.innerHTML = '';

  // 1. Filter by favourite
  let filtered = currentFilter === 'favourites'
    ? properties.filter(p => p.favourite)
    : [...properties];

  // 2. Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(searchTerm) ||
      p.note.toLowerCase().includes(searchTerm)
    );
  }

  // 3. Sort
  if (currentSort === 'asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (currentSort === 'desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  // 4. Render
  if (filtered.length === 0) {
    emptyState.style.display = 'block';
    if (searchTerm) {
      emptyState.querySelector('p').textContent       = `No results for "${searchTerm}"`;
      emptyState.querySelector('.empty-sub').textContent = 'Try a different search term.';
    } else if (currentFilter === 'favourites') {
      emptyState.querySelector('p').textContent       = 'No favourite properties yet.';
      emptyState.querySelector('.empty-sub').textContent = 'Click ☆ Fav on a card to add it here.';
    } else {
      emptyState.querySelector('p').textContent       = 'No properties added yet.';
      emptyState.querySelector('.empty-sub').textContent = 'Fill in the form above to get started!';
    }
  } else {
    emptyState.style.display = 'none';
    filtered.forEach(prop => grid.appendChild(createCard(prop)));
  }
}

// ── Render summary bar ─────────────────────────────────────────
function renderSummary() {
  const summaryBar  = document.getElementById('summaryBar');
  const controlsBar = document.getElementById('controlsBar');

  if (properties.length === 0) {
    summaryBar.style.display  = 'none';
    controlsBar.style.display = 'none';
    return;
  }

  summaryBar.style.display  = 'flex';
  controlsBar.style.display = 'flex';

  const prices     = properties.map(p => p.price);
  const totalValue = prices.reduce((sum, p) => sum + p, 0);

  document.getElementById('totalCount').textContent  = properties.length;
  document.getElementById('favCount').textContent    = properties.filter(p => p.favourite).length;
  document.getElementById('lowestPrice').textContent = formatPrice(Math.min(...prices));
  document.getElementById('highestPrice').textContent= formatPrice(Math.max(...prices));
  document.getElementById('totalValue').textContent  = formatPrice(totalValue);
}

// ── Render everything ──────────────────────────────────────────
function renderAll() {
  renderSummary();
  renderCards();
}

// ── Enter key support in form fields ──────────────────────────
document.getElementById('propName').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('propPrice').focus();
});
document.getElementById('propPrice').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('propImageUrl').focus();
});

// ── Initial render ─────────────────────────────────────────────
renderAll();
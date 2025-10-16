// scripts/renderCards.js
import { fetchMedications } from './fetchData.js';
import { openModal } from './modal.js';

const cardsContainer = document.getElementById('cards-container');
const searchInput = document.getElementById('search');
const categorySelect = document.getElementById('category-select');

export async function initMedicationsPage() {
  try {
    const meds = await fetchMedications();
    // ensure we have an array
    if (!Array.isArray(meds)) throw new Error('Invalid medications data format');

    // populate category filter
    const categories = Array.from(new Set(meds.map(m => m.category))).sort();
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat;
      opt.textContent = cat;
      categorySelect.append(opt);
    });

    // render initial
    renderCards(meds);

    // search & filter handlers
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      const cat = categorySelect.value;
      const filtered = meds.filter(m => {
        const inName = m.name.toLowerCase().includes(q);
        const inCategory = m.category.toLowerCase().includes(q);
        const matchCat = cat ? m.category === cat : true;
        return (inName || inCategory) && matchCat;
      });
      renderCards(filtered);
    });

    categorySelect.addEventListener('change', () => {
      const q = searchInput.value.trim().toLowerCase();
      const cat = categorySelect.value;
      const filtered = meds.filter(m => {
        const inName = m.name.toLowerCase().includes(q);
        const inCategory = m.category.toLowerCase().includes(q);
        const matchCat = cat ? m.category === cat : true;
        return (inName || inCategory) && matchCat;
      });
      renderCards(filtered);
    });

  } catch (err) {
    cardsContainer.innerHTML = `<p class="muted">Failed to load medication data. Try reloading the page.</p>`;
  }
}

function renderCards(meds) {
  if (!cardsContainer) return;
  if (!meds || meds.length === 0) {
    cardsContainer.innerHTML = '<p class="muted">No medications found.</p>';
    return;
  }

  // must show at least 15 items — if less, still render what exists
  cardsContainer.innerHTML = meds.map(m => medToCardHTML(m)).join('');

  // attach click handlers for detail modal
  document.querySelectorAll('.med-card').forEach(el => {
    el.addEventListener('click', (e) => {
      const id = el.dataset.id;
      const med = meds.find(x => String(x.id) === String(id));
      if (med) openModal(med);
    });
  });
}

function medToCardHTML(m) {
  // template literal
  return `
    <article class="card med-card" data-id="${m.id}" tabindex="0" role="button" aria-pressed="false" aria-label="View ${escapeHtml(m.name)} details">
      <img src="${m.image}" alt="${escapeHtml(m.name)} image" class="thumb" loading="lazy">
      <div>
        <div class="meta">
          <h3>${escapeHtml(m.name)}</h3>
          <span class="tag">${escapeHtml(m.category)}</span>
        </div>
        <p class="small-muted"><strong>Dosage:</strong> ${escapeHtml(m.dosage)}</p>
        <p class="small-muted"><strong>Uses:</strong> ${escapeHtml(m.uses)}</p>
      </div>
    </article>
  `;
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}
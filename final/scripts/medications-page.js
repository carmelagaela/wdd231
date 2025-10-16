// scripts/medications-page.js
import { initMedicationsPage } from './renderCards.js';
import { initModal } from './modal.js';

document.addEventListener('DOMContentLoaded', () => {
  initModal(document.getElementById('modal-root'));
  initMedicationsPage();
});
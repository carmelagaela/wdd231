// scripts/formHandler.js
// Handles ask.html form: validation + saving to localStorage + redirect to confirmation action page

const form = document.getElementById('ask-form');
const feedback = document.getElementById('form-feedback');

if (form) {
  form.addEventListener('submit', (e) => {
    // default HTML form would navigate to ask-confirm.html; we allow that but also save to localStorage
    // gather values
    const name = (document.getElementById('name') || {}).value || '';
    const email = (document.getElementById('email') || {}).value || '';
    const medication = (document.getElementById('medication') || {}).value || '';
    const dosage = (document.getElementById('dosage') || {}).value || '';
    const message = (document.getElementById('message') || {}).value || '';

    // Basic client-side validation
    if (!medication.trim() || !message.trim()) {
      e.preventDefault();
      feedback.textContent = 'Please provide the medication name and your message.';
      feedback.style.color = 'crimson';
      return;
    }

    // Save submission to localStorage
    const stored = JSON.parse(localStorage.getItem('pharmacare_submissions') || '[]');
    const entry = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      medication: medication.trim(),
      dosage: dosage.trim(),
      message: message.trim(),
      savedAt: new Date().toISOString()
    };
    stored.unshift(entry);
    try {
      localStorage.setItem('pharmacare_submissions', JSON.stringify(stored));
      // let the form submit to action page
    } catch (err) {
      e.preventDefault();
      feedback.textContent = 'Unable to save submission locally. Please try again or enable local storage.';
      feedback.style.color = 'crimson';
    }
  });
}
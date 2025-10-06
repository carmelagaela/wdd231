// scripts/discover.js
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("discover-grid");
  const visitMessage = document.getElementById("visit-message");
  const visitText = document.getElementById("visit-text");
  const visitClose = document.getElementById("visit-close");
  const storageKey = "discover_last_visit";

  // LOCALSTORAGE: show appropriate visit message
  try {
    const prev = localStorage.getItem(storageKey);
    const now = Date.now();

    if (!prev) {
      visitText.textContent = "Welcome! Let us know if you have any questions.";
      visitMessage.style.display = "block";
    } else {
      const prevMs = parseInt(prev, 10);
      const diffMs = now - prevMs;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMs < 24 * 60 * 60 * 1000) {
        visitText.textContent = "Back so soon! Awesome!";
      } else {
        visitText.textContent = `You last visited ${diffDays} ${diffDays === 1 ? "day" : "days"} ago.`;
      }
      visitMessage.style.display = "block";
    }

    // store current visit time for next time
    localStorage.setItem(storageKey, now.toString());
  } catch (err) {
    // localStorage may be disabled - silently ignore
    console.warn("LocalStorage unavailable:", err);
  }

  if (visitClose) {
    visitClose.addEventListener("click", () => {
      visitMessage.style.display = "none";
    });
  }

  // fetch discover data and build cards
  async function loadDiscover() {
    try {
      const res = await fetch("data/discover.json");
      const items = await res.json();

      // map id letters to class names for grid-area (a..h)
      const idToClass = {
        "a":"area-a","b":"area-b","c":"area-c","d":"area-d",
        "e":"area-e","f":"area-f","g":"area-g","h":"area-h"
      };

      grid.innerHTML = "";

      items.forEach((item, idx) => {
        const card = document.createElement("article");
        card.className = `card ${idToClass[item.id] || ""}`;

        card.innerHTML = `
          <h2>${escapeHtml(item.title)}</h2>
          <figure>
            <img src="images/${item.image}" alt="${escapeHtml(item.title)} image" loading="lazy">
          </figure>
          <address>${escapeHtml(item.address)}</address>
          <p>${escapeHtml(item.description)}</p>
          <a class="learn-btn" href="#" data-id="${escapeHtml(item.id)}">Learn more</a>
        `;

        grid.appendChild(card);
      });

    } catch (err) {
      console.error("Unable to load discover data:", err);
      grid.innerHTML = "<p>Unable to load discover content at this time.</p>";
    }
  }

  loadDiscover();

  // small helper to avoid simple HTML injection in JSON content
  function escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
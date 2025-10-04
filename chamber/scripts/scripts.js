// Footer Year and Last Modified
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

// Directory Fetch
const directory = document.getElementById("directory");

async function getMembers() {
  try {
    const response = await fetch("data/members.json");
    const data = await response.json();
    displayMembers(data);
  } catch (error) {
    console.error("Error fetching members:", error);
    if (directory) {
      directory.innerHTML = "<p>Unable to load directory at this time.</p>";
    }
  }
}

function displayMembers(members) {
  if (!directory) return;
  directory.innerHTML = "";
  members.forEach((member) => {
    const card = document.createElement("section");
    card.classList.add("member-card");
    card.innerHTML = `
      <img src="images/${member.image}" alt="${member.name} logo" width="100" height="100" loading="lazy">
      <div class="member-info">
        <h3>${member.name}</h3>
        <p>${member.address}</p>
        <p>${member.phone}</p>
        <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
        <p class="level">Membership: ${getMembershipLevel(member.membership)}</p>
      </div>
    `;
    directory.appendChild(card);
  });
}

function getMembershipLevel(level) {
  switch (level) {
    case 1: return "Member";
    case 2: return "Silver";
    case 3: return "Gold";
    default: return "Member";
  }
}

// Toggle Views
const gridBtn = document.getElementById("gridBtn");
const listBtn = document.getElementById("listBtn");

if (gridBtn && listBtn && directory) {
  gridBtn.addEventListener("click", () => {
    directory.classList.add("grid-view");
    directory.classList.remove("list-view");
  });
  listBtn.addEventListener("click", () => {
    directory.classList.add("list-view");
    directory.classList.remove("grid-view");
  });
}

// Call members
if (directory) getMembers();


// ========== WEATHER API ==========
const weatherContainer = document.getElementById("current-weather");
const forecastContainer = document.getElementById("forecast");

const apiKey = "a4da5fcf3901761ad0c870615285c9f6";
const city = "Lucban";
const units = "metric";

async function fetchWeather() {
  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city},PH&units=${units}&appid=${apiKey}`);
    const data = await response.json();

    // Current Weather
    const current = data.list[0];
    const temp = Math.round(current.main.temp);
    const desc = current.weather[0].description;
    if (weatherContainer) {
      weatherContainer.textContent = `Now: ${temp}°C, ${desc}`;
    }

    // Forecast (next 3 days, one per day at noon)
    if (forecastContainer) {
      forecastContainer.innerHTML = "";
      for (let i = 8; i <= 24; i += 8) {
        const day = data.list[i];
        const date = new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" });
        const ftemp = Math.round(day.main.temp);
        forecastContainer.innerHTML += `<div><strong>${date}</strong><br>${ftemp}°C</div>`;
      }
    }
  } catch (error) {
    console.error("Weather fetch error:", error);
    if (weatherContainer) {
      weatherContainer.textContent = "Unable to load weather.";
    }
  }
}
fetchWeather();


// ========== SPOTLIGHTS ==========
const spotlightContainer = document.getElementById("spotlight-container");

async function loadSpotlights() {
  try {
    const response = await fetch("data/members.json");
    const members = await response.json();

    // Filter Silver & Gold
    const filtered = members.filter(m => m.membership === 2 || m.membership === 3);

    // Pick 2 or 3 random
    const shuffled = filtered.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 3);

    // Display
    if (spotlightContainer) {
      spotlightContainer.innerHTML = "";
      selected.forEach(member => {
        const card = document.createElement("div");
        card.classList.add("spotlight-card");
        card.innerHTML = `
          <img src="images/${member.image}" alt="${member.name}">
          <h3>${member.name}</h3>
          <p>${member.address}</p>
          <p>${member.phone}</p>
          <a href="${member.website}" target="_blank">Visit Website</a>
          <p><em>${getMembershipLevel(member.membership)}</em></p>
        `;
        spotlightContainer.appendChild(card);
      });
    }
  } catch (error) {
    console.error("Spotlights error:", error);
  }
}
if (spotlightContainer) loadSpotlights();


// Auto-fill timestamp when join.html loads
const tsField = document.getElementById("timestamp");
if (tsField) {
  tsField.value = new Date().toLocaleString();
}

// Membership Modals
const modalLinks = document.querySelectorAll("[data-modal]");
modalLinks.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const modalId = link.getAttribute("data-modal");
    document.getElementById(modalId).style.display = "block";
  });
});

const closeButtons = document.querySelectorAll(".modal .close");
closeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.closest(".modal").style.display = "none";
  });
});

window.addEventListener("click", e => {
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
});
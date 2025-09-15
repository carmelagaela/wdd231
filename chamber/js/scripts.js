// Footer Year and Last Modified
document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = document.lastModified;

// Directory Fetch
const directory = document.getElementById("directory");

async function getMembers() {
  const response = await fetch("data/members.json");
  const data = await response.json();
  displayMembers(data);
}

function displayMembers(members) {
  directory.innerHTML = "";

  members.forEach((member) => {
    const card = document.createElement("section");
    card.classList.add("member-card");

    card.innerHTML = `
      <img src="images/${member.image}" alt="${member.name} logo" loading="lazy">
      <h3>${member.name}</h3>
      <p>${member.address}</p>
      <p>${member.phone}</p>
      <a href="${member.website}" target="_blank">Visit Website</a>
      <p class="level">Membership: ${getMembershipLevel(member.membership)}</p>
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
document.getElementById("gridBtn").addEventListener("click", () => {
  directory.classList.add("grid-view");
  directory.classList.remove("list-view");
});

document.getElementById("listBtn").addEventListener("click", () => {
  directory.classList.add("list-view");
  directory.classList.remove("grid-view");
});

getMembers();
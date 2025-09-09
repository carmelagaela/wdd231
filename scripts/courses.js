const courses = [
  { code: "WDD130", name: "Web Fundamentals", credits: 2, completed: true, category: "WDD" },
  { code: "WDD131", name: "Dynamic Web Fundamentals", credits: 2, completed: true, category: "WDD" },
  { code: "CSE110", name: "Programming Basics", credits: 2, completed: false, category: "CSE" },
  { code: "CSE111", name: "Programming with Functions", credits: 2, completed: false, category: "CSE" },
  { code: "WDD231", name: "Frontend Development I", credits: 2, completed: false, category: "WDD" }
];

const courseContainer = document.getElementById("courseContainer");
const totalCredits = document.getElementById("totalCredits");

function displayCourses(filteredCourses) {
  courseContainer.innerHTML = "";
  let total = 0;

  filteredCourses.forEach(course => {
    const div = document.createElement("div");
    div.className = "course-card";
    if (course.completed) div.classList.add("completed");
    div.innerHTML = `<h3>${course.code}</h3><p>${course.name}</p><p>Credits: ${course.credits}</p>`;
    courseContainer.appendChild(div);
    total += course.credits;
  });

  totalCredits.textContent = total;
}

document.getElementById("all").addEventListener("click", () => displayCourses(courses));
document.getElementById("wdd").addEventListener("click", () => displayCourses(courses.filter(c => c.category === "WDD")));
document.getElementById("cse").addEventListener("click", () => displayCourses(courses.filter(c => c.category === "CSE")));

// Default load
displayCourses(courses);
console.log("Script loaded ✅");

let subjects = JSON.parse(localStorage.getItem("subjects")) || [];
console.log("Loaded subjects from storage:", subjects);

function saveData() {
  localStorage.setItem("subjects", JSON.stringify(subjects));
  console.log("Data saved:", subjects);
}

function addSubject() {
  const input = document.getElementById("subjectInput");
  const name = input.value.trim();
  console.log("Trying to add subject:", name);

  if (!name) {
    alert("Please enter a subject name!");
    return;
  }

  // Prevent duplicates
  if (subjects.find(s => s.name.toLowerCase() === name.toLowerCase())) {
    alert("Subject already exists!");
    return;
  }

  subjects.push({ name, records: {} });
  console.log("Subject added:", name);
  saveData();
  input.value = "";
  renderSubjects();
}

function toggleAttendance(subjectName, date) {
  subjects = subjects.map(s => {
    if (s.name === subjectName) {
      if (s.records[date] === "present") {
        s.records[date] = "absent";
      } else if (s.records[date] === "absent") {
        delete s.records[date];
      } else {
        s.records[date] = "present";
      }
    }
    return s;
  });
  saveData();
  renderSubjects();
}

function getPercentage(records) {
  const total = Object.keys(records).length;
  const present = Object.values(records).filter(r => r === "present").length;
  return total > 0 ? ((present / total) * 100).toFixed(1) : 0;
}

function renderCalendar(subject) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let daysHTML = "";
  const startDay = firstDay.getDay();
  for (let i = 0; i < startDay; i++) {
    daysHTML += `<div class="day other-month"></div>`;
  }

  for (let date = 1; date <= lastDay.getDate(); date++) {
    const fullDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    let statusClass = "";
    if (subject.records[fullDate] === "present") statusClass = "present";
    if (subject.records[fullDate] === "absent") statusClass = "absent";

    daysHTML += `<div class="day ${statusClass}" onclick="toggleAttendance('${subject.name}', '${fullDate}')">${date}</div>`;
  }

  return `<div class="calendar">${daysHTML}</div>`;
}

function renderSubjects() {
  const container = document.getElementById("subjectsList");
  container.innerHTML = "";
  subjects.forEach(s => {
    container.innerHTML += `
      <div class="bg-white p-4 rounded shadow">
        <h3 class="text-xl font-semibold mb-2">${s.name}</h3>
        <p class="mb-2 text-gray-700">Attendance: ${getPercentage(s.records)}%</p>
        ${renderCalendar(s)}
      </div>
    `;
  });
}

renderSubjects();

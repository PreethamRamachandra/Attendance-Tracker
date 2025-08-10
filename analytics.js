// --- PART 1: ATTENDANCE CHART ---
function renderAttendanceChart() {
    const subjects = JSON.parse(localStorage.getItem('subjects')) || [];
    const ctx = document.getElementById('attendanceChart').getContext('2d');

    if (subjects.length === 0) {
        ctx.font = "16px Segoe UI";
        ctx.fillStyle = "#aaa";
        ctx.textAlign = "center";
        ctx.fillText("No subject data to display. Add subjects on the Tracker page.", ctx.canvas.width / 2, 50);
        return;
    }

    const labels = subjects.map(s => s.name);
    const dataPoints = subjects.map(s => {
        const presentCount = s.history.filter(h => h.status === 'present').length;
        const totalCount = s.history.length;
        return totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
    });

    const goal = parseInt(localStorage.getItem('attendanceGoal')) || 75;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Attendance %',
                data: dataPoints,
                backgroundColor: dataPoints.map(p => p >= goal ? 'rgba(40, 167, 69, 0.7)' : 'rgba(255, 193, 7, 0.7)'),
                borderColor: dataPoints.map(p => p >= goal ? 'rgba(40, 167, 69, 1)' : 'rgba(255, 193, 7, 1)'),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#fff' }
                },
                x: {
                    ticks: { color: '#fff' }
                }
            },
            plugins: {
                legend: {
                    labels: { color: '#fff' }
                }
            }
        }
    });
}


// --- PART 2: EDITABLE TIMETABLE ---
const timetableBody = document.getElementById('timetable').getElementsByTagName('tbody')[0];
const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const alertModal = document.getElementById('alertModal');
const alertOkBtn = document.getElementById('alertOkBtn');

const defaultTimeSlots = ["9-10 AM", "10-11 AM", "11-12 PM", "12-1 PM", "1-2 PM", "2-3 PM"];
let timeSlots = JSON.parse(localStorage.getItem('timeSlotsData')) || defaultTimeSlots;
let scheduleData = JSON.parse(localStorage.getItem('scheduleData')) || {};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function setTableEditable(isEditable) {
    const cells = timetableBody.getElementsByTagName('td');
    for (const cell of cells) {
        cell.contentEditable = isEditable;
        if (isEditable) {
            cell.classList.add('editable-cell');
        } else {
            cell.classList.remove('editable-cell');
        }
    }
    editBtn.classList.toggle('hidden', isEditable);
    saveBtn.classList.toggle('hidden', !isEditable);
}

function saveTimetable() {
    const newTimeSlots = [];
    const newScheduleData = {};
    const rows = timetableBody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const cells = rows[i].getElementsByTagName('td');
        // Save the time slot (first cell)
        newTimeSlots.push(cells[0].textContent.trim());
        // Save the schedule data for the rest of the cells
        for (let j = 1; j < cells.length; j++) {
            const key = `${i}-${j-1}`; // Key is based on row/column index
            newScheduleData[key] = cells[j].textContent.trim();
        }
    }
    
    timeSlots = newTimeSlots;
    scheduleData = newScheduleData;
    localStorage.setItem('timeSlotsData', JSON.stringify(timeSlots));
    localStorage.setItem('scheduleData', JSON.stringify(scheduleData));
    
    alertModal.classList.remove('hidden');
}

function renderTimetable() {
    timetableBody.innerHTML = '';
    timeSlots.forEach((time, rowIndex) => {
        const row = timetableBody.insertRow();
        const timeCell = row.insertCell();
        timeCell.textContent = time;

        days.forEach((day, colIndex) => {
            const cell = row.insertCell();
            const key = `${rowIndex}-${colIndex}`;
            cell.textContent = scheduleData[key] || '';
        });
    });
}

// Event listeners for Edit/Save/OK buttons
editBtn.addEventListener('click', () => setTableEditable(true));

saveBtn.addEventListener('click', () => {
    setTableEditable(false);
    saveTimetable();
});

alertOkBtn.addEventListener('click', () => alertModal.classList.add('hidden'));

alertModal.addEventListener('click', (event) => {
    if (event.target === alertModal) {
        alertModal.classList.add('hidden');
    }
});


// --- INITIALIZE THE PAGE ---
// This code runs when the page loads
renderAttendanceChart();
renderTimetable();
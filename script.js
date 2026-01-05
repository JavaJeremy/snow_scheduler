// Data structure
let data = {
    people: [],
    currentIndex: 0,
    history: []
};

// Load data from localStorage
function loadData() {
    const saved = localStorage.getItem('snowSchedulerData');
    if (saved) {
        try {
            data = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }
}

// Save data to localStorage
function saveData() {
    localStorage.setItem('snowSchedulerData', JSON.stringify(data));
}

// Initialize
loadData();

// DOM elements
const currentPersonEl = document.getElementById('current-person');
const markDoneBtn = document.getElementById('mark-done-btn');
const skipCurrentBtn = document.getElementById('skip-current-btn');
const newPersonInput = document.getElementById('new-person-input');
const addPersonBtn = document.getElementById('add-person-btn');
const peopleListEl = document.getElementById('people-list');
const historyListEl = document.getElementById('history-list');

// Update current person display
function updateCurrentPerson() {
    if (data.people.length === 0) {
        currentPersonEl.querySelector('.person-name').textContent = '-';
        markDoneBtn.disabled = true;
        skipCurrentBtn.disabled = true;
        return;
    }

    const currentPerson = data.people[data.currentIndex];
    currentPersonEl.querySelector('.person-name').textContent = currentPerson;
    markDoneBtn.disabled = false;
    skipCurrentBtn.disabled = false;
}

// Render people list
function renderPeopleList() {
    peopleListEl.innerHTML = '';

    if (data.people.length === 0) {
        peopleListEl.innerHTML = '<li class="empty-state">Noch keine Personen hinzugefügt</li>';
        return;
    }

    data.people.forEach((person, index) => {
        const li = document.createElement('li');
        const isCurrent = index === data.currentIndex;

        li.innerHTML = `
            <div class="person-item ${isCurrent ? 'current' : ''}">
                <span class="turn-indicator"></span>
                <span>${person}</span>
            </div>
            <button class="delete-btn" data-index="${index}">Löschen</button>
        `;

        // Delete button handler
        li.querySelector('.delete-btn').addEventListener('click', () => {
            deletePerson(index);
        });

        peopleListEl.appendChild(li);
    });
}

// Render history
function renderHistory() {
    historyListEl.innerHTML = '';

    if (data.history.length === 0) {
        historyListEl.innerHTML = '<li class="empty-state">Noch keine Einträge</li>';
        return;
    }

    // Show last 10 entries
    const recentHistory = data.history.slice(-10).reverse();

    recentHistory.forEach(entry => {
        const li = document.createElement('li');
        const date = new Date(entry.timestamp);
        const dateStr = date.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        li.textContent = `${entry.person} - ${dateStr}`;
        historyListEl.appendChild(li);
    });
}

// Add person
function addPerson() {
    const name = newPersonInput.value.trim();
    if (name === '') {
        return;
    }

    if (data.people.includes(name)) {
        alert('Diese Person existiert bereits!');
        return;
    }

    data.people.push(name);
    newPersonInput.value = '';
    saveData();
    renderPeopleList();
    updateCurrentPerson();
}

// Delete person
function deletePerson(index) {
    if (data.people.length <= 1) {
        alert('Es muss mindestens eine Person vorhanden sein!');
        return;
    }

    // Adjust current index if necessary
    if (index < data.currentIndex) {
        data.currentIndex--;
    } else if (index === data.currentIndex && data.currentIndex >= data.people.length - 1) {
        data.currentIndex = 0;
    }

    data.people.splice(index, 1);
    saveData();
    renderPeopleList();
    updateCurrentPerson();
}

// Mark as done
function markAsDone() {
    if (data.people.length === 0) {
        return;
    }

    const currentPerson = data.people[data.currentIndex];
    const timestamp = new Date().toISOString();

    // Add to history
    data.history.push({
        person: currentPerson,
        timestamp: timestamp
    });

    // Move to next person
    data.currentIndex = (data.currentIndex + 1) % data.people.length;

    saveData();
    updateCurrentPerson();
    renderHistory();

    // Show confirmation
    markDoneBtn.textContent = '✓ Erledigt!';
    setTimeout(() => {
        markDoneBtn.textContent = 'Ich habe geschippt ✓';
    }, 2000);
}

// Skip current person (backup)
function skipCurrent() {
    if (data.people.length === 0) {
        return;
    }

    // Just move to next person without adding to history
    data.currentIndex = (data.currentIndex + 1) % data.people.length;

    saveData();
    updateCurrentPerson();
}

// Event listeners
addPersonBtn.addEventListener('click', addPerson);

newPersonInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addPerson();
    }
});

markDoneBtn.addEventListener('click', markAsDone);
skipCurrentBtn.addEventListener('click', skipCurrent);

// Initial render
renderPeopleList();
updateCurrentPerson();
renderHistory();


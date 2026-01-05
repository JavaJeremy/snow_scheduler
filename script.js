// Data structure
let data = {
    people: [],
    currentIndex: 0,
    history: []
};

// Firebase/Firestore setup
let db = null;
let auth = null;
let isUsingFirebase = false;
let syncStatusEl = null;

// Authenticate with Firebase (Anonymous Authentication)
async function authenticateUser() {
    if (!auth) return false;
    
    try {
        // Check if user is already signed in
        const currentUser = auth.currentUser;
        if (currentUser) {
            console.log('User already authenticated:', currentUser.uid);
            return true;
        }
        
        // Sign in anonymously
        const userCredential = await auth.signInAnonymously();
        console.log('Anonymous authentication successful:', userCredential.user.uid);
        return true;
    } catch (error) {
        console.error('Authentication error:', error);
        updateSyncStatus('error', 'Authentifizierung fehlgeschlagen');
        return false;
    }
}

// Initialize Firebase if configured
async function initFirebase() {
    if (typeof FIREBASE_CONFIG !== 'undefined' && USE_FIREBASE && FIREBASE_CONFIG.apiKey) {
        try {
            firebase.initializeApp(FIREBASE_CONFIG);
            auth = firebase.auth();
            db = firebase.firestore();
            
            // Authenticate user (anonymous)
            const authSuccess = await authenticateUser();
            if (authSuccess) {
                isUsingFirebase = true;
                updateSyncStatus('connected', 'Mit Cloud verbunden');
                console.log('Firebase initialized successfully');
                return true;
            } else {
                updateSyncStatus('error', 'Authentifizierung fehlgeschlagen');
                return false;
            }
        } catch (e) {
            console.error('Firebase initialization error:', e);
            updateSyncStatus('error', 'Cloud-Verbindung fehlgeschlagen');
            return false;
        }
    }
    updateSyncStatus('local', 'Nur lokal gespeichert');
    return false;
}

// Update sync status indicator
function updateSyncStatus(status, message) {
    if (!syncStatusEl) {
        syncStatusEl = document.getElementById('sync-status');
    }
    if (!syncStatusEl) return;
    
    syncStatusEl.className = `sync-status sync-${status}`;
    syncStatusEl.textContent = message;
}

// Load data from Firebase or localStorage
async function loadData() {
    if (isUsingFirebase && db && auth && auth.currentUser) {
        try {
            const doc = await db.collection(COLLECTION_NAME).doc(DOCUMENT_ID).get();
            if (doc.exists) {
                data = doc.data();
                updateSyncStatus('connected', 'Mit Cloud verbunden');
            } else {
                // No data in Firestore, try localStorage as fallback
                loadFromLocalStorage();
                // Save to Firestore if we have local data
                if (data.people.length > 0 || data.history.length > 0) {
                    await saveData();
                }
            }
        } catch (e) {
            console.error('Error loading from Firebase:', e);
            updateSyncStatus('error', 'Fehler beim Laden');
            // Fallback to localStorage
            loadFromLocalStorage();
        }
    } else {
        loadFromLocalStorage();
    }
}

// Load from localStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('snowSchedulerData');
    if (saved) {
        try {
            data = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading data:', e);
        }
    }
}

// Save data to Firebase and/or localStorage
async function saveData() {
    // Always save to localStorage as backup
    localStorage.setItem('snowSchedulerData', JSON.stringify(data));
    
    // Also save to Firebase if enabled and authenticated
    if (isUsingFirebase && db && auth && auth.currentUser) {
        try {
            await db.collection(COLLECTION_NAME).doc(DOCUMENT_ID).set(data);
            updateSyncStatus('connected', 'Mit Cloud verbunden');
        } catch (e) {
            console.error('Error saving to Firebase:', e);
            updateSyncStatus('error', 'Fehler beim Speichern');
        }
    }
}

// Setup real-time listener for Firebase
function setupRealtimeListener() {
    if (isUsingFirebase && db && auth && auth.currentUser) {
        db.collection(COLLECTION_NAME).doc(DOCUMENT_ID)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const newData = doc.data();
                    // Only update if data actually changed (avoid infinite loops)
                    if (JSON.stringify(newData) !== JSON.stringify(data)) {
                        data = newData;
                        renderPeopleList();
                        updateCurrentPerson();
                        renderHistory();
                        renderStatistics();
                        updateSyncStatus('connected', 'Mit Cloud verbunden');
                    }
                }
            }, (error) => {
                console.error('Firebase listener error:', error);
                updateSyncStatus('error', 'Sync-Fehler');
            });
    }
}

// Initialize Firebase, authenticate, load data and render
(async function init() {
    await initFirebase();
    await loadData();
    // Initial render after data is loaded
    renderPeopleList();
    updateCurrentPerson();
    renderHistory();
    renderStatistics();
    // Setup real-time sync
    setupRealtimeListener();
})();

// DOM elements
const currentPersonEl = document.getElementById('current-person');
const markDoneBtn = document.getElementById('mark-done-btn');
const skipCurrentBtn = document.getElementById('skip-current-btn');
const newPersonInput = document.getElementById('new-person-input');
const addPersonBtn = document.getElementById('add-person-btn');
const peopleListEl = document.getElementById('people-list');
const historyListEl = document.getElementById('history-list');
const statisticsContent = document.getElementById('statistics-content');
const toggleAddPersonBtn = document.getElementById('toggle-add-person');
const addPersonContainer = document.getElementById('add-person-container');
const toggleSettingsBtn = document.getElementById('toggle-settings');
const settingsContainer = document.getElementById('settings-container');
const clearDataBtn = document.getElementById('clear-data-btn');

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

// Calculate statistics
function calculateStatistics() {
    const stats = {};
    
    // Count occurrences for each person
    data.history.forEach(entry => {
        if (!stats[entry.person]) {
            stats[entry.person] = 0;
        }
        stats[entry.person]++;
    });

    // Also include people who haven't done it yet (0 times)
    data.people.forEach(person => {
        if (!stats[person]) {
            stats[person] = 0;
        }
    });

    return stats;
}

// Render statistics
function renderStatistics() {
    statisticsContent.innerHTML = '';

    if (data.history.length === 0 && data.people.length === 0) {
        statisticsContent.innerHTML = '<div class="empty-state">Noch keine Daten</div>';
        return;
    }

    const stats = calculateStatistics();
    const totalShovels = data.history.length;

    // Sort by count (descending), then by name
    const sortedStats = Object.entries(stats)
        .sort((a, b) => {
            if (b[1] !== a[1]) return b[1] - a[1];
            return a[0].localeCompare(b[0]);
        });

    if (sortedStats.length === 0) {
        statisticsContent.innerHTML = '<div class="empty-state">Noch keine Daten</div>';
        return;
    }

    sortedStats.forEach(([person, count]) => {
        const statItem = document.createElement('div');
        statItem.className = 'stat-item';

        const percentage = totalShovels > 0 ? Math.round((count / totalShovels) * 100) : 0;
        const barWidth = totalShovels > 0 ? (count / Math.max(...Object.values(stats))) * 100 : 0;

        statItem.innerHTML = `
            <div class="stat-person">
                <span class="stat-name">${person}</span>
                <span class="stat-count">${count}x</span>
            </div>
            <div class="stat-bar-container">
                <div class="stat-bar" style="width: ${barWidth}%"></div>
            </div>
            <div class="stat-percentage">${percentage}%</div>
        `;

        statisticsContent.appendChild(statItem);
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
    renderStatistics();
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
    renderStatistics();
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
    renderStatistics();

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

// Clear all data
function clearAllData() {
    const confirmed = confirm('⚠️ WARNUNG: Möchten Sie wirklich alle Daten löschen?\n\nDies schließt ein:\n- Alle Personen\n- Die gesamte Historie\n- Die Statistik\n\nDiese Aktion kann nicht rückgängig gemacht werden!');
    
    if (confirmed) {
        // Double confirmation
        const doubleConfirm = confirm('Letzte Bestätigung: Sind Sie sicher, dass Sie ALLE Daten unwiderruflich löschen möchten?');
        
        if (doubleConfirm) {
            data = {
                people: [],
                currentIndex: 0,
                history: []
            };
            saveData();
            renderPeopleList();
            updateCurrentPerson();
            renderHistory();
            renderStatistics();
            
            // Close settings after clearing
            settingsContainer.classList.add('collapsed');
            const icon = toggleSettingsBtn.querySelector('.toggle-icon');
            icon.textContent = '+';
        }
    }
}

// Toggle add person section
toggleAddPersonBtn.addEventListener('click', () => {
    addPersonContainer.classList.toggle('collapsed');
    const icon = toggleAddPersonBtn.querySelector('.toggle-icon');
    icon.textContent = addPersonContainer.classList.contains('collapsed') ? '+' : '−';
});

// Toggle settings section
toggleSettingsBtn.addEventListener('click', () => {
    settingsContainer.classList.toggle('collapsed');
    const icon = toggleSettingsBtn.querySelector('.toggle-icon');
    icon.textContent = settingsContainer.classList.contains('collapsed') ? '+' : '−';
});

// Event listeners
addPersonBtn.addEventListener('click', addPerson);

newPersonInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addPerson();
    }
});

markDoneBtn.addEventListener('click', markAsDone);
skipCurrentBtn.addEventListener('click', skipCurrent);
clearDataBtn.addEventListener('click', clearAllData);

// Initial render (will be called after loadData completes)
// renderPeopleList();
// updateCurrentPerson();
// renderHistory();
// renderStatistics();


const defaultHabits = [
    "2 litres of water",
    "Eat regular, balanced meals",
    "10,000 steps",
    "30 mins workout",
    "3 hours focused study",
    "10 mins skin care"
];

let habits = JSON.parse(localStorage.getItem("habits")) || defaultHabits;
let completedDays = JSON.parse(localStorage.getItem("completedDays")) || {};
let completedToday = JSON.parse(localStorage.getItem("completedToday")) || [];
let calendarDate = new Date();

const habitContainer = document.getElementById("habits");
const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");
const date = document.getElementById("date");

const modal = document.getElementById("habitModal");
const calendarModal = document.getElementById("calendarModal");
const celebration = document.getElementById("celebration");

date.textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
});

function getTodayKey() {
    const today = new Date();

    return today.getFullYear() + "-" +
        String(today.getMonth() + 1).padStart(2, "0") + "-" +
        String(today.getDate()).padStart(2, "0");
}

function saveData() {
    localStorage.setItem("habits", JSON.stringify(habits));
    localStorage.setItem("completedDays", JSON.stringify(completedDays));
    localStorage.setItem("completedToday", JSON.stringify(completedToday));
}

function displayHabits() {
    habitContainer.innerHTML = "";

    habits.forEach(function(habit, index) {

        const habitDiv = document.createElement("div");
        habitDiv.className = "habit";

        const name = document.createElement("span");
        name.className = "habit-name";
        name.textContent = habit;

        const buttons = document.createElement("div");
        buttons.className = "habit-buttons";

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "🗑";
        deleteButton.title = "Delete habit";

        deleteButton.onclick = function() {
            habits.splice(index, 1);

            completedToday = completedToday.filter(function(item) {
                return item !== index;
            });

            saveData();
            displayHabits();
            updateProgress();
            updateStreak();
        };

        const checkButton = document.createElement("button");
        checkButton.className = "check-button";

        if (completedToday.includes(index)) {
            checkButton.classList.add("completed");
            checkButton.textContent = "✓";
        }

        checkButton.onclick = function() {
            if (completedToday.includes(index)) {
                completedToday = completedToday.filter(function(item) {
                    return item !== index;
                });
            } else {
                completedToday.push(index);
            }

            saveData();
            displayHabits();
            updateProgress();
            checkIfAllComplete();
        };

        buttons.appendChild(deleteButton);
        buttons.appendChild(checkButton);

        habitDiv.appendChild(name);
        habitDiv.appendChild(buttons);

        habitContainer.appendChild(habitDiv);
    });
}

function updateProgress() {
    if (habits.length === 0) {
        progress.style.width = "0%";
        progressText.textContent = "0% completed";
        return;
    }

    const percentage = Math.round(
        (completedToday.length / habits.length) * 100
    );

    progress.style.width = percentage + "%";
    progressText.textContent = percentage + "% completed";
}

function isTodayComplete() {
    return habits.length > 0 && completedToday.length === habits.length;
}

const celebrationMessages = [
    "YOU ARE DA GOAT 🐐",
    "yipeeyipeeeyipeeeyipeee 🎉",
    "Damn?! In ONE day? Way to go.",
    "Okayyy productivity final boss 😭🏆",
    "Look at you being all responsible and stuff.",
    "Main character behavior detected ✨",
    "The habits are HABITING today.",
    "No crumbs. You absolutely ate. 💅",
    "POV: you actually did what you said you would.",
    "Certified locked-in moment 🔒✨"
];

function showRandomCelebrationMessage() {
    const message = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
    document.getElementById("celebrationMessage").textContent = message;
}

function checkIfAllComplete() {
    if (isTodayComplete()) {
        showRandomCelebrationMessage();
        const today = getTodayKey();

        completedDays[today] = true;
        saveData();
        updateStreak();

        celebration.classList.remove("hidden");
        playYippee();
    } else {
        completedDays[getTodayKey()] = false;
        saveData();
        updateStreak();
    }
}

function playYippee() {
    const audio = document.getElementById("yippeeAudio");

    if (audio) {
        audio.currentTime = 0;
        audio.play().catch(function(error) {
            console.log("Audio could not play:", error);
        });
    }
}

function getDateKeyFromDate(dateObject) {
    return dateObject.getFullYear() + "-" +
        String(dateObject.getMonth() + 1).padStart(2, "0") + "-" +
        String(dateObject.getDate()).padStart(2, "0");
}

function updateStreak() {
    let streak = 0;
    let checkingDate = new Date();

    while (true) {
        const key = getDateKeyFromDate(checkingDate);

        if (completedDays[key]) {
            streak++;
            checkingDate.setDate(checkingDate.getDate() - 1);
        } else {
            break;
        }
    }

    let best = 0;
    let current = 0;

    const keys = Object.keys(completedDays).sort();

    for (let i = 0; i < keys.length; i++) {
        if (completedDays[keys[i]]) {
            current++;
            best = Math.max(best, current);
        } else {
            current = 0;
        }
    }

    document.getElementById("streak").textContent =
        streak + (streak === 1 ? " day" : " days");

    document.getElementById("bestStreak").textContent =
        best + (best === 1 ? " day" : " days");
}

/* Add habit */

document.getElementById("addHabitButton").onclick = function() {
    modal.classList.remove("hidden");
    document.getElementById("habitInput").focus();
};

document.getElementById("closeModal").onclick = function() {
    modal.classList.add("hidden");
};

document.getElementById("saveHabit").onclick = function() {
    const input = document.getElementById("habitInput");
    const newHabit = input.value.trim();

    if (newHabit !== "") {
        habits.push(newHabit);
        input.value = "";

        saveData();
        displayHabits();
        updateProgress();

        modal.classList.add("hidden");
    }
};

/* Calendar */

document.getElementById("calendarButton").onclick = function() {
    calendarModal.classList.remove("hidden");
    displayCalendar();
};

document.getElementById("closeCalendar").onclick = function() {
    calendarModal.classList.add("hidden");
};

document.getElementById("previousMonth").onclick = function() {
    calendarDate.setMonth(calendarDate.getMonth() - 1);
    displayCalendar();
};

document.getElementById("nextMonth").onclick = function() {
    calendarDate.setMonth(calendarDate.getMonth() + 1);
    displayCalendar();
};

function displayCalendar() {
    const calendarDays = document.getElementById("calendarDays");
    const monthTitle = document.getElementById("calendarMonth");

    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    monthTitle.textContent = calendarDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric"
    });

    calendarDays.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        const blank = document.createElement("div");
        calendarDays.appendChild(blank);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayBox = document.createElement("div");
        dayBox.className = "calendar-day";

        const thisDate = new Date(year, month, day);
        const key = getDateKeyFromDate(thisDate);

        dayBox.textContent = day;

        if (completedDays[key]) {
            dayBox.classList.add("complete");
            dayBox.textContent = day + " ♡";
        }

        if (key === getTodayKey()) {
            dayBox.classList.add("today");
        }

        calendarDays.appendChild(dayBox);
    }
}

/* Celebration buttons */

document.getElementById("yippeeButton").onclick = function() {
    playYippee();
};

document.getElementById("closeCelebration").onclick = function() {
    celebration.classList.add("hidden");
};

displayHabits();
updateProgress();
updateStreak();

/* ==================================== */
/* CONFIGURATIE */
/* ==================================== */

const defaultExercises = [
    "Chest Press",
    "Low Row",
    "Shoulder Press",
    "Lat Machine",
    "Pectoral",
    "Leg Press",
    "Leg Extension",
    "Leg Curl"
];

/* ==================================== */
/* LOCAL STORAGE */
/* ==================================== */

function getExercises() {

    return JSON.parse(
        localStorage.getItem("kissExercises")
    ) || defaultExercises;

}

function saveExercises(exercises) {

    localStorage.setItem(
        "kissExercises",
        JSON.stringify(exercises)
    );

}

function getData() {
    return JSON.parse(localStorage.getItem("kissFitnessLog")) || [];
}

function saveData(data) {
    localStorage.setItem("kissFitnessLog", JSON.stringify(data));
}

/* ==================================== */
/* HTML ELEMENTEN */
/* ==================================== */

const exerciseSelect = document.getElementById("exercise");
const weightInput = document.getElementById("weight");
const repsInput = document.getElementById("reps");
const durationInput =
    document.getElementById("duration");
const levelInput =
    document.getElementById("level");

const distanceInput =
    document.getElementById("distance");
const saveBtn = document.getElementById("saveBtn");
const addExerciseBtn =
    document.getElementById("addExerciseBtn");
const deleteExerciseBtn =
    document.getElementById("deleteExerciseBtn");
const renameExerciseBtn =
    document.getElementById("renameExerciseBtn");
const moveUpBtn =
    document.getElementById("moveUpBtn");
const historyExerciseName =
    document.getElementById("historyExerciseName");
const historyBtn =
    document.getElementById("historyBtn");

const homeBtn =
    document.getElementById("homeBtn");

const homePage =
    document.getElementById("homePage");

const historyPage =
    document.getElementById("historyPage");
const exerciseMessage =
    document.getElementById("exerciseMessage");
const moveDownBtn =
    document.getElementById("moveDownBtn");
const historyDiv = document.getElementById("history");
const lastSetDiv = document.getElementById("lastSet");
const saveMessage =
    document.getElementById("saveMessage");
const importFile =
    document.getElementById("importFile");

/* ==================================== */
/* OEFENINGEN */
/* ==================================== */

function loadExercises() {

    exerciseSelect.innerHTML = "";

    getExercises().forEach(exercise => {

        const option =
            document.createElement("option");

        option.value = exercise;
        option.textContent = exercise;

        exerciseSelect.appendChild(option);

    });

}

/* ==================================== */
/* LAATSTE SET */
/* ==================================== */

function getLastSet(exercise) {
    const data = getData()
        .filter(item => item.exercise === exercise);

    return data[data.length - 1];
}

function updateLastSet() {
    const exercise = exerciseSelect.value;
    const lastSet = getLastSet(exercise);

    if (!lastSet) {
        lastSetDiv.textContent = "Geen gegevens";
        weightInput.value = "";
        repsInput.value = "";
        return;
    }

    if (lastSet.duration) {

    let lastSetText =
        `${lastSet.duration} min`;

    if (lastSet.level) {
        lastSetText += ` - level ${lastSet.level}`;
    }

    if (lastSet.distance) {
        lastSetText += ` - ${lastSet.distance} km`;
    }

    lastSetDiv.textContent =
        lastSetText;

    durationInput.value =
        lastSet.duration;

    levelInput.value =
        lastSet.level || "";

    distanceInput.value =
        lastSet.distance || "";

    weightInput.value = "";
    repsInput.value = "";

} else {

    lastSetDiv.textContent =
        `${lastSet.weight} kg × ${lastSet.reps}`;

    weightInput.value =
        lastSet.weight;

    repsInput.value =
        lastSet.reps;

    durationInput.value = "";
        levelInput.value = "";
distanceInput.value = "";
    }
}

/* ==================================== */
/* HISTORIE */
/* ==================================== */

function updateHistory() {

    const exercise = exerciseSelect.value;

    const data = getData()
        .filter(item => item.exercise === exercise)
        .reverse();

    historyDiv.innerHTML = "";

    const groupedData = {};

data.forEach(item => {

    const date =
        new Date(item.date)
        .toLocaleDateString("nl-NL");

    const key =
    item.duration
        ? `${date}|duration|${item.duration}|level|${item.level}|distance|${item.distance}`
        : `${date}|${item.weight}|${item.reps}`;

    if (!groupedData[key]) {

    groupedData[key] = {
        date,
        weight: item.weight,
        reps: item.reps,
        duration: item.duration,
        level: item.level,
        distance: item.distance,
        count: 0,
        items: []
    };

}

    groupedData[key].count++;
    groupedData[key].items.push(item);

});

    Object.values(groupedData).forEach(group => {

    const div =
        document.createElement("div");

    div.className = "history-item";

    const text =
        document.createElement("span");

    if (group.duration) {

    let cardioText =
        `${group.date} - ${group.duration} min`;

    if (group.level) {
        cardioText += ` - level ${group.level}`;
    }

    if (group.distance) {
        cardioText += ` - ${group.distance} km`;
    }

    cardioText += ` (${group.count}x)`;

    text.textContent = cardioText;

} else {

    text.textContent =
        `${group.date} - ${group.weight} kg × ${group.reps} (${group.count} sets)`;

}
    const deleteBtn =
        document.createElement("button");

    deleteBtn.textContent = "🗑️";

    deleteBtn.style.width = "auto";
    deleteBtn.style.marginLeft = "10px";
    deleteBtn.style.padding = "4px 8px";

    deleteBtn.addEventListener("click", () => {

        if (!confirm(
            "Eén set verwijderen?"
        )) {
            return;
        }

        const allData = getData();

        const itemToDelete =
            group.items[0];

        const index =
            allData.findIndex(entry =>
                entry.date === itemToDelete.date &&
                entry.exercise === itemToDelete.exercise &&
                entry.weight === itemToDelete.weight &&
                entry.reps === itemToDelete.reps
            );

        if (index !== -1) {

            allData.splice(index, 1);

            saveData(allData);

            updateLastSet();
            updateHistory();

        }

    });

    div.appendChild(text);
    div.appendChild(deleteBtn);

    historyDiv.appendChild(div);

});

}

saveBtn.addEventListener("click", () => {

    const exercise = exerciseSelect.value;
    const weight =
    Number(weightInput.value);

const reps =
    Number(repsInput.value);

const duration =
    Number(durationInput.value);

const level =
    Number(levelInput.value);

const distance =
    Number(distanceInput.value);

    if (
    !(weight && reps) &&
    !duration
) {
    alert(
        "Vul gewicht/reps of duur in."
    );

    return;
}

    const data = getData();

    data.push({
    date: new Date().toISOString(),
    exercise,
    weight,
    reps,
    duration,
    level,
    distance
});

    saveData(data);

updateLastSet();
updateHistory();

saveMessage.textContent =
    "✔️ Set opgeslagen";

setTimeout(() => {

    saveMessage.textContent = "";

}, 2000);
});

exerciseSelect.addEventListener("change", () => {
    updateLastSet();
    updateHistory();
});

addExerciseBtn.addEventListener("click", () => {

    const name = prompt(
        "Naam van nieuwe oefening:"
    );

    if (!name) {
        return;
    }

    const exercises = getExercises();

    if (exercises.includes(name)) {

        alert("Oefening bestaat al.");

        return;
    }

    exercises.push(name);

    saveExercises(exercises);

    loadExercises();

    exerciseSelect.value = name;

});

deleteExerciseBtn.addEventListener("click", () => {

    const exercise = exerciseSelect.value;

    if (!confirm(`"${exercise}" verwijderen?`)) {
        return;
    }

    let exercises = getExercises();

    exercises = exercises.filter(
        item => item !== exercise
    );

    saveExercises(exercises);

    loadExercises();

    updateLastSet();
    updateHistory();

});

renameExerciseBtn.addEventListener("click", () => {

    const currentExercise =
        exerciseSelect.value;

    const newName = prompt(
        "Nieuwe naam:",
        currentExercise
    );

    if (!newName) {
        return;
    }

    const trimmedName =
        newName.trim();

    if (!trimmedName) {
        return;
    }

    let exercises =
        getExercises();

    const index =
        exercises.indexOf(currentExercise);

    if (index !== -1) {

        exercises[index] =
            trimmedName;

        saveExercises(exercises);

    }

    const data =
        getData();

    data.forEach(item => {

        if (
            item.exercise === currentExercise
        ) {
            item.exercise =
                trimmedName;
        }

    });

    saveData(data);

    loadExercises();

    exerciseSelect.value =
        trimmedName;

    updateLastSet();
    updateHistory();

    exerciseMessage.textContent =
        `"${currentExercise}" hernoemd naar "${trimmedName}"`;

    setTimeout(() => {
        exerciseMessage.textContent = "";
    }, 2000);

});

moveUpBtn.addEventListener("click", () => {

    const exercises = getExercises();
    const currentExercise = exerciseSelect.value;
    const index = exercises.indexOf(currentExercise);

    if (index <= 0) {
        return;
    }

    const temp = exercises[index - 1];
    exercises[index - 1] = exercises[index];
    exercises[index] = temp;

    saveExercises(exercises);
    loadExercises();

    exerciseSelect.value = currentExercise;

    updateLastSet();
    updateHistory();

    exerciseMessage.textContent =
        `${currentExercise} staat nu op plek ${exercises.indexOf(currentExercise) + 1} van ${exercises.length}`;

    setTimeout(() => {
        exerciseMessage.textContent = "";
    }, 2000);

});

historyBtn.addEventListener("click", () => {

    historyExerciseName.textContent =
        exerciseSelect.value;

    homePage.classList.add("hidden");
    historyPage.classList.remove("hidden");

    updateHistory();

});

homeBtn.addEventListener("click", () => {

    historyPage.classList.add("hidden");
    homePage.classList.remove("hidden");

});

exportBtn.addEventListener("click", () => {

    const backup = {
        version: "1.0",
        exportDate: new Date().toISOString(),
        exercises: getExercises(),
        fitnessLog: getData()
    };

    const json =
        JSON.stringify(backup, null, 2);

    const blob =
        new Blob([json], {
            type: "application/json"
        });

    const url =
        URL.createObjectURL(blob);

    const link =
        document.createElement("a");

    const date =
        new Date()
            .toISOString()
            .slice(0, 10);

    link.href = url;
link.download =
    `kiss-fitness-log-${date}.json`;

document.body.appendChild(link);
link.click();
document.body.removeChild(link);

URL.revokeObjectURL(url);

});

importBtn.addEventListener("click", () => {

    importFile.click();

});

importFile.addEventListener("change", (event) => {

    const file =
        event.target.files[0];

    if (!file) {
        return;
    }

    const reader =
        new FileReader();

    reader.onload = (e) => {

        try {

            const backup =
                JSON.parse(e.target.result);

            if (
                !backup.exercises ||
                !backup.fitnessLog
            ) {

                alert(
                    "Ongeldig backupbestand."
                );

                return;
            }

            if (
                !confirm(
                    "Huidige gegevens vervangen?"
                )
            ) {

                return;
            }

            localStorage.setItem(
                "kissExercises",
                JSON.stringify(
                    backup.exercises
                )
            );

            localStorage.setItem(
                "kissFitnessLog",
                JSON.stringify(
                    backup.fitnessLog
                )
            );

            alert(
                "Backup succesvol teruggezet."
            );

            location.reload();

        } catch {

            alert(
                "Fout bij lezen van backup."
            );

        }

    };

    reader.readAsText(file);

});

moveDownBtn.addEventListener("click", () => {

    const exercises = getExercises();
    const currentExercise = exerciseSelect.value;
    const index = exercises.indexOf(currentExercise);

    if (index === -1 || index >= exercises.length - 1) {
        return;
    }

    const temp = exercises[index + 1];
    exercises[index + 1] = exercises[index];
    exercises[index] = temp;

    saveExercises(exercises);
    loadExercises();

    exerciseSelect.value = currentExercise;

    updateLastSet();
    updateHistory();

    exerciseMessage.textContent =
        `${currentExercise} staat nu op plek ${exercises.indexOf(currentExercise) + 1} van ${exercises.length}`;

    setTimeout(() => {
        exerciseMessage.textContent = "";
    }, 2000);

});

loadExercises();
updateLastSet();
updateHistory();

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

const exerciseSelect = document.getElementById("exercise");
const weightInput = document.getElementById("weight");
const repsInput = document.getElementById("reps");
const durationInput =
    document.getElementById("duration");
const saveBtn = document.getElementById("saveBtn");
const addExerciseBtn =
    document.getElementById("addExerciseBtn");
const deleteExerciseBtn =
    document.getElementById("deleteExerciseBtn");

const historyDiv = document.getElementById("history");
const lastSetDiv = document.getElementById("lastSet");
const saveMessage =
    document.getElementById("saveMessage");

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

function getData() {
    return JSON.parse(localStorage.getItem("kissFitnessLog")) || [];
}

function saveData(data) {
    localStorage.setItem("kissFitnessLog", JSON.stringify(data));
}

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

    lastSetDiv.textContent =
        `${lastSet.duration} min`;

    durationInput.value =
        lastSet.duration;

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
    }
}

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
        ? `${date}|duration|${item.duration}`
        : `${date}|${item.weight}|${item.reps}`;

    if (!groupedData[key]) {

        groupedData[key] = {
    date,
    weight: item.weight,
    reps: item.reps,
    duration: item.duration,
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

    text.textContent =
        `${group.date} - ${group.duration} min`;

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
    duration
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

loadExercises();
updateLastSet();
updateHistory();

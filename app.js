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

const exerciseSelect = document.getElementById("exercise");
const weightInput = document.getElementById("weight");
const repsInput = document.getElementById("reps");
const saveBtn = document.getElementById("saveBtn");

const historyDiv = document.getElementById("history");
const lastSetDiv = document.getElementById("lastSet");

function loadExercises() {
    defaultExercises.forEach(exercise => {
        const option = document.createElement("option");
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

    lastSetDiv.textContent =
        `${lastSet.weight} kg × ${lastSet.reps}`;

    weightInput.value = lastSet.weight;
    repsInput.value = lastSet.reps;
}

function updateHistory() {
    const exercise = exerciseSelect.value;

    const data = getData()
        .filter(item => item.exercise === exercise)
        .reverse();

    historyDiv.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "history-item";

       const date = new Date(item.date);

const formattedDate =
    date.toLocaleDateString("nl-NL");

div.textContent =
    `${formattedDate} - ${item.weight} kg × ${item.reps}`;

        historyDiv.appendChild(div);
    });
}

saveBtn.addEventListener("click", () => {

    const exercise = exerciseSelect.value;
    const weight = Number(weightInput.value);
    const reps = Number(repsInput.value);

    if (!weight || !reps) {
        alert("Vul gewicht en reps in.");
        return;
    }

    const data = getData();

    data.push({
        date: new Date().toISOString(),
        exercise,
        weight,
        reps
    });

    saveData(data);

    updateLastSet();
    updateHistory();
});

exerciseSelect.addEventListener("change", () => {
    updateLastSet();
    updateHistory();
});

loadExercises();
updateLastSet();
updateHistory();

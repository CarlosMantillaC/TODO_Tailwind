import { TaskModel } from './Model/TaskModel.js';

const model = new TaskModel();
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const container = document.getElementById('task-content');
const editBtn = document.getElementById('edit-task');

async function loadTask() {
    const task = await model.fetchTaskIndividual(id);
    renderTask(task);
}

function renderTask(task) {
    container.dataset.currentTask = JSON.stringify(task);

    container.innerHTML = `
        <p><strong>ID:</strong> ${task.id}</p>
        <p><strong>Título:</strong> ${task.title}</p>
        <p><strong>Descripción:</strong> ${task.description || ""}</p>
        <p><strong>Completada:</strong> ${task.isCompleted ? "si" : "no"}</p>
        <p><strong>Prioridad:</strong> ${Number.isFinite(task.priority) ? task.priority : "—"}</p>
        <p><strong>Vence:</strong> ${task.dueAt ? new Date(task.dueAt).toLocaleString() : "—"}</p>
        <p><strong>Creada:</strong> ${task.createdAt ? new Date(task.createdAt).toLocaleString() : "—"}</p>
        <p><strong>Actualizada:</strong> ${task.updatedAt ? new Date(task.updatedAt).toLocaleString() : "—"}</p>
    `;
}

function promptPriorityWithValidation(currentPriority) {
    while (true) {

        const raw = prompt("Nueva prioridad (0-3):", String(currentPriority ?? 0));
        if (raw === null) return null;

        const parsed = Number.parseInt(raw, 10);
        if (parsed < 0 || parsed > 3) {
            const tryAgain = confirm("La prioridad debe estar entre 0 y 3. ¿Deseas intentarlo de nuevo?");
            if (!tryAgain) return null;
            continue;
        }

        return parsed;
    }
}

function promptDueAtWithValidation(currentDueAt) {

    const defaultLocal = currentDueAt ? new Date(currentDueAt).toISOString().slice(0,16) : new Date().toISOString().slice(0,16);

    while (true) {

        const raw = prompt("Nueva fecha límite (formato: YYYY-MM-DDTHH:MM)", defaultLocal);
        if (raw === null) return null; 

        const parsed = new Date(raw);
        if (isNaN(parsed.getTime())) {
            const tryAgain = confirm("Fecha inválida. ¿Deseas intentarlo de nuevo?");
            if (!tryAgain) return null;
            continue;
        }

        return parsed.toISOString();
    }
}

function promptBooleanKeepable(question, currentValue) {

    const raw = prompt(`${question} (si/no)`, currentValue ? "si" : "no");
    if (raw === null) return null;

    const normalized = raw.trim().toLowerCase();
    if (["si"].includes(normalized)) return true;
    if (["no"].includes(normalized)) return false;

    const tryAgain = confirm("Respuesta no reconocida. ¿Deseas intentarlo de nuevo?");
    return tryAgain ? promptBooleanKeepable(question, currentValue) : null;
}

editBtn.addEventListener('click', async () => {
    const current = await model.fetchTaskIndividual(id);

    const tRaw = prompt("Nuevo título:", current.title);
    const title = (tRaw === null) ? current.title : (tRaw.trim() || current.title);

    const dRaw = prompt("Nueva descripción:", current.description || "");
    const description = (dRaw === null) ? current.description : dRaw;

    const isCompletedCandidate = promptBooleanKeepable("¿La tarea está completada?", current.isCompleted);
    const isCompleted = (isCompletedCandidate === null) ? current.isCompleted : isCompletedCandidate;

    const priorityCandidate = promptPriorityWithValidation(current.priority);
    const priority = (priorityCandidate === null) ? current.priority : priorityCandidate;

    const dueAtCandidate = promptDueAtWithValidation(current.dueAt);
    const dueAt = (dueAtCandidate === null) ? current.dueAt : dueAtCandidate;

    const payload = {
        title,
        description,
        isCompleted,
        priority,
        dueAt
    };

    const updated = await model.updateTask(id, payload);

    renderTask(updated);

    alert("Tarea actualizada correctamente.");
});

loadTask();

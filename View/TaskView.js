export class TaskView {
    constructor() {
        this.taskForm = document.getElementById('task-form');
        this.taskTitle = document.getElementById('task-title');
        this.taskDesc = document.getElementById('task-desc');
        this.taskPriority = document.getElementById('task-priority');
        this.taskDueAt = document.getElementById('task-due');
        this.tasksList = document.getElementById('tasks-list');
    }

    bindAddTask(handler) {
        this.taskForm.addEventListener('submit', e => {
            e.preventDefault();

            const title = this.taskTitle.value.trim();
            const description = this.taskDesc.value.trim();
            const priority = parseInt(this.taskPriority.value || "0");
            const dueAt = this.taskDueAt.value || new Date().toISOString();

            if (title) {
                handler({
                    title,
                    description,
                    isCompleted: false,
                    priority,
                    dueAt
                });
            }

            this.taskForm.reset();
        });
    }
    
    bindDeleteTask(handler) {
        this.tasksList.addEventListener('click', e => {
            if (e.target.dataset.action === 'delete') {
                handler(e.target.dataset.id);
            }
        });
    }

    renderTasks(tasks) {
        this.tasksList.innerHTML = "";
        tasks.forEach(task => this.appendTask(task));
    }

    appendTask(task) {
        const li = document.createElement("li");
        li.className = "flex flex-col sm:flex-row sm:items-center justify-between bg-white shadow p-3 rounded";

        li.innerHTML = `
        <div class="flex flex-col">
            <h3 class="font-semibold">${task.title}</h3>
            <p class="text-sm text-gray-600">${task.description || ""}</p>
            <p class="text-xs text-gray-500">Prioridad: ${task.priority}</p>
            <p class="text-xs text-gray-500">Completada: ${task.isCompleted ? "si" : "no"}</p>
            <p class="text-xs text-gray-500">Vence: ${new Date(task.dueAt).toLocaleString()}</p>
        </div>
        <div class="flex gap-2 mt-2 sm:mt-0">
            <button class="px-2 py-1 text-sm bg-green-500 text-white rounded" 
                data-action="view" data-id="${task.id}">Ver Detalles</button>
            <button class="px-2 py-1 text-sm bg-red-500 text-white rounded" 
                data-action="delete" data-id="${task.id}">Eliminar</button>
        </div>
        `;

        li.querySelector('[data-action="view"]').addEventListener('click', () => {
            window.location.href = `task.html?id=${task.id}`;
        });

        this.tasksList.appendChild(li);
    }

    removeTaskFromView(id) {
        const li = this.tasksList.querySelector(`[data-id="${id}"]`)?.closest("li");
        if (li) li.remove();
    }
}
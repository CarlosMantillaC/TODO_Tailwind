const API_BASE = "https://todoapitest.juansegaliz.com/todos";

export class TaskModel{
    async fetchTasks() {
        const resp = await fetch(API_BASE);
        const json = await resp.json();
        return json.data;
    }

    async createTask(task) {
        const resp = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        });
        const json = await resp.json();
        return json.data;
    }
    
    async fetchTaskIndividual(id) {
        const resp = await fetch(`${API_BASE}/${id}`);
        const json = await resp.json();
        return json.data;
    }

    async updateTask(id, task) {
        const resp = await fetch(`${API_BASE}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task),
        });
        const json = await resp.json();
        return json.data;
    }

    async deleteTask(id) {
        const resp = await fetch(`${API_BASE}/${id}`, {
            method: "DELETE"
        });
        if (!resp.ok) return false;
        return true;
    }
}

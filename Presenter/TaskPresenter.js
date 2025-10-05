export class TaskPresenter {
    constructor(view, model) {
        this.view = view;
        this.model = model;

        this.init();
    }

    async init() {
        const tasks = await this.model.fetchTasks();
        this.view.renderTasks(tasks);
        
        this.view.bindAddTask(this.handleAddTask.bind(this));
        this.view.bindDeleteTask(this.handleDeleteTask.bind(this));
        this.view.bindEditTask(this.handleEditTask.bind(this));
    }

    async handleAddTask(task) {
        const created = await this.model.createTask(task);
        this.view.appendTask(created);
    }

    async handleDeleteTask(id) {
        const deleted = await this.model.deleteTask(id);
        if (deleted) this.view.removeTaskFromView(id);
    }

    async handleEditTask(id, updates) {
        const updated = await this.model.updateTask(id, updates);
        if (updated) this.view.updateTaskInView(updated);
    }
}

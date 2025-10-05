import { TaskModel } from './Model/TaskModel.js';
import { TaskView } from './View/TaskView.js';
import { TaskPresenter } from './Presenter/TaskPresenter.js';

const model = new TaskModel();
const view = new TaskView();
const presenter = new TaskPresenter(view, model);

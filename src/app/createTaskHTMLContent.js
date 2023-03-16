import tasks from "./tasks";
export const createTaskHTMLContent = (task, isOverdue) => `${tasks.taskTemplate(task.id, tasks.getPriorityClassName(task.priority), tasks.taskNameWithoutLabels(task.taskName), task.description, task.dueDate ? task.dueDate.toText():'',
task.projectName.element.getTemplateHTML(task.projectName.subProjectIndex), task.labels || [], isOverdue)}`;
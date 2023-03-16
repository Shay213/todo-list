import tasks from "./tasks";
import { createTaskHTMLContent } from "./createTaskHTMLContent";

const projectsTabs = (function(){
    const projects = document.querySelectorAll('.main-container > .project');
    const date = new Date();
    date.setHours(0,0,0,0);
    const projectTasks = projectEl => tasks.getAllTasks().filter(task => [...projectEl.classList].includes(task.projectName.element.name.toLowerCase()));
    const overdueTasks = task => task.getDateObj() ? task.getDateObj() < date : false;

    const _displayTasks = (() => {
        projects.forEach(project => {
            const tasks = projectTasks(project);
            tasks.forEach(task => {
                let content = '';
                const isOverdue = overdueTasks(task);
                if(typeof task.projectName.subProjectIndex === 'number'){
                    const projectSectionName = task.projectName.element.subProjects[task.projectName.subProjectIndex].name.toLowerCase();
                    const projectSectionEl = project.querySelector(`.${projectSectionName}`);
                    isOverdue ? content = createTaskHTMLContent(task, true) : createTaskHTMLContent(task);
                    projectSectionEl.innerHTML += content; 
                }else{
                    const projectEl = project.querySelector(`ul:first-of-type`);
                    isOverdue ? content = createTaskHTMLContent(task, true) : content = createTaskHTMLContent(task);
                    if(!task.dueDate){
                        const taskEl = new DOMParser().parseFromString(content, 'text/html').querySelector('li');
                        taskEl.querySelector('.bottom > .date').classList.add('empty-date');
                        projectEl.appendChild(taskEl);
                    }
                    else projectEl.innerHTML += content;
                }
            });
        });
    })();
})();

export default projectsTabs
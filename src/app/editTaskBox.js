import addTaskBox from "./addTaskBox";
import tasks from "./tasks";
import more from "../assets/icons/more.svg";
import todayTab from "./todayTab";
import { createTaskHTMLContent } from "./createTaskHTMLContent";
import editDate from "./editDate";

const editTaskBox = (function(){
    const editTaskIcons = document.querySelectorAll('.container > ul li .icons > div:nth-of-type(2)');
    const addTaskContainer = document.querySelector('#content > .add-task-container');
    const overdueEl = document.querySelector('.today .overdue');
    const todayTasksEl = document.querySelector('.today .today-tasks');
    const [...projectsTabs] = document.querySelectorAll('.main-container > .project');
    const todayTabContainer = document.querySelector('.main-container > .today');
    let taskContainer;
    let isEdited = false;
    
    const findTaskWithId = id => tasks.getAllTasks().find(task => task.id === id);

    editTaskIcons.forEach(el => el.addEventListener('click', showEditTaskBox));

    const editTask = (task, id) => {
        const isOverdue = todayTab.overdueTasks([task]).length > 0;
        const isToday = todayTab.todayTasks([task]).length > 0;
        const content = isOverdue ? createTaskHTMLContent(task, true):createTaskHTMLContent(task);
        const taskEl = () => new DOMParser().parseFromString(content, 'text/html').querySelector('li');
        
        const projectEl = projectsTabs.find(project => project.querySelector(`li[data-id="${id}"]`));
        const subProjectEl = [...projectEl.querySelectorAll('ul:not(:first-of-type)')].find(subProject => subProject.querySelector(`li[data-id="${id}"]`));
        let taskElement = projectEl.querySelector(`li[data-id="${id}"]`);

        const replaceEl = () => {
            const el = taskEl();
            if(!task.dueDate) el.querySelector('.bottom > .date').classList.add('empty-date');
            taskElement.replaceWith(el);
        };

        const moveElToDestination = destination => {
            taskElement.remove();
            const projectUl = document.querySelector(destination);
            const el = taskEl();
            if(!task.dueDate) el.querySelector('.bottom > .date').classList.add('empty-date');
            projectUl.appendChild(el);
        };
        
        if(typeof task.projectName.subProjectIndex === 'number'){
            const project = task.projectName.element.name.toLowerCase();
            const subProject = task.projectName.element.subProjects[task.projectName.subProjectIndex].name.toLowerCase();
            const destination = `.main-container > .${project} > ul.${subProject}`;

            subProjectEl && subProjectEl.classList.contains(subProject) ? replaceEl() : moveElToDestination(destination);
        }
        else{
            const project = task.projectName.element.name.toLowerCase();
            const destination = `.main-container > .${project}`;
            projectEl.classList.contains(project) ? replaceEl() : moveElToDestination(destination);
        }

        const taskElementInsideOverdue = overdueEl.querySelector(`li[data-id="${id}"]`);
        const taskElementInsideToday = todayTasksEl.querySelector(`li[data-id="${id}"]`);
        if((isOverdue && taskElementInsideOverdue) || (isToday && taskElementInsideToday)) {
            const task = todayTabContainer.querySelector(`li[data-id="${id}"]`);
            task.replaceWith(taskEl());
        }
        else{
            const task = todayTabContainer.querySelector(`li[data-id="${id}"]`);
            if(task) task.remove();
            if(isOverdue) overdueEl.appendChild(taskEl());
            else if(isToday) todayTasksEl.appendChild(taskEl());
        }

        document.querySelectorAll(`li[data-id="${id}"] .icons > div:nth-of-type(2)`).forEach(el => el.addEventListener('click', showEditTaskBox));
        editDate.activateEditDateIcons();
    };   

    function showEditTaskBox(e){
        if(isEdited) return;
        isEdited = true;
        const clone = addTaskContainer.cloneNode(true);
        taskContainer = e.currentTarget.parentNode.parentNode.parentNode;
        const topEl = taskContainer.querySelector('.top');
        const bottomEl = taskContainer.querySelector('.bottom');

        clone.classList.add('edit-task-container');
        topEl.style.display = 'none';
        bottomEl.style.display = 'none';
        taskContainer.appendChild(clone);
        
        setUpEditTaskBox({editTaskContainer: clone, taskId: taskContainer.dataset.id, topEl: topEl, bottomEl: bottomEl});
    };
    
    const setUpEditTaskBox = ({editTaskContainer, taskId, topEl, bottomEl}) => {
        addTaskBox.events(true);
        addTaskBox.setData(editTaskContainer);
        addTaskBox.setEditMode(true);
        addTaskBox.getAllButtons(false);
        addTaskBox.events(false);
        completeData(editTaskContainer, taskId);
        const cancelBtn = editTaskContainer.querySelector('.bottom > button.cancel-btn');
        const addTaskBtn = editTaskContainer.querySelector('.bottom > button.add-btn');
        cancelBtn.addEventListener('click', resetAndDeleteTaskBox.bind({el: editTaskContainer, topEl: topEl, bottomEl: bottomEl}, false), {once:true});
        addTaskBtn.addEventListener('click', resetAndDeleteTaskBox.bind({el: editTaskContainer, topEl: topEl, bottomEl: bottomEl, id: taskId}, true), {once:true});
    };

    function resetAndDeleteTaskBox(save, e){
        const currTask = findTaskWithId(+this.id);
        if(save) saveChanges(currTask, +this.id);
        addTaskBox.events(true);
        addTaskBox.setData(addTaskContainer);
        addTaskBox.setEditMode(false);
        addTaskBox.getAllButtons(true);
        addTaskBox.events(false);
        isEdited = false;

        if(!save){
            this.topEl.style.display = 'flex';
            this.bottomEl.style.display = 'flex';
            this.el.remove();
        }
    };
    
    function saveChanges(currTask, id){
        const changes = addTaskBox.getTaskData();
        Object.keys(changes).forEach(el => currTask[el] = changes[el]);
        
        editTask(currTask, id);
    };
    
    const completeData = (editTaskContainer, taskId) => {
        const currTask = findTaskWithId(+taskId);
        addTaskBox.setTaskData(currTask);
        const taskName = editTaskContainer.querySelector('.top .inputs > div > input');
        const description = editTaskContainer.querySelector('.top .inputs > input');
        const dueDateBtn = editTaskContainer.querySelector('.top .flex-container > .due-date');
        const priorityBtn = editTaskContainer.querySelector('.top .flex-container > .priority .btn');
        const priorityPickerElements = editTaskContainer.querySelectorAll('.top .flex-container > .priority .priority-picker > div');
        const labelBtn = editTaskContainer.querySelector('.top .flex-container > .label');
        const selectProjectBtn = editTaskContainer.querySelector('.bottom .select-project');
        const projectChecked = editTaskContainer.querySelectorAll('.bottom .project-picker img.projectChecked');
        const [...projectsNames] = editTaskContainer.querySelectorAll('.bottom .project-picker > * p');
        const addTaskBtn = editTaskContainer.querySelector('.bottom > button.add-btn');
        
        taskName.value = currTask.taskName;
        taskName.dispatchEvent(new Event('click'));
        taskName.focus();
        description.value = currTask.description;
        if(currTask.labels) addTaskBox.setAllUniqueMatchesInsideTaskName(currTask.labels);
        addTaskBox.contentPriorityBtn(priorityBtn, currTask.priority);
        priorityPickerElements.forEach(el => +el.dataset.priority === currTask.priority ? el.classList.add('checked'):el.classList.remove('checked'));

        currTask.projectName.subProjectIndex ? 
        selectProjectBtn.innerHTML = currTask.projectName.element.getTemplateHTML(currTask.projectName.subProjectIndex) + `<img src="${more}" alt="expand">` :
        selectProjectBtn.innerHTML = currTask.projectName.element.getTemplateHTML() + `<img src="${more}" alt="expand">`;
        projectChecked.forEach(el => el.classList.contains('active') ? el.classList.remove('active') : el);
        currTask.projectName.subProjectIndex ?
        projectsNames.find(name => name.innerText === currTask.projectName.element.subProjects[currTask.projectName.subProjectIndex].name).nextElementSibling.classList.add('active'):
        projectsNames.find(name => name.innerText === currTask.projectName.element.name).nextElementSibling.classList.add('active');

        currTask.dueDate ?
            addTaskBox.styleDueDateBtn(new Date(currTask.dueDate.year, currTask.dueDate.month, currTask.dueDate.day)):
            addTaskBox.styleDueDateBtn(null);

        addTaskBtn.style.cssText = 'opacity: 1; cursor: pointer;';
        addTaskBtn.innerText = 'Save';
    };

    return {
        editTask
    };

})();

export default editTaskBox
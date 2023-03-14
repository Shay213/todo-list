import addTaskBox from "./addTaskBox";
import tasks from "./tasks";
import more from "../assets/icons/more.svg";
import todayTab from "./todayTab";

const editTaskBox = (function(){
    const editTaskIcons = document.querySelectorAll('.container > ul li .icons > div:nth-of-type(2)');
    const addTaskContainer = document.querySelector('#content > .add-task-container');
    let taskContainer;
    let isEdited = false;

    const findTaskWithId = id => tasks.getAllTasks().find(task => task.id === id);

    editTaskIcons.forEach(el => el.addEventListener('click', showEditTaskBox));

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
        
        editTask({editTaskContainer: clone, taskId: taskContainer.dataset.id, topEl: topEl, bottomEl: bottomEl});
    };
    
    const editTask = ({editTaskContainer, taskId, topEl, bottomEl}) => {
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
        if(save) saveChanges(currTask, this.topEl.parentNode, +this.id);
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
    
    function saveChanges(currTask, el, id){
        const changes = addTaskBox.getTaskData();
        Object.keys(changes).forEach(el => currTask[el] = changes[el]);
        
        todayTab.editTask(currTask, el);
        
        document.querySelector(`li[data-id="${id}"] .icons > div:nth-of-type(2)`).addEventListener('click', showEditTaskBox);
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

        addTaskBox.styleDueDateBtn(new Date(currTask.dueDate.year, currTask.dueDate.month, currTask.dueDate.day));

        addTaskBtn.style.cssText = 'opacity: 1; cursor: pointer;';
        addTaskBtn.innerText = 'Save';
    };

})();

export default editTaskBox
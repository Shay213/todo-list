import addTaskBox from "./addTaskBox";
import tasks from "./tasks";

const editTaskBox = (function(){
    let showHideBtn = []; 
    const editTaskIcons = document.querySelectorAll('.container > ul li .icons > div:nth-of-type(2)');
    const addTaskContainer = document.querySelector('#content > .add-task-container');

    const findTaskWithId = id => tasks.getAllTasks().find(task => task.id = id);

    const myPromise = new Promise((resolve, reject) => {
        editTaskIcons.forEach(el => el.addEventListener('click', e => {   
            e.currentTarget.classList.add('active');
            const clone = addTaskContainer.cloneNode(true);
            const taskContainer = e.currentTarget.parentNode.parentNode.parentNode;
            const topEl = taskContainer.querySelector('.top');
            const bottomEl = taskContainer.querySelector('.bottom');
    
            clone.classList.add('edit-task-container');
            topEl.style.display = 'none';
            bottomEl.style.display = 'none';
            taskContainer.appendChild(clone);
            
            clone ? resolve({editTaskContainer: clone, taskId: taskContainer.dataset.id}) : reject('Something went wrong');
        }));
    });
    
    myPromise
        .then((value) => {
            addTaskBox.getAllButtons(value.editTaskContainer, false, showHideBtn);
            completeData(value);
        })
        .catch((message) => console.log(message));
    
    function completeData({editTaskContainer, taskId}){
        const currTask = findTaskWithId(taskId);
        const taskName = editTaskContainer.querySelector('.top .inputs > div > input');
        const description = editTaskContainer.querySelector('.top .inputs > input');
        const dueDateBtn = editTaskContainer.querySelector('.top .flex-container > .due-date');
        const priorityBtn = editTaskContainer.querySelector('.top .flex-container > .priority');
        const labelBtn = editTaskContainer.querySelector('.top .flex-container > .label');
        const selectProjectBtn = editTaskContainer.querySelector('.bottom .select-project');
        const cancelBtn = editTaskContainer.querySelector('.bottom > button.cancel-btn');
        const addTaskBtn = editTaskContainer.querySelector('.bottom > button.add-btn');
        //console.log(currTask);
        taskName.value = currTask.taskName;
        description.value = currTask.description;
        addTaskBtn.style.cssText = 'opacity: 1; cursor: pointer;';
        addTaskBtn.innerText = 'Save';
    }

})();

export default editTaskBox
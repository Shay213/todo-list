import addTaskBox from "./addTaskBox";
import tasks from "./tasks";
import editTaskBox from "./editTaskBox";
import { taskIconsEventsManager } from "./taskIconsEventsManager";
import addTaskBoxInline from "./addTaskBoxInline";

const editDate = (function(){
    const datePicker = document.querySelector('#content > .add-task-container .top .flex-container .due-date .date-picker');
    const addTaskContainer = document.querySelector('#content > .add-task-container');
    let clonedDatePicker;
    let clickedIcon;
    const findTaskWithId = id => tasks.getAllTasks().find(task => task.id === id);

    taskIconsEventsManager(true, showDatePicker);

    function showDatePicker(e){
        e.stopImmediatePropagation();
        taskIconsEventsManager(false, showDatePicker, editTaskBox.showEditTaskBox, addTaskBoxInline.showAddTaskBox);
        clonedDatePicker = datePicker.cloneNode(true);
        clonedDatePicker.classList.add('edit-date-picker');
        clonedDatePicker.classList.add('show');
        
        clickedIcon = e.currentTarget;
        clickedIcon.style.position = 'relative';
        clickedIcon.appendChild(clonedDatePicker);
        const container = clickedIcon.closest('[data-id]');
        addTaskBox.events(true);

        editDate(+container.dataset.id);
    }

    const changeDataObj = () => {
        return {
            addTaskContainer: clickedIcon,
            dueDate: ''
        };
    };
    
    const editDate = id => {
        addTaskBox.datePicker(changeDataObj);
        const pickIcon = clonedDatePicker.querySelector('.pick-icon');
        const months = clonedDatePicker.querySelector('.calendar .months');
        const currTask = findTaskWithId(id);
        document.addEventListener('click', checkTarget);
        
        function checkTarget(e){
            if(e.target != clonedDatePicker && !clonedDatePicker.contains(e.target) || 
            pickIcon.contains(e.target) || (months.contains(e.target) && e.target.tagName === 'LI' && !e.target.classList.contains('past'))) {
                const chosenDate = addTaskBox.getDueDate();
                if(chosenDate != '') {
                    currTask.dueDate = chosenDate;
                    editTaskBox.editTask(currTask, id);
                }
                
                document.removeEventListener('click', checkTarget);
                clonedDatePicker.remove();
                addTaskBox.setData(addTaskContainer);
                addTaskBox.events(false);
                addTaskBox.setEditMode(false);
                addTaskBox.getAllButtons(true);

                taskIconsEventsManager(true, showDatePicker, editTaskBox.showEditTaskBox, addTaskBoxInline.showAddTaskBox);
            }
        };
    };

    return {
        showDatePicker
    };

})();

export default editDate

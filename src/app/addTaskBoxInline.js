import addTaskBox from "./addTaskBox";
import { taskIconsEventsManager } from "./taskIconsEventsManager";
import editDate from "./editDate";
import editTaskBox from "./editTaskBox";

const addTaskBoxInline = (function(){
    const addTaskContainer = document.querySelector('#content > .add-task-container');
    let deleteAddTaskInlineBox;
    taskIconsEventsManager(true, null, null, showAddTaskBox);

    function showAddTaskBox(e){
        taskIconsEventsManager(false, editDate.showDatePicker, editTaskBox.showEditTaskBox, showAddTaskBox);
        
        const currTabUl = e.currentTarget.previousElementSibling;
        const clone = addTaskContainer.cloneNode(true);
        clone.classList.add('add-task-container-inline');
        currTabUl.appendChild(clone);
        e.currentTarget.style.display = 'none';
        _setUpAddTaskBox(clone, e.currentTarget, currTabUl);
    }

    const _setUpAddTaskBox = (box, btn, currTabUl) => {
        deleteAddTaskInlineBox = () => {
            box.remove();
            btn.style.display = 'flex';
        };
        addTaskBox.events(true);
        addTaskBox.setData(box);
        addTaskBox.getAllButtons(false);
        addTaskBox.events(false);
        addTaskBox.updateButtonsContentBasedOnTab(currTabUl);
        const cancelBtn = box.querySelector('.bottom > button.cancel-btn');
        cancelBtn.addEventListener('click', deleteTaskBox, {once:true});
    };

    function deleteTaskBox(e){
        addTaskBox.events(true);
        addTaskBox.setData(addTaskContainer);
        addTaskBox.getAllButtons(true);
        addTaskBox.events(false);

        deleteAddTaskInlineBox();

        taskIconsEventsManager(true, editDate.showDatePicker, editTaskBox.showEditTaskBox, showAddTaskBox);
    }

    return {
        showAddTaskBox,
        deleteTaskBox
    };

})();

export default addTaskBoxInline
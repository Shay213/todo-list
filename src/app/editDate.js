import addTaskBox from "./addTaskBox";
import tasks from "./tasks";
import todayTab from "./todayTab";

const editDate = (function(){
    let editDateIcons = document.querySelectorAll('.container > ul li .icons > div:first-of-type');
    let editDateIcons2 = document.querySelectorAll('.container > ul li .bottom .date');
    let allIcons = [...editDateIcons, ...editDateIcons2];
    const datePicker = document.querySelector('#content > .add-task-container .top .flex-container .due-date .date-picker');
    const addTaskContainer = document.querySelector('#content > .add-task-container');
    let clonedDatePicker;
    let clickedIcon;
    const findTaskWithId = id => tasks.getAllTasks().find(task => task.id === id);

    allIcons.forEach(el => el.addEventListener('click', showDatePicker, {once:true}));

    function showDatePicker(e){
        e.stopImmediatePropagation();
        allIcons.forEach(el => el.removeEventListener('click', showDatePicker));
        clonedDatePicker = datePicker.cloneNode(true);
        clonedDatePicker.classList.add('edit-date-picker');
        clonedDatePicker.classList.add('show');
        
        clickedIcon = e.currentTarget;
        clickedIcon.style.position = 'relative';
        clickedIcon.appendChild(clonedDatePicker);
        const container = clickedIcon.closest('[data-id]');
        addTaskBox.events(true);

        editDate(+container.dataset.id, container);
    }

    const changeDataObj = () => {
        return {
            addTaskContainer: clickedIcon,
            dueDate: ''
        };
    };
    
    const editDate = (id, container) => {
        addTaskBox.datePicker(changeDataObj);
        const pickIcon = clonedDatePicker.querySelector('.pick-icon');
        const months = clonedDatePicker.querySelector('.calendar .months');
        const currTask = findTaskWithId(id);
        document.addEventListener('click', checkTarget);
        
        function checkTarget(e){
            e.stopImmediatePropagation();
            if(e.target != clonedDatePicker && !clonedDatePicker.contains(e.target) || 
            pickIcon.contains(e.target) || (months.contains(e.target) && e.target.tagName === 'LI' && !e.target.classList.contains('past'))) {
                const chosenDate = addTaskBox.getDueDate();
                if(chosenDate != '') {
                    currTask.dueDate = chosenDate;
                    todayTab.editTask(currTask, container);
                }
                
                document.removeEventListener('click', checkTarget);
                clonedDatePicker.remove();
                addTaskBox.setData(addTaskContainer);
                addTaskBox.events(false);
                addTaskBox.setEditMode(false);
                addTaskBox.getAllButtons(true);

                editDateIcons = document.querySelectorAll('.container > ul li .icons > div:first-of-type');
                editDateIcons2 = document.querySelectorAll('.container > ul li .bottom .date');
                allIcons = [...editDateIcons, ...editDateIcons2];
                allIcons.forEach(el => el.addEventListener('click', showDatePicker, {once:true}));
            }
        };
    };

})();

export default editDate

export const taskIconsEventsManager = (activate, showDatePicker, showEditTaskBox, showAddTaskBox) => {
    const editDateIcons = document.querySelectorAll('.container > ul li .icons > div:first-of-type');
    const editDateIcons2 = document.querySelectorAll('.container > ul li .bottom .date');
    const allIcons = [...editDateIcons, ...editDateIcons2];
    const editTaskIcons = document.querySelectorAll('.container > ul li .icons > div:nth-of-type(2)');
    const addButtons = document.querySelectorAll('.container > div.add-task');

    if(activate){
        if(showDatePicker) allIcons.forEach(el => el.addEventListener('click', showDatePicker, {once:true}));
        if(showEditTaskBox) editTaskIcons.forEach(el => el.addEventListener('click', showEditTaskBox, {once:true}));
        if(showAddTaskBox) addButtons.forEach(el => el.addEventListener('click', showAddTaskBox));
    }
    else{
        allIcons.forEach(el => el.removeEventListener('click', showDatePicker));
        editTaskIcons.forEach(el => el.removeEventListener('click', showEditTaskBox));
        addButtons.forEach(el => el.removeEventListener('click', showAddTaskBox));
    }
};
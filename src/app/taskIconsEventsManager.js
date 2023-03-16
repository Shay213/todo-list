export const taskIconsEventsManager = (activate, showDatePicker, showEditTaskBox) => {
    const editDateIcons = document.querySelectorAll('.container > ul li .icons > div:first-of-type');
    const editDateIcons2 = document.querySelectorAll('.container > ul li .bottom .date');
    const allIcons = [...editDateIcons, ...editDateIcons2];
    const editTaskIcons = document.querySelectorAll('.container > ul li .icons > div:nth-of-type(2)');
    let eventsActive = false;

    if(activate && !eventsActive){
        if(showDatePicker) allIcons.forEach(el => el.addEventListener('click', showDatePicker, {once:true}));
        if(showEditTaskBox) editTaskIcons.forEach(el => el.addEventListener('click', showEditTaskBox, {once:true}));
        eventsActive = true;
    }
    else{
        allIcons.forEach(el => el.removeEventListener('click', showDatePicker));
        editTaskIcons.forEach(el => el.removeEventListener('click', showEditTaskBox));
        eventsActive = false;
    }
};
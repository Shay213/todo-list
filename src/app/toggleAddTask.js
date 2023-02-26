export function toggleAddTask(){
    const addBtn = document.querySelector('.top-panel .add-task');
    const addTaskContainer = document.querySelector('.add-task-container');

    addBtn.addEventListener('click', e => {
        addTaskContainer.classList.add('toggleAddTask');
        e.stopImmediatePropagation();
        
        document.addEventListener('click', hideAddTaskContainer);
    });

    function hideAddTaskContainer(ev){
        if(!(ev.target === addTaskContainer || addTaskContainer.contains(ev.target))){
            addTaskContainer.classList.remove('toggleAddTask');
            document.removeEventListener('click', hideAddTaskContainer);
        }
    }
};
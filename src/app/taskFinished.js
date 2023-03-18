import tasks from "./tasks";
import projectsTabs from "./projectsTabs";

const taskFinished = (function(){
    const buttons = [];
    projectsTabs.allTasksElements.forEach(el => buttons.push(el.querySelector('.top > .priority-box')));
    
    buttons.forEach(button => button.addEventListener('click', taskDone));

    function taskDone(e){
        const taskEl = e.currentTarget.parentNode.parentNode;
        const id = taskEl.dataset.id;
        const allTaskEls = document.querySelectorAll(`.main-container > .container > ul > li[data-id="${id}"]`);
        allTaskEls.forEach(taskEl => taskEl.remove());
        tasks.removeTask(+id);
        console.log(e.currentTarget);
    }

    const activateTaskDoneBtn = el => el.addEventListener('click', taskDone); 

    return{
        activateTaskDoneBtn
    };

})();

export default taskFinished
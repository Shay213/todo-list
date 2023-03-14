import tasks from "./tasks";

const todayTab = (function(){
    const overdueEl = document.querySelector('.today .overdue');
    const todayTasksEl = document.querySelector('.today .today-tasks');
    const titleDate = document.querySelector('.today .title .date');
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const date = new Date();
    date.setHours(0,0,0,0);

    const _updateTextTimesTodayTab = function(){
        todayTasksEl.querySelector('h4').innerText = `${days[date.getDay()]} - ${date.getDate()} ${months[date.getMonth()]} - Today`;
        titleDate.innerText = `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
    };

    const overdueTasks = arr => arr.filter(task => task.getDateObj() ? task.getDateObj() < date : false);
    const todayTasks = arr => arr.filter(task => task.getDateObj() ? task.getDateObj().getDate() === date.getDate()&&
                                                                                    task.getDateObj().getMonth() === date.getMonth()&&
                                                                                    task.getDateObj().getFullYear() === date.getFullYear() : false);

    const createTaskHTMLContent = task => `${tasks.taskTemplate(task.id, tasks.getPriorityClassName(task.priority), tasks.taskNameWithoutLabels(task.taskName), task.description, task.dueDate ? task.dueDate.toText():'',
    task.projectName.element.getTemplateHTML(task.projectName.subProjectIndex), task.labels || [])}`;

    const _updateTasksPlacement = function(){
        let content = '';
        tasks.getAllTasks().forEach(el => {
            content = createTaskHTMLContent(el);
            
            const isOverdue = overdueTasks([el]).length > 0;
            const isToday = todayTasks([el]).length > 0;
            
            if(isOverdue) overdueEl.insertAdjacentHTML('beforeend', content);
            else if(isToday) todayTasksEl.insertAdjacentElement('beforeend', content);
        });
    };

    const editTask = (task, el) => {
        const isOverdue = overdueTasks([task]).length > 0;
        const isToday = todayTasks([task]).length > 0;
        const content = createTaskHTMLContent(task);
        const taskEl = new DOMParser().parseFromString(content, 'text/html').querySelector('li');
        
        if((isOverdue && el.parentNode.classList.contains('overdue')) || (isToday && el.parentNode.classList.contains('today-tasks'))) el.replaceWith(taskEl);
        else{
            el.remove();
            if(isOverdue) overdueEl.appendChild(taskEl);
            else if(isToday) todayTasksEl.appendChild(taskEl);
        }
    };   
    
    const _init = (function(){
        _updateTasksPlacement();
        _updateTextTimesTodayTab();
    })();

    return{
        editTask
    };

})();

export default todayTab
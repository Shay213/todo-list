import tasks from "./tasks";

const todayTab = (function(){
    const overdue = document.querySelector('.today .overdue');
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

    const _overdueTasks = () => tasks.getAllTasks().filter(task => task.getDateObj() ? task.getDateObj() < date : false);
    const _todayTasks = () => tasks.getAllTasks().filter(task => task.getDateObj() ? task.getDateObj().getDate() === date.getDate()&&
                                                                                    task.getDateObj().getMonth() === date.getMonth()&&
                                                                                    task.getDateObj().getFullYear() === date.getFullYear() : false);

    const _displayTasks = function(element, tasksArr){
        tasksArr.forEach(el => {
            if(element === overdue){
                element.innerHTML += `${tasks.taskTemplate(el.id, tasks.getPriorityClassName(el.priority), el.taskName, el.description, el.dueDate.toText(),
                    el.projectName.element.getTemplateHTML(el.projectName.subProjectIndex))}`;
            }else{
                element.innerHTML += `${tasks.taskTemplate(el.id, tasks.getPriorityClassName(el.priority), el.taskName, el.description, '',
                    el.projectName.element.getTemplateHTML(el.projectName.subProjectIndex))}`;
            } 
        });
    };
    
    const _init = (function(){
        _displayTasks(overdue, _overdueTasks());
        _displayTasks(todayTasksEl, _todayTasks());
        _updateTextTimesTodayTab();
    })();
})();

export default todayTab
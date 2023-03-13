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

    const overdueTasks = (arr) => arr.filter(task => task.getDateObj() ? task.getDateObj() < date : false);
    const todayTasks = (arr) => arr.filter(task => task.getDateObj() ? task.getDateObj().getDate() === date.getDate()&&
                                                                                    task.getDateObj().getMonth() === date.getMonth()&&
                                                                                    task.getDateObj().getFullYear() === date.getFullYear() : false);

    const displayTasks = function(tasksArr, todayTasks=false){
        let content = '';
        tasksArr.forEach(el => {
            if(todayTasks){
                content = `${tasks.taskTemplate(el.id, tasks.getPriorityClassName(el.priority), tasks.taskNameWithoutLabels(el.taskName), el.description, '',
                    el.projectName.element.getTemplateHTML(el.projectName.subProjectIndex), el.labels || [])}`;
                
                todayTasksEl.insertAdjacentHTML('beforeend', content);
            }else{
                content = `${tasks.taskTemplate(el.id, tasks.getPriorityClassName(el.priority), tasks.taskNameWithoutLabels(el.taskName), el.description, el.dueDate.toText(),
                    el.projectName.element.getTemplateHTML(el.projectName.subProjectIndex), el.labels || [])}`;
                
                overdue.insertAdjacentHTML('beforeend', content);
            }
        });
    };

    
    
    const _init = (function(){
        displayTasks(overdueTasks(tasks.getAllTasks()));
        displayTasks(todayTasks(tasks.getAllTasks()), true);
        _updateTextTimesTodayTab();
    })();

    return{
        overdueTasks,
        todayTasks,
        displayTasks
    };

})();

export default todayTab
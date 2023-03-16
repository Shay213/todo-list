import tasks from "./tasks";
import { createTaskHTMLContent } from "./createTaskHTMLContent";
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

    

    const _displayTasksInsideOverdueOrToday = function(){
        let content = '';
        tasks.getAllTasks().forEach(el => {
            const isOverdue = overdueTasks([el]).length > 0;
            const isToday = todayTasks([el]).length > 0;

            isOverdue ? content = createTaskHTMLContent(el, true) : content = createTaskHTMLContent(el);
            
            if(isOverdue) overdueEl.insertAdjacentHTML('beforeend', content);
            else if(isToday) todayTasksEl.insertAdjacentElement('beforeend', content);
        });
    };
    
    const _init = (function(){
        _displayTasksInsideOverdueOrToday();
        _updateTextTimesTodayTab();
    })();

    return{
        overdueTasks,
        todayTasks
    };

})();

export default todayTab
import event from '../assets/icons/event.svg';
import edit from '../assets/icons/edit.svg';
import comment from '../assets/icons/comment.svg';
import check from '../assets/icons/check-bold.svg';

const tasks = (function(){
    let allTasks = [
        {
            id: 1,
            priority: 1,
            taskName: 'Learn the basics with the easy',
            description: '',
            date: '23 Feb',
            projectName: 'inbox'
        },
        {
            id: 2,
            priority: 2,
            taskName: 'Learn the basics with the easy',
            description: 'get personalized recommendation',
            date: '23 Feb',
            projectName: 'home'
        },
        {
            id: 3,
            priority: 3,
            taskName: 'Learn the basics with the easy',
            description: '',
            date: 'Today',
            projectName: 'inbox'
        }
    ];
    const _taskTemplate = (id, priority, taskName, description, date, projectName) => `
    <li data-id=${id}>
        <div class="top">
            <div class="priority-box">
                <div class="${priority}"><img class="svg" src="${check}" alt="checkmark"></div>
            </div>
            <div class="text">
                <div class="task-name">
                    <p>${taskName}</p>
                </div>
                <div class="description">
                    <p>${description}</p>
                </div>
            </div>
            <div class="icons">
                <div><img class="svg grayFilter" src="${event}" alt="options"></div>
                <div><img class="svg grayFilter" src="${edit}" alt="options"></div>
                <div><img class="svg grayFilter" src="${comment}" alt="options"></div>
            </div>
        </div>
        <div class="bottom">
            <div class="date">
                ${date}
            </div>
            <div class="project-name">
                ${projectName}
            </div>
        </div>
    </li>
    `;
    const overdue = document.querySelector('.today .overdue');
    
    function Task(priority = 4, taskName, description = '', date, projectName = 'inbox'){
        this.priority = priority,
        this.taskName = taskName,
        this.description = description,
        this.date = date,
        this.projectName = projectName  
    }

    const displayTasks = function(){
        allTasks.forEach(el => {
            overdue.innerHTML += `${_taskTemplate(el.id, _getPriorityClassName(el.priority), el.taskName, el.description, el.date, el.projectName)}`;
        });
    };

    const _getPriorityClassName = function(priority) {
        switch(priority){
            case 1:
                return 'prioOne';
            case 2:
                return 'prioTwo';
            case 3:
                return 'prioThree';
            case 4:
                return 'prioFour';
        }
    };

    return {
        displayTasks
    };
    
})();

export default tasks


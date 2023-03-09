import event from '../assets/icons/event.svg';
import edit from '../assets/icons/edit.svg';
import comment from '../assets/icons/comment.svg';
import check from '../assets/icons/check-bold.svg';
import projects from './projects';

const tasks = (function(){
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let allTasks = [
        {
            id: 1,
            priority: 1,
            taskName: 'Learn the basics with the easy',
            description: '',
            date: {
                year: 2023,
                month: 2,
                day: 15,
                weekDay: 5,
                repeat: '',
                time: `00:00`,
                toText: function(){
                    return `${days[this.weekDay]} ${this.day} ${months[this.month]} ${this.year} ${this.time === '00:00' ? '' : this.time}`;
                }
            },
            projectName: {element: projects.getAllProjects().at(0), sideProjectIndex: null},
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
    let newTask = null;
    
    function Task(priority, taskName, description, dueDate, projectName, labels){
        this.id = allTasks.length+1,
        this.creationDate = new Date(),
        this.priority = priority,
        this.taskName = taskName,
        this.description = description,
        this.dueDate = dueDate,
        this.projectName = projectName,
        this.labels = labels
    }

    Task.prototype.pushToTasks = function(){
        allTasks.push(this);
    };

    const createTask = function({priority, taskName, description, dueDate, projectName, labels}){
        newTask = new Task(priority, taskName, description, dueDate, projectName, labels); 
        newTask.pushToTasks();
        console.log(allTasks);
    };

    const displayTasks = function(){
        allTasks.forEach(el => {
            overdue.innerHTML += `${_taskTemplate(el.id, _getPriorityClassName(el.priority), el.taskName, el.description, el.date.toText(),
                 el.projectName.sideProjectIndex === null ? el.projectName.element.name : el.projectName.element.name+ '/'+el.projectName.element.sideProjects[el.projectName.sideProjectIndex].name)}`;
        });
    };
    
    const howManyTasksInSpecifiedDay = function(date){
        return allTasks.filter(task => task.date.year === date.getFullYear() && task.date.month === date.getMonth() && task.date.day === date.getDate());
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
        displayTasks,
        createTask,
        howManyTasksInSpecifiedDay
    };
    
})();

export default tasks


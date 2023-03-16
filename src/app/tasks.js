import edit from '../assets/icons/edit.svg';
import comment from '../assets/icons/comment.svg';
import check from '../assets/icons/check-bold.svg';
import projects from './projects';
import labelIcon from '../assets/icons/pricetag-outline.svg';
import calendarIcon from '../assets/icons/calendar-edit-svgrepo-com.svg';

const tasks = (function(){
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let allTasks = [];
    const taskTemplate = (id, priority, taskName, description, date, projectName, labelArr, isOverdue = false) => `
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
                <div><img class="svg grayFilter" src="${calendarIcon}" alt="options"></div>
                <div><img class="svg grayFilter" src="${edit}" alt="options"></div>
                <div><img class="svg grayFilter" src="${comment}" alt="options"></div>
            </div>
        </div>
        <div class="bottom">
            <div class="date${isOverdue ? ' overdue':''}">
                <img src="${calendarIcon}" alt="date">
                <p>${date}</p>
            </div>
            ${createLabelTemplate(labelArr)}
            <div class="project-name">
                ${projectName}
            </div>
        </div>
    </li>
    `;

    const createLabelTemplate = labelsArr => {
        let content = '';
        let template = labelName => `<div class="label"><img src="${labelIcon}" alt="label"> <p>${labelName}</p></div>`;
        labelsArr.forEach(label => content+=template(label.split('@')[1]));
        return content;
    };
    
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

    Task.prototype.getDateObj = function() {
        if(this.dueDate){
            let time = this.dueDate.time === ['00','00'] ? '': this.dueDate.time.split(':')
            return new Date(this.dueDate.year, this.dueDate.month, this.dueDate.day, ...time);
        }
    };

    Task.prototype.pushToTasks = function(){
        allTasks.push(this);
    };

    const createTask = (
        {
            priority = 4, 
            taskName, 
            description = '', 
            dueDate = null, 
            projectName = {element: projects.getAllProjects()[0], sideProjectIndex: null}, 
            labels = null
        }
    ) => new Task(priority, taskName, description, dueDate, projectName, labels).pushToTasks(); 
    
    const howManyTasksInSpecifiedDay = function(date){
        return allTasks.filter(task => task.dueDate && task.dueDate.year === date.getFullYear() && task.dueDate.month === date.getMonth() && task.dueDate.day === date.getDate());
    };

    const howManyTasksInProject = function(projectName){
        return allTasks.filter(task => task.projectName.element.name === projectName);
    };

    const getPriorityClassName = function(priority) {
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

    const getAllTasks = () => allTasks;

    const taskNameWithoutLabels = (taskName) => taskName.replace(/@[^ @]+/g, '').replace(/\s+/g, ' ');

    const _createTestTasks = (function(){
        const date1 = new Date(2023, 1, 20);
        const date2 = new Date(2023, 2, 10);
        const date3 = new Date(2023, 2, 11);

        createTask({taskName: 'Task 1'});
        createTask({taskName: 'Task 2'});
        createTask({
            priority: 1,
            taskName: 'Task3',
            description: 'some text some text',
            dueDate: {
                year: date1.getFullYear(),
                month: date1.getMonth(),
                day: date1.getDate(),
                weekDay: date1.getDay(),
                repeat: '',
                time: `${(date1.getHours()<10 ? '0':'')+date1.getHours()}:${(date1.getMinutes()<10 ? '0':'')+date1.getMinutes()}`,
                toText: function(){
                    return `${days[this.weekDay]} ${this.day} ${months[this.month]}${this.year === new Date().getFullYear() ? '':this.year}${this.time === '00:00' ? '' : this.time}`;
                }
            },
            projectName: {element: projects.getAllProjects()[0], subProjectIndex: null}, 
            labels: null
        });
        createTask({
            priority: 2,
            taskName: 'Task4',
            description: '',
            dueDate: {
                year: date2.getFullYear(),
                month: date2.getMonth(),
                day: date2.getDate(),
                weekDay: date2.getDay(),
                repeat: '',
                time: `${(date2.getHours()<10 ? '0':'')+date2.getHours()}:${(date2.getMinutes()<10 ? '0':'')+date2.getMinutes()}`,
                toText: function(){
                    return `${days[this.weekDay]} ${this.day} ${months[this.month]}${this.year === new Date().getFullYear() ? '':this.year}${this.time === '00:00' ? '' : this.time}`;
                }
            },
            projectName: {element: projects.getAllProjects()[1], subProjectIndex: 0}, 
            labels: null
        });
        createTask({
            priority: 3,
            taskName: 'Task5 @read',
            description: 'some text some textsome text some textsome text some textsome text some text',
            dueDate: {
                year: date3.getFullYear(),
                month: date3.getMonth(),
                day: date3.getDate(),
                weekDay: date3.getDay(),
                repeat: '',
                time: `${(date3.getHours()<10 ? '0':'')+date3.getHours()}:${(date3.getMinutes()<10 ? '0':'')+date3.getMinutes()}`,
                toText: function(){
                    return `${days[this.weekDay]} ${this.day} ${months[this.month]}${this.year === new Date().getFullYear() ? '':this.year}${this.time === '00:00' ? '' : this.time}`;
                }
            },
            projectName: {element: projects.getAllProjects()[0], subProjectIndex: null}, 
            labels: ['@read']
        });

    })();

    return {
        taskTemplate,
        createTask,
        howManyTasksInSpecifiedDay,
        getPriorityClassName,
        getAllTasks,
        taskNameWithoutLabels,
        howManyTasksInProject
    };
    
})();

export default tasks

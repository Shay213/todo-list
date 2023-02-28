import tasks from "./tasks";
import fullFlag from '../assets/icons/flag.svg';
import flagOutline from '../assets/icons/flag-outline.svg';

const addTaskBox = (function(){
    let elements = []; 
    let invokeOnce = true;
    const addBtn = document.querySelector('.add-task-container button.add-btn');
    const cancelBtn = document.querySelector('.add-task-container button.cancel-btn');
    const taskName = document.getElementById('task-name');
    const description = document.getElementById('description');
    let priority = null;
    let dueDate = null;
    let projectName = null;
    let labels = null;

    const _addTask = function(e){
        tasks.createTask({
            priority: priority,
            taskName: taskName.value,
            description: description.value,
            dueDate: 'dd',
            projectName: 'dasd',
            labels: 'df'
        });
    };

    const _checkTaskNameEmpty = function(){
        taskName.addEventListener('keyup', e => {
            if(taskName.value === ''){
                addBtn.style.cssText = 'opacity: 0.6; cursor:not-allowed;';
                addBtn.removeEventListener('click', _addTask);
            }
            else{
                addBtn.style.cssText = 'opacity: 1; cursor: pointer;';
                addBtn.addEventListener('click', _addTask, {once: true});
            }
        });
    };

    const _hideElWithClass = function(regex, removeClass){
        elements.forEach((el, i) => {
            if([...el.element.classList].find(el => regex.test(el))){
                el.element.classList.remove(`${removeClass}`);
                elements.splice(i, 1);
            }
        });
    };

    const _activateChoices = function(btn, element, className){
        let isPriorityPicker = element.classList.contains('priority-picker');
        let isDatePicker = element.classList.contains('date-picker');
        let isLabelPicker = element.classList.contains('label-picker');
        let isProjectPicker = element.classList.contains('project-picker');

        if(isPriorityPicker){
            const choices = [...element.children];
            choices.forEach(el => {
                el.addEventListener('click', e => {
                    priority = +el.dataset.priority;
                    choices.forEach(el2 => el2.classList.remove('checked'));
                    el.classList.add('checked');

                    switch(priority){
                        case 1:
                            btn.innerHTML = `<img class="svg" src="${fullFlag}" alt="more" 
                            style="filter: invert(44%) sepia(74%) saturate(3398%) hue-rotate(334deg) brightness(96%) contrast(83%);">Priority 1`;
                            break;
                        case 2:
                            btn.innerHTML = `<img class="svg" src="${fullFlag}" alt="more" 
                            style="filter: invert(70%) sepia(49%) saturate(4175%) hue-rotate(1deg) brightness(105%) contrast(92%);">Priority 2`;
                            break;
                        case 3:
                            btn.innerHTML = `<img class="svg" src="${fullFlag}" alt="more" 
                            style="filter: invert(45%) sepia(41%) saturate(982%) hue-rotate(178deg) brightness(102%) contrast(94%);">Priority 3`;
                            break;
                        case 4:
                            btn.innerHTML = `<img class="svg" src="${flagOutline}" alt="more">Priority`;
                            break;
                    }
                    _hideElWithClass(/priority-picker/, className);
                }, {once:true});
            });
        }
        else if(isDatePicker){

        }
        else if(isLabelPicker){

        }
        else if(isProjectPicker){

        }
    };

    const _showElement = function({btn, element, className}) {
        btn.addEventListener('click', show);
        
        function show(e){
            e.stopImmediatePropagation();
            if(e.currentTarget.classList.contains('btn')){
                _hideElWithClass(/date-picker|priority-picker|label-picker|project-picker/, className);
                _activateChoices(btn, element, className);
            }

            element.classList.add(`${className}`);
            if(!elements.find(el => el.element === element))
                elements.push({element, className});
        }

        if(invokeOnce){
            invokeOnce = false;
            _hideElements();
        }
    };

    const _hideElements = function(){
        document.addEventListener('click', e => {
            if(elements.length === 0) return;
            let lastEl = elements[elements.length-1].element;
            let lastClassName = elements[elements.length-1].className;
            
            if(!(e.target === lastEl || lastEl.contains(e.target))){
                lastEl.classList.remove(`${lastClassName}`);
                elements.pop();
            }
        });
    };

    const activateBtns = function(){
        _showElement({
            btn: document.querySelector('.add-task-container .flex-container > div:first-child .btn'),
            element: document.querySelector('.add-task-container .date-picker'),
            className: 'show'
        });
        _showElement({
                btn: document.querySelector('.top-panel .add-task'),
                element: document.querySelector('.add-task-container'),
                className: 'toggleAddTask'
        });
        _showElement({
            btn: document.querySelector('.add-task-container .flex-container > .priority .btn'),
            element: document.querySelector('.add-task-container .flex-container > .priority .priority-picker'),
            className: 'show'
        });
        _showElement({
            btn: document.querySelector('.add-task-container .flex-container > .label .btn'),
            element: document.querySelector('.add-task-container .label-picker'),
            className: 'show'
        });
        
        _showElement({
            btn: document.querySelector('.add-task-container .bottom .select-project'),
            element: document.querySelector('.add-task-container .bottom .project-picker'),
            className: 'show'
        });

        _checkTaskNameEmpty();
    };

    return {
        activateBtns,
    };
})();

export default addTaskBox
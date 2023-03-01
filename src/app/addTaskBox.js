import tasks from "./tasks";
import fullFlag from '../assets/icons/flag.svg';
import flagOutline from '../assets/icons/flag-outline.svg';
import tag from '../assets/icons/tag.svg';

const addTaskBox = (function(){
    let elements = []; 
    let invokeOnce = true;
    const addBtn = document.querySelector('.add-task-container button.add-btn');
    const cancelBtn = document.querySelector('.add-task-container button.cancel-btn');
    const taskName = document.getElementById('task-name');
    const description = document.getElementById('description');
    const labelBox = document.querySelector('.add-task-container .label-box');
    let priority = null;
    let dueDate = null;
    let projectName = null;
    let labels = null;
    let testLabels = ['cat', 'dog', 'horse', 'lion', 'bird', 'dino', 'driver', 'tree', 'carpet', 'ham', 'horny', 'lol', 'less', 'likely'];
    let currLabelsInsideInput = [];
    let labelData = {};
    let caretBeforeAtSign = [false, null];

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
        if(taskName.value === ''){
            addBtn.style.cssText = 'opacity: 0.6; cursor:not-allowed;';
            addBtn.removeEventListener('click', _addTask);
        }
        else{
            addBtn.style.cssText = 'opacity: 1; cursor: pointer;';
            addBtn.addEventListener('click', _addTask, {once: true});
        }
    };

    const _searchInExistingLabels = function(currString){
        let withoutAtSign = currString.split('@');
        let re = new RegExp(`${withoutAtSign[1]}`, 'g');
        return testLabels.filter(el => re.test(el));
    };

    taskName.addEventListener('keyup', lookForLabels);
    taskName.addEventListener('click', lookForLabels);

    function lookForLabels(e){
        _checkTaskNameEmpty();
        let currString = e.target.value;
        let caretPos = e.target.selectionStart;
        let stringBasedOnCaretPos = currString.slice(0, caretPos);
        let currLabel = stringBasedOnCaretPos.match(/@[^ @]*$/);

        if(caretBeforeAtSign[0] && e.key === 'Backspace') {
            const wrapper = document.querySelector('.add-task-container .top .inputs div:first-of-type');
            wrapper.removeChild(currLabelsInsideInput[caretBeforeAtSign[1]].redBox);
            currLabelsInsideInput.splice(caretBeforeAtSign[1],1);
            caretBeforeAtSign = [false, null];
        };
        
        if(currLabel){
            const matches = _searchInExistingLabels(currLabel[0]);
            _createLabelBoxContent(matches);
            _showLabelBox();
            const index = currLabelsInsideInput.findIndex(el => el.start === currLabel.index);
            //areWeInExistingLabel
            if(index === -1){
                currLabelsInsideInput.push({
                    start: currLabel.index,
                    end: currLabel.index + currLabel[0].length-1,
                    redBox: _createRedBox(currString.slice(0, currLabel.index), currLabel[0]),
                });
            }else{
                //update existing red box
                currLabelsInsideInput[index].start =  currLabel.index;
                currLabelsInsideInput[index].end = currLabel.index + currLabel[0].length-1;
                currLabelsInsideInput[index].redBox.style.width = `${_getTextWidth(currLabel[0], 'bold 0.95rem Arial')}px`;
                
                // if start and end equals 0 check for backspace
                if(currLabelsInsideInput[index].start === currLabelsInsideInput[index].end) caretBeforeAtSign = [true, index];
            }
        }else{
            _hideElWithClass(/label-box/, 'show');
        }
    };

    const _getTextWidth = function(text, font){
        const canvas = _getTextWidth.canvas || (_getTextWidth.canvas = document.createElement('canvas'));
        const ctx = canvas.getContext('2d');
        ctx.font = font;
        const metrics = ctx.measureText(text);
        return metrics.width;
    };

    const _createRedBox = function(startStr, currStr){
        const wrapper = document.querySelector('.add-task-container .top .inputs div:first-of-type');
        const el = document.createElement('div');
        const left = _getTextWidth(startStr, 'bold 0.95rem Arial') + 2;
        const txtWidth = _getTextWidth(currStr, 'bold 0.95rem Arial');
        
        el.classList.add('label-added');
        el.style.cssText = `left: ${left}px; width: ${txtWidth}px`;
        wrapper.appendChild(el);
        return el;
    };

    const _createLabelBoxContent = function(matches){
        const getTemplate = (labelName) => `<div><img src="${tag}" alt="label"><p>${labelName}</p></div>`;
        let content = '';
        matches.forEach(el => {
            content += getTemplate(el);
        });
        labelBox.innerHTML = content;
    };

    const _showLabelBox = function(){
        labelBox.classList.add('show');
        elements.push({element: labelBox, className: 'show'});
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
                _hideElWithClass(/date-picker|priority-picker|label-picker|project-picker|label-box/, className);
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
            
            if(!(e.target === lastEl || lastEl.contains(e.target) || (e.target.id === 'task-name') && lastEl.classList.contains('label-box'))){
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
    };

    return {
        activateBtns,
    };
})();

export default addTaskBox
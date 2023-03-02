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
    let isLabelBoxVisible = false;
    let activeLabelBoxItem;
    let currLabelBasedOnCaretPos;

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

    const _searchInExistingLabels = function(currString, fullMatch){
        let withoutAtSign = currString.split('@');
        let re;
        fullMatch ? re = new RegExp(`^${withoutAtSign[1]}$`, 'i') : re = new RegExp(`^${withoutAtSign[1]}`, 'i');
        return testLabels.filter(el => re.test(el));
    };

    taskName.addEventListener('input', lookForLabels);
    taskName.addEventListener('click', lookForLabels);
    document.addEventListener('keydown', arrowMoveInsideLabelBox);
    //disable arrow up/down inside input field
    taskName.addEventListener('keydown', e => {
        if(e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
    });

    function lookForLabels(e){
        _checkTaskNameEmpty();
        
        let currString;
        let caretPos;
        if(e === taskName){
            currString = e.value;
            caretPos = e.selectionStart;
        }else{
            currString = e.target.value;
            caretPos = e.target.selectionStart;
        }

        const wrapper = document.querySelector('.add-task-container .top .inputs div:first-of-type');
        const allRedBoxes = wrapper.querySelectorAll('.label-added');
        const stringBasedOnCaretPos = currString.slice(0, caretPos);
        const currLabel = stringBasedOnCaretPos.match(/@[^ @]*$/);
        const re = /@[^ @]+/g;
        let allMatches = [];
        let match;

        allRedBoxes.forEach(el => wrapper.removeChild(el));
        while ((match = re.exec(currString)) != null) {
            allMatches.push({
                str: match[0],
                start: match.index,
                end: (match.index + match[0].length-1),
                redBox: _createRedBox(currString.slice(0, match.index), match[0])
            });
        }
        
        if(currLabel){
            const matches = _searchInExistingLabels(currLabel[0], false);
            const fullMatch = _searchInExistingLabels(currLabel[0], true);
            currLabelBasedOnCaretPos = currLabel[0];
            
            _createLabelBoxContent(matches, fullMatch, currLabel[0]);
            _showLabelBox();
            _labelBoxChooseByClicking(currLabel[0]);
        }else{
            _hideElWithClass(/label-box/, 'show');
            isLabelBoxVisible = false;
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
        // +2 because of padding
        const left = _getTextWidth(startStr, 'bold 0.95rem Arial') + 2;
        const txtWidth = _getTextWidth(currStr, 'bold 0.95rem Arial');
        
        el.classList.add('label-added');
        el.style.cssText = `left: ${left}px; width: ${txtWidth}px`;
        wrapper.appendChild(el);
        return el;
    };

    const _createLabelBoxContent = function(matches, fullMatch, currStr){
        const getTemplate = (labelName) => `<div><img src="${tag}" alt="label"><p>${labelName}</p></div>`;
        let content = '';
        
        if(fullMatch.length != 0) labelBox.innerHTML = content;
        else{
            if(currStr != '@') content += `<div><p>To create label <span>${currStr}</span> click here or press (space, @, enter)</p></div>`;

            matches.forEach(el => {
                content += getTemplate(el);
            });
            labelBox.innerHTML = content;
            let span = labelBox.querySelector('span');
            if(span) span.style.color = '#f87171';
        }
    };

    const _showLabelBox = function(){
        const [...labelElements] = labelBox.querySelectorAll('div');

        labelBox.classList.add('show');
        elements.push({element: labelBox, className: 'show'});

        isLabelBoxVisible = true;
        labelBox.scrollTop = 0;
        activeLabelBoxItem = 0;
        if(labelElements.length != 0){
            let currActive = labelElements.find(el => el.classList.contains('active'));
            if(currActive) currActive.classList.remove('active');
            labelElements[0].classList.add('active');
        }
    };

    function arrowMoveInsideLabelBox(e){
        const labelElements = labelBox.querySelectorAll('div');
        if(labelElements.length === 0 )return;
        if((e.key === 'Enter' || e.key === 'ArrowUp' || e.key === 'ArrowDown') && isLabelBoxVisible){
            
            if(e.key === 'Enter'){
                _labelBoxChoice(labelElements[activeLabelBoxItem], currLabelBasedOnCaretPos);
            }else{
                labelElements[activeLabelBoxItem].classList.remove('active');
                e.key === 'ArrowUp' ? activeLabelBoxItem-- : activeLabelBoxItem++;
                if(activeLabelBoxItem < 0) activeLabelBoxItem = 0;
                if(activeLabelBoxItem > labelElements.length-1) activeLabelBoxItem = labelElements.length-1;
                
                labelElements[activeLabelBoxItem].classList.add('active');
                scroll();

                function scroll(){
                    let elHeight = labelElements[0].offsetHeight;
                    let scrollTop = labelBox.scrollTop;
                    let viewport = scrollTop + labelBox.offsetHeight;
                    let elOffset = elHeight * activeLabelBoxItem;

                    if(elOffset < scrollTop || (elOffset + elHeight) > viewport){
                        labelBox.scrollTop = elOffset;
                    }
                }
            }
        }
    }

    const _labelBoxChooseByClicking = function(currLab){
        const labelElements = labelBox.querySelectorAll('div');
        
        labelElements.forEach(el => {
            el.addEventListener('click', func, {once: true});
            function func(e){
                _labelBoxChoice(el,currLab);
                taskName.focus();
            }
        });
    };

    const _labelBoxChoice = function(el, currLab){
        let currLabWithoutAtSign = currLab.split('@')[1];
        if(/span/g.test(el.innerHTML)){
            // add to existing labels
            testLabels.push(currLabWithoutAtSign);
            taskName.value += ' ';
            _hideElWithClass(/label-box/, 'show');
            isLabelBoxVisible = false;
            lookForLabels(taskName);
        }else{
            let restOfExistingLabel = el.innerText.replace(currLabWithoutAtSign, '');
            taskName.value += restOfExistingLabel + ' ';
            _hideElWithClass(/label-box/, 'show');
            isLabelBoxVisible = false;
            lookForLabels(taskName);
        }
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
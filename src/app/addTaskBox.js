import tasks from "./tasks";
import fullFlag from '../assets/icons/flag.svg';
import flagOutline from '../assets/icons/flag-outline.svg';
import tag from '../assets/icons/tag.svg';
import checkMark from '../assets/icons/check-bold.svg';

const addTaskBox = (function(){
    let showHideBtn = []; 
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
    // inside taskName
    let caretPos;
    let allUniqueMatchesInsideTaskName = [];
    let isLabelRepeated;

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
    document.addEventListener('click', activateButtons);
    //disable arrow up/down inside input field
    taskName.addEventListener('keydown', e => {
        if(e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
    });

    function lookForLabels(e){
        _checkTaskNameEmpty();
        
        let currString;
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
            if(allMatches.find(el => el.str === match[0])) isLabelRepeated = true;
            else{
                isLabelRepeated = false;
                allMatches.push({
                    str: match[0],
                    start: match.index,
                    end: (match.index + match[0].length-1),
                    redBox: _createRedBox(currString.slice(0, match.index), match[0])
                });
            }
        }

        const allMatchesOnlyStr = allMatches.map(el => el.str);
        const unique = allMatchesOnlyStr.filter((el, i, arr) => arr.indexOf(el) === i);
        allUniqueMatchesInsideTaskName = unique;
        
        if(currLabel){
            const matches = _searchInExistingLabels(currLabel[0], false);
            const fullMatch = _searchInExistingLabels(currLabel[0], true);
            currLabelBasedOnCaretPos = currLabel[0];
            
            _createLabelBoxContent(matches, fullMatch, currLabel[0], isLabelRepeated);
            _showLabelBox();
            _labelBoxChooseByClicking(currLabel[0]);
        }else{
            labelBox.classList.remove('show');
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

    const _createLabelBoxContent = function(matches, fullMatch, currStr, repeated){
        const getTemplate = (labelName) => `<div><img src="${tag}" alt="label"><p>${labelName}</p></div>`;
        let content = '';
        
        if(repeated) labelBox.innerHTML = `<div><p>Label ${fullMatch} is already included</p></div>`;
        else if(fullMatch.length != 0) labelBox.innerHTML = content;
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
        if(isLabelRepeated) return;

        let currLabWithoutAtSign = currLab.split('@')[1];
        if(/span/g.test(el.innerHTML)){
            // add to existing labels
            testLabels.push(currLabWithoutAtSign);
            taskName.value += ' ';
            labelBox.classList.remove('show');
            isLabelBoxVisible = false;
            lookForLabels(taskName);
        }else{
            let restOfExistingLabel = el.innerText.replace(currLabWithoutAtSign, '');
            taskName.value += restOfExistingLabel + ' ';
            labelBox.classList.remove('show');
            isLabelBoxVisible = false;
            lookForLabels(taskName);
        }
    };

    const _hideElWithClass = function(regex, removeClass){
        showHideBtn.forEach((item, i) => {
            if([...item.el.classList].find(classN => regex.test(classN))){
                item.el.classList.remove(removeClass);
                item.active = false;
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
            const labelPicker = document.querySelector('.add-task-container .top .label .label-picker');
            //Create label picker content
            createLabelPickerContent();
            //put labels inside input
            putLabelsInsideInput();
            //hide label picker

            function putLabelsInsideInput(){
                const options = document.querySelectorAll('.add-task-container .top .label .label-picker > div');
                const spliceIn = (originalStr, strToAdd, pos) => [originalStr.slice(0, pos), strToAdd, originalStr.slice(pos)].join('');

                options.forEach(el => {
                    el.addEventListener('click', e => {
                        if(!el.classList.contains('checked')){
                            el.classList.add('checked');
                            taskName.value = spliceIn(taskName.value, `@${el.innerText} `, caretPos);
                        }else{
                            const re = new RegExp(`@${el.innerText}`);
                            taskName.value = taskName.value.replace(re, '');
                            el.classList.remove('checked');
                        }
                        taskName.focus();
                        lookForLabels(taskName);
                    });
                });
            }

            function createLabelPickerContent(){
                const getTemplate = (labelName, checked = '') => `
                <div class="${checked}">
                    <img src="${tag}" alt="label">
                    <p>${labelName}</p>
                    <div class="check-box">
                        <img src="${checkMark}" alt="check">
                    </div>
                </div>
                `;
                let content = '';

                testLabels.forEach(el => {
                    allUniqueMatchesInsideTaskName.find(item => item.slice(1) === el) ? content += getTemplate(el, 'checked') : content += getTemplate(el);
                });
                labelPicker.innerHTML = content;
            }
        }
        else if(isProjectPicker){

        }
    };

    function activateButtons(e){
        const isAnyOfButtonsClicked = showHideBtn.findIndex(item => e.target === item.btn || item.btn.contains(e.target));
        const isBtnToggleElClicked = showHideBtn.find(item => e.target === item.el || item.el.contains(e.target));
        
        if(isAnyOfButtonsClicked != -1){
            const i = isAnyOfButtonsClicked;
            const itemsWithSameLayer = showHideBtn.filter(item => item.layer === showHideBtn[i].layer && item != showHideBtn[i]);

            hideItemsOnTheSameLayer();
            showClickedItem();
            
            function showClickedItem(){
                showHideBtn[i].active = true;
                _activateChoices(showHideBtn[i].btn, showHideBtn[i].el, showHideBtn[i].className);
                showHideBtn[i].el.classList.toggle(showHideBtn[i].className);
            }

            function hideItemsOnTheSameLayer(){
                itemsWithSameLayer.forEach(item => {
                    item.active = false;
                    item.el.classList.remove(item.className);
                });
            }
        }
        else{
            const onlyActive = showHideBtn.filter(item => item.active);
            
            if(onlyActive.length > 0){
                const sortByLayer = onlyActive.sort((a,b) => b.layer - a.layer);

                if(isBtnToggleElClicked != sortByLayer[0] && !(labelBox.classList.contains('show') && sortByLayer[0].layer === 1)){
                    sortByLayer[0].active = false;
                    sortByLayer[0].el.classList.remove(sortByLayer[0].className);
                }   
            }
        }

        // Hide label-box 
        if(e.target != taskName && e.target != labelBox && !labelBox.contains(e.target)){
            labelBox.classList.remove('show');
        }
    }
    
    const _addToShowHideBtn = ({el, btn, className, layer, active}) => showHideBtn.push({el, btn, className, layer, active});

    const getAllButtons = function(){
        _addToShowHideBtn({
            el: document.querySelector('.add-task-container .date-picker'),
            btn: document.querySelector('.add-task-container .flex-container > div:first-child .btn'),
            className: 'show',
            layer: 2,
            active: false
        });

        _addToShowHideBtn({
            el: document.querySelector('.add-task-container .flex-container > .priority .priority-picker'),
            btn: document.querySelector('.add-task-container .flex-container > .priority .btn'),
            className: 'show',
            layer: 2,
            active: false
        });
        
        _addToShowHideBtn({
            el: document.querySelector('.add-task-container .label-picker'),
            btn: document.querySelector('.add-task-container .flex-container > .label .btn'),
            className: 'show',
            layer: 2,
            active: false
        });

        _addToShowHideBtn({
            el: document.querySelector('.add-task-container .bottom .project-picker'),
            btn: document.querySelector('.add-task-container .bottom .select-project'),
            className: 'show',
            layer: 2,
            active: false
        });

        _addToShowHideBtn({
            el: document.querySelector('.add-task-container'),
            btn: document.querySelector('.top-panel .add-task'),
            className: 'toggleAddTask',
            layer: 1,
            active: false
        });
    };

    return {
        getAllButtons,
    };
})();

export default addTaskBox
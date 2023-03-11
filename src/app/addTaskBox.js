import tasks from "./tasks";
import fullFlag from '../assets/icons/flag.svg';
import flagOutline from '../assets/icons/flag-outline.svg';
import tag from '../assets/icons/tag.svg';
import checkMark from '../assets/icons/check-bold.svg';
import light from '../assets/icons/invalid.svg';
import lightFull from '../assets/icons/valid.svg';
import eventAvailable from '../assets/icons/event_available.svg';
import eventBusy from '../assets/icons/event_busy.svg';
import moreSvg from '../assets/icons/more.svg';
import projects from "./projects";
import inboxIcon from '../assets/icons/inbox.svg';
import existingLabels from './labels';

const addTaskBox = (function(){
    const createData = (arr, container) => {
        const data = {
            showHideBtn: arr,
            addTaskContainer: container,
            addBtn: container.querySelector('button.add-btn'),
            cancelBtn: container.querySelector('button.cancel-btn'),
            taskName: container.querySelector('.inputs div:first-child input'),
            description: container.querySelector('.inputs input:nth-child(2)'),
            labelBox: container.querySelector('.label-box'),
            expandArrow: container.querySelector('.date-picker .input-validation-text .date-req img'),
            dateReqText: container.querySelector('.date-picker .input-validation-text > div:nth-of-type(2) ul'),
            priority: null,
            dueDate: null,
            projectName: null,
            labels: null,
            isLabelBoxVisible: false,
            activeLabelBoxItem: null,
            currLabelBasedOnCaretPos: null,
            dateUtilFunctions: null,
            // inside taskName
            caretPos: null,
            allUniqueMatchesInsideTaskName: [],
            isLabelRepeated: null,
        };
        return data;
    };

    const data = createData([], document.querySelector('#content > .add-task-container'));
    
    const _addTask = function(e){
        tasks.createTask({
            priority: data.priority,
            taskName: data.taskName.value,
            description: data.description.value,
            dueDate: data.dueDate,
            projectName: data.projectName,
            labels: data.labels
        });
        
        data.showHideBtn.forEach(item => {
            item.el.active = false;
            item.el.classList.remove(item.className);
        });
        _resetValuesAddTaskContainer();
    };

    const _checkTaskNameEmpty = function(){
        if(data.taskName.value === ''){
            data.addBtn.style.cssText = 'opacity: 0.6; cursor:not-allowed;';
            data.addBtn.removeEventListener('click', _addTask);
        }
        else{
            data.addBtn.style.cssText = 'opacity: 1; cursor: pointer;';
            data.addBtn.addEventListener('click', _addTask, {once: true});
        }
    };

    const runEvents = () => {
        data.taskName.addEventListener('input', lookForLabels);
        data.taskName.addEventListener('click', lookForLabels);
        document.addEventListener('keydown', arrowMoveInsideLabelBox);
        document.addEventListener('click', activateButtons);
        //disable arrow up/down inside input field
        data.taskName.addEventListener('keydown', e => {
            if(e.key === 'ArrowUp' || e.key === 'ArrowDown') e.preventDefault();
        });
        data.expandArrow.addEventListener('click', e => data.dateReqText.classList.toggle('show'));
    };

    runEvents();

    function lookForLabels(e){
        _checkTaskNameEmpty();
        
        let currString;
        if(e === data.taskName){
            currString = e.value;
            data.caretPos = e.selectionStart;
        }else{
            _hideElWithClass(/label-picker|priority-picker|date-picker|project-picker/, 'show');
            currString = e.target.value;
            data.caretPos = e.target.selectionStart;
        }

        const wrapper = data.addTaskContainer.querySelector('.top .inputs div:first-of-type');
        const allRedBoxes = wrapper.querySelectorAll('.label-added');
        const stringBasedOnCaretPos = currString.slice(0, data.caretPos);
        const currLabel = stringBasedOnCaretPos.match(/@[^ @]*$/);
        const re = /@[^ @]+/g;
        let allMatches = [];
        let match;
        
        allRedBoxes.forEach(el => wrapper.removeChild(el));
        while ((match = re.exec(currString)) != null) {
            if(allMatches.find(el => el.str.toLowerCase() === match[0].toLowerCase())) data.isLabelRepeated = true;
            else{
                data.isLabelRepeated = false;
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
        data.allUniqueMatchesInsideTaskName = unique;
        data.labels = unique;
        
        if(currLabel){
            const matches = existingLabels.isInExistingLabels(currLabel[0], false);
            const fullMatch = existingLabels.isInExistingLabels(currLabel[0], true);
            data.currLabelBasedOnCaretPos = currLabel[0];
            
            _createLabelBoxContent(matches, fullMatch, currLabel[0], data.isLabelRepeated);
            _showLabelBox();
            _labelBoxChooseByClicking(currLabel[0]);
        }else{
            data.labelBox.classList.remove('show');
            data.isLabelBoxVisible = false;
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
        const wrapper = data.addTaskContainer.querySelector('.top .inputs div:first-of-type');
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
        
        if(repeated) data.labelBox.innerHTML = `<div><p>Label ${fullMatch} is already included</p></div>`;
        else if(fullMatch.length != 0) data.labelBox.innerHTML = content;
        else{
            if(currStr != '@') content += `<div><p>To create label <span>${currStr}</span> click here or press (space, @, enter)</p></div>`;

            matches.forEach(el => {
                content += getTemplate(el);
            });
            data.labelBox.innerHTML = content;
            let span = data.labelBox.querySelector('span');
            if(span) span.style.color = '#f87171';
        }
    };

    const _showLabelBox = function(){
        const [...labelElements] = data.labelBox.querySelectorAll('div');

        data.labelBox.classList.add('show');
        data.isLabelBoxVisible = true;
        data.labelBox.scrollTop = 0;
        data.activeLabelBoxItem = 0;

        if(labelElements.length != 0){
            let currActive = labelElements.find(el => el.classList.contains('active'));
            if(currActive) currActive.classList.remove('active');
            labelElements[0].classList.add('active');
        }
    };

    function arrowMoveInsideLabelBox(e){
        const labelElements = data.labelBox.querySelectorAll('div');
        if(labelElements.length === 0 )return;
        if((e.key === 'Enter' || e.key === 'ArrowUp' || e.key === 'ArrowDown') && data.isLabelBoxVisible){
            
            if(e.key === 'Enter'){
                _labelBoxChoice(labelElements[data.activeLabelBoxItem], data.currLabelBasedOnCaretPos);
            }else{
                labelElements[data.activeLabelBoxItem].classList.remove('active');
                e.key === 'ArrowUp' ? data.activeLabelBoxItem-- : data.activeLabelBoxItem++;
                if(data.activeLabelBoxItem < 0) data.activeLabelBoxItem = 0;
                if(data.activeLabelBoxItem > labelElements.length-1) data.activeLabelBoxItem = labelElements.length-1;
                
                labelElements[data.activeLabelBoxItem].classList.add('active');
                scroll();

                function scroll(){
                    let elHeight = labelElements[0].offsetHeight;
                    let scrollTop = data.labelBox.scrollTop;
                    let viewport = scrollTop + data.labelBox.offsetHeight;
                    let elOffset = elHeight * data.activeLabelBoxItem;

                    if(elOffset < scrollTop || (elOffset + elHeight) > viewport){
                        data.labelBox.scrollTop = elOffset;
                    }
                }
            }
        }
    }

    const _labelBoxChooseByClicking = function(currLab){
        const labelElements = data.labelBox.querySelectorAll('div');
        
        labelElements.forEach(el => {
            el.addEventListener('click', func, {once: true});
            function func(e){
                _labelBoxChoice(el,currLab);
            }
        });
    };

    const _labelBoxChoice = function(el, currLab){
        if(data.isLabelRepeated) return;

        let currLabWithoutAtSign = currLab.split('@')[1];
        if(/span/g.test(el.innerHTML)){
            // add to existing labels
            existingLabels.names.push(currLabWithoutAtSign);
            data.taskName.value += ' ';
            data.labelBox.classList.remove('show');
            data.isLabelBoxVisible = false;
            lookForLabels(data.taskName);
        }else{
            let restOfExistingLabel = el.innerText.replace(currLabWithoutAtSign, '');
            data.taskName.value += restOfExistingLabel + ' ';
            data.labelBox.classList.remove('show');
            data.isLabelBoxVisible = false;
            lookForLabels(data.taskName);
        }
    };

    const _hideElWithClass = function(regex, removeClass){ 
        // prevent add task container from disappearing
        document.removeEventListener('click', activateButtons);
        data.showHideBtn.forEach((item, i) => {
            if([...item.el.classList].find(classN => regex.test(classN))){
                item.el.classList.remove(removeClass);
                item.active = false;
            }
        });
        setTimeout(() => document.addEventListener('click', activateButtons), 100);
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
                    data.priority = +el.dataset.priority;
                    choices.forEach(el2 => el2.classList.remove('checked'));
                    el.classList.add('checked');

                    switch(data.priority){
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
            const dueDateBtn = data.addTaskContainer.querySelector('.due-date');
            const input = data.addTaskContainer.querySelector('.due-date .date-picker .type-date input');
            const inputValidationText = data.addTaskContainer.querySelector('.date-picker .input-validation-text');
            const dateReqText = data.addTaskContainer.querySelector('.date-picker .input-validation-text > div:nth-of-type(2) ul');
            const anyTasksText = inputValidationText.querySelector('div:first-of-type div p:nth-of-type(2)');
            const fullDateTypedInInput = inputValidationText.querySelector('div:first-of-type div p:first-of-type');
            const eventIcon = inputValidationText.querySelector('div:first-of-type img');
            const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const today = new Date();
            const quickBtns = data.addTaskContainer.querySelectorAll('.due-date .date-picker .pick-icon > div');
            const formatDate = (date, repeat = '') => {
                return {
                    year: date.getFullYear(),
                    month: date.getMonth(),
                    day: date.getDate(),
                    weekDay: date.getDay(),
                    repeat: repeat,
                    time: `${(date.getHours()<10 ? '0':'')+date.getHours()}:${(date.getMinutes()<10 ? '0':'')+date.getMinutes()}`,
                    toText: function(){
                        return `${days[this.weekDay]} ${this.day} ${months[this.month]} ${this.year} ${this.time === '00:00' ? '' : this.time}`;
                    }
                }
            };
            
            updateQuickBtnsSideDate();
            dateReqText.classList.remove('show');
            inputValidationText.style.display = 'none';

            validateInputDate();
            createCalendar();
            input.addEventListener('focus', e => inputValidationText.style.display = 'block');
            quickBtns.forEach(el => el.addEventListener('click', changeDateBtn));
            
            
            data.dateUtilFunctions = {
                formatDateFun: (date, repeat = '') => formatDate(date, repeat),
                styleDueDateBtnFun: (date) => styleDueDateBtn(date),
            };

            function changeDateBtn(e){
                let date;
                const icon = data.addTaskContainer.querySelector('.date-picker .type-date .icon img');
                switch(e.currentTarget.querySelector('span').innerText){
                    case 'Today':
                        date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        _hideElWithClass(/date-picker/, 'show');
                        styleDueDateBtn(date);
                        data.dueDate = formatDate(date);
                        input.value = 'Today';
                        break;
                    case 'Tomorrow':
                        date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
                        _hideElWithClass(/date-picker/, 'show');
                        styleDueDateBtn(date);
                        data.dueDate = formatDate(date);
                        input.value = 'Tomorrow';
                        break;
                    case 'Next week':
                        date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
                        _hideElWithClass(/date-picker/, 'show');
                        styleDueDateBtn(date);
                        data.dueDate = formatDate(date);
                        input.value = days[data.dueDate.weekDay];
                        break;
                    case 'Next weekend':
                        let howManyDaysToWeekend = today.getDay() === 6 || today.getDay === 7 ? 7 : 6-today.getDay(); 
                        date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+howManyDaysToWeekend);
                        _hideElWithClass(/date-picker/, 'show');
                        styleDueDateBtn(date);
                        data.dueDate = formatDate(date);
                        input.value = days[data.dueDate.weekDay];
                        break;
                    case 'No date':
                        styleDueDateBtn(null);
                        data.dueDate = null;
                        _hideElWithClass(/date-picker/, 'show');
                        input.value = '';

                        icon.src = `${light}`;
                        icon.style.filter = 'invert(23%) sepia(2%) saturate(3000%) hue-rotate(349deg) brightness(87%) contrast(82%)';
                        eventIcon.src = eventBusy;
                        fullDateTypedInInput.innerText = 'No results';
                        anyTasksText.innerText = '';
                        break;
                }
                if(e.currentTarget.querySelector('span').innerText != 'No date'){
                    icon.src = `${lightFull}`;
                    icon.style.filter = 'invert(80%) sepia(61%) saturate(1076%) hue-rotate(338deg) brightness(102%) contrast(97%)';
                    eventIcon.src = eventAvailable;
                    fullDateTypedInInput.innerText = data.dueDate.toText();
                    anyTasksText.innerText = `${tasks.howManyTasksInSpecifiedDay(date).length} tasks`;
                }
            }

            function updateQuickBtnsSideDate(){
                quickBtns.forEach(el => {
                    const p = el.querySelector('p');
                    const span = el.querySelector('span');
                    switch(span.innerText){
                        case 'Today':
                            p.innerText = `${days[today.getDay()]}`;
                            break;
                        case 'Tomorrow':
                            p.innerText = `${days[new Date(today.getFullYear(), today.getMonth(), today.getDate()+1).getDay()]}`;
                            break;
                        case 'Next week':
                            let nextW = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
                            p.innerText = `${days[nextW.getDay()]} ${nextW.getDate()} ${months[nextW.getMonth()]}`;
                            break;
                        case 'Next weekend':
                            let howManyDaysToWeekend = today.getDay() === 6 || today.getDay === 7 ? 7 : 6-today.getDay(); 
                            let nextWEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate()+howManyDaysToWeekend);
                            p.innerText = `${days[nextWEnd.getDay()]} ${nextWEnd.getDate()} ${months[nextWEnd.getMonth()]}`;
                            break;
                        case 'No date':
                            break;
                    }
                });
            }

            function validateInputDate(){
                const icon = data.addTaskContainer.querySelector('.date-picker .type-date .icon img');
                const currDay = today.getDate();  // 1-31
                const currMonth = today.getMonth();  // 0-11
                const currYear = today.getFullYear(); 
                

                input.addEventListener('input', e => {
                    // match day depending on current month, month is not specified by user
                    const re1 = /^((?:(?=1 )(1 (0?[1-9]|[12]\d))|((?=[024679]|11)(([024679]|11) (0?[1-9]|[12]\d|3[01]))|(([358]|10|12) (0?[1-9]|[12]\d|30))))( (0[0-9]|1[0-9]|2[0-3])((:[0-5][0-9])?){2})?)$/;
                    // full input validation, month is required, and special keywords are available
                    const re2 = /^((([0-9]{4}[\/\- ])?((?:(?=(0?2|Feb)[\/\- ])((0?2|Feb)[\/\- ](0?[1-9]|[12]\d))|((?=(0?[13578]|10|12|(Jan|Mar|May|Jul|Aug|Oct|Dec)[\/\- ]))((0?[13578]|10|12|(Jan|Mar|May|Jul|Aug|Oct|Dec))[\/\- ](0?[1-9]|[12]\d|3[01]))|(((0?[469]|11|(Apr|Jul|Sep|Nov))[\/\- ])(0?[1-9]|[12]\d|30)))))( (0[0-9]|1[0-9]|2[0-3])((:[0-5][0-9])?){2})?)|((Mon|Tue|Wed|Thu|Fri|Sat|Sun|Today|Weekend|Tomorrow|Day after tomorrow|Next week|in \d?\d?\d days|in \d?\d weeks|(in (([1-9]\d? months)|(1 month)))|(every (Day|Mon|Tue|Wed|Thu|Fri|Sat|Sun|Second|Third|Fourth|Fifth|sixth)))( (0[0-9]|1[0-9]|2[0-3])((:[0-5][0-9])?){2})?))$/i;
        
                    const inputVal = e.target.value;
                    if(re2.test(inputVal)){
                        icon.src = `${lightFull}`;
                        icon.style.filter = 'invert(80%) sepia(61%) saturate(1076%) hue-rotate(338deg) brightness(102%) contrast(97%)';
                        eventIcon.src = eventAvailable;
                        const values = inputVal.split(/[\-\/ ]/);
                        const month = (value) => /[a-z]+/i.test(value) ? months.findIndex(el => (new RegExp(`${value}`, 'i')).test(el))+1 :                               
                                                                        value.charAt(0) === '0' ? value.charAt(1) : value;
                        const day = (value) => value.charAt(0) === '0' ? value.charAt(1) : value;
                        const time = (value) => value ? value.split(':') : '';
                        let date;
                        let repeatDays = '';
                        
                        //console.log(values);
                        if(values[0].length === 4 && !/[a-z]/i.test(values[0])) date = new Date(values[0], month(values[1])-1, day(values[2]), ...time(values[3]));
                        else{
                            if(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i.test(inputVal)){
                                date = getNextDayOfTheWeek(values[0]);
                                if(values[1]) date.setHours(...time(values[1]));
                            }
                            else if(/Today/i.test(inputVal)){
                                date = today;
                                date.setHours(0, 0, 0, 0);
                                if(values[1]) date.setHours(...time(values[1]));
                            }
                            else if(/Weekend/i.test(inputVal)){
                                date = getNextDayOfTheWeek('sat');
                                if(values[1]) date.setHours(...time(values[1]));
                            }
                            else if(/^Tomorrow/i.test(inputVal)){
                                let weekDay = today.getDay()+1 > 6 ? 0 : today.getDay()+1;
                                date = getNextDayOfTheWeek(days[weekDay]);
                                if(values[1]) date.setHours(...time(values[1]));
                            }
                            else if(/Day after tomorrow/i.test(inputVal)){
                                let weekDay = (today.getDay()+2) % 7;
                                date = getNextDayOfTheWeek(days[weekDay]);
                                if(values[3]) date.setHours(...time(values[3]));
                            }
                            else if(/Next week/i.test(inputVal)){
                                let weekDay = today.getDay();
                                date = getNextDayOfTheWeek(days[weekDay]);
                                if(values[2]) date.setHours(...time(values[2]));
                            }
                            else if(/in/i.test(inputVal)){
                                date = new Date(currYear, currMonth, currDay+values[1]);
                                if(values[3]) date.setHours(...time(values[3]));
                            }
                            else if(/every/i.test(inputVal)){
                                if(/day/i.test(values[1])){
                                    date = today;
                                    date.setHours(0, 0, 0, 0);
                                }
                                else if(/(Mon|Tue|Wed|Thu|Fri|Sat|Sun)/i.test(values[1])){
                                    date = getNextDayOfTheWeek(values[1]);
                                }else{
                                    let keywords = ['second', 'third', 'fourth', 'fifth', 'sixth'];
                                    date = new Date(currYear, currMonth, currDay+keywords.findIndex(el => (new RegExp(`${values[1]}`,'i')).test(el))+2);
                                }
                                if(values[2]) date.setHours(...time(values[2]));
                                repeatDays = values[1];
                            }
                            else{
                                date = new Date(currYear, month(values[0])-1, day(values[1]), ...time(values[2]));
                            }
                            

                            function getNextDayOfTheWeek(dayName, excludeToday = true, refDate = new Date()) {
                                const dayOfWeek = ["sun","mon","tue","wed","thu","fri","sat"]
                                                  .indexOf(dayName.slice(0,3).toLowerCase());
                                if (dayOfWeek < 0) return;
                                refDate.setHours(0,0,0,0);
                                refDate.setDate(refDate.getDate() + +!!excludeToday + 
                                                (dayOfWeek + 7 - refDate.getDay() - +!!excludeToday) % 7);
                                return refDate;
                            }
                        }

                        if(date < today){
                            invalidInput('Only future dates are accepted');
                        }
                        else{
                            let formattedDate;
                            repeatDays.length === 0 ? formattedDate=formatDate(date) : formattedDate=formatDate(date, repeatDays);
                            fullDateTypedInInput.innerText = formattedDate.toText();
                            anyTasksText.innerText = `${tasks.howManyTasksInSpecifiedDay(date).length} tasks`;
                            data.dueDate = formattedDate;

                            input.addEventListener('focusout', e => styleDueDateBtn(date),{once:true});
                        } 
                    }
                    else if(re1.test(`${currMonth} ${inputVal}`)){
                        icon.src = `${lightFull}`;
                        icon.style.filter = 'invert(80%) sepia(61%) saturate(1076%) hue-rotate(338deg) brightness(102%) contrast(97%)';
                        eventIcon.src = eventAvailable;
                        const values = inputVal.split(' ');
                        const day = values[0].charAt(0) === '0' ? values[0].charAt(1) : values[0];
                        const time = values[1] ? values[1].split(':') : '';
                        
                        let date = new Date(currYear, currMonth, day, ...time);
                        if(date < today && !(+day === +currDay && time === '')) date.setFullYear(currYear+1);
                        let formattedDate = formatDate(date);
                        fullDateTypedInInput.innerText = formattedDate.toText();
                        anyTasksText.innerText = `${tasks.howManyTasksInSpecifiedDay(date).length} tasks`;
                        data.dueDate = formattedDate;
                        
                        input.addEventListener('focusout', e => styleDueDateBtn(date),{once:true});                                                      
                    }
                    else invalidInput('No results');

                    function invalidInput(txt){
                        input.addEventListener('focusout', e => styleDueDateBtn(null),{once:true});
                        data.dueDate = null;
                        icon.src = `${light}`;
                        icon.style.filter = 'invert(23%) sepia(2%) saturate(3000%) hue-rotate(349deg) brightness(87%) contrast(82%)';
                        eventIcon.src = eventBusy;
                        fullDateTypedInInput.innerText = `${txt}`;
                        anyTasksText.innerText = '';
                    }
                });
            }

            function createCalendar(){
                const today = new Date();
                let currentMonth = today.getMonth();
                let currentYear = today.getFullYear();
                const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
   
                const wrapper = data.addTaskContainer.querySelector('.date-picker .calendar .months');
                wrapper.innerHTML = '';
                const currMonthEl = data.addTaskContainer.querySelector('.date-picker .calendar .curr-month');
                const calendar = data.addTaskContainer.querySelector('.date-picker .calendar');
                const nav = data.addTaskContainer.querySelector('.date-picker .calendar .nav');
                const navUl = nav.querySelector('ul');
                const navUlElements = navUl.querySelectorAll('li');
                const previousBtn = data.addTaskContainer.querySelector('.date-picker .calendar .nav .icons > div:first-of-type');
                const goToStartBtn = data.addTaskContainer.querySelector('.date-picker .calendar .nav .icons > div:nth-of-type(2)');
                const nextBtn = data.addTaskContainer.querySelector('.date-picker .calendar .nav .icons > div:last-of-type');
                const input = data.addTaskContainer.querySelector('.due-date .date-picker .type-date input');
                calendar.scrollTop = 0;

                calendar.addEventListener('scroll', scrolling);
                previousBtn.addEventListener('click', previous);
                goToStartBtn.addEventListener('click', goToStart);
                nextBtn.addEventListener('click', next);

                currMonthEl.innerHTML = months[currentMonth] + ' ' + currentYear;
                showMonth(currentMonth, currentYear);
                showNextMonth();
                const calendarUl = data.addTaskContainer.querySelector('.date-picker .calendar .months ul');
                let currUl = calendarUl;

                function scrolling(e){
                    calendar.scrollTop === 0 ? nav.style.cssText = 'border: none;':nav.style.cssText = 'border-bottom: 1px solid gray;';
                    
                    if(currUl.nextElementSibling && isScrolledIntoView(currUl.nextElementSibling.nextElementSibling)){
                        showNextMonth();
                        currUl = currUl.nextElementSibling.nextElementSibling;
                    }
                    else if(currUl.previousElementSibling && isScrolledIntoView(currUl.previousElementSibling.previousElementSibling)){
                        currUl = currUl.previousElementSibling.previousElementSibling;
                    }
                }

                function goToStart(){
                    nav.style.cssText = 'border: none;';
                    calendar.removeEventListener('scroll', scrolling);
                    currUl = calendarUl;
                    currUl.scrollIntoView({behavior: 'smooth', block: 'end'});
                    setTimeout(() => calendar.addEventListener('scroll', scrolling),500);
                }
                
                function next(){  
                    nav.style.cssText = 'border-bottom: 1px solid gray;';
                    calendar.removeEventListener('scroll', scrolling);
                    if(!currUl.nextElementSibling.nextElementSibling.nextElementSibling){
                        showNextMonth();
                        showNextMonth();
                    }
                
                    let nextUl = currUl.nextElementSibling.nextElementSibling;
                    nextUl.scrollIntoView({behavior: "smooth", block: 'nearest'});
                    currUl = nextUl;
                    setTimeout(() => calendar.addEventListener('scroll', scrolling),500);
                }

                function previous(){
                    if(currUl.previousElementSibling){
                        calendar.removeEventListener('scroll', scrolling);
                        let prevUl = currUl.previousElementSibling.previousElementSibling;
                        prevUl.scrollIntoView({behavior: 'smooth', block: 'end'});
                        currUl = prevUl;
                        if(!currUl.previousElementSibling) nav.style.cssText = 'border: none;';
                        setTimeout(() => calendar.addEventListener('scroll', scrolling),500);
                    }
                }

                function isScrolledIntoView(elem){
                    const parentViewTop = calendar.scrollTop;
                    const parentViewBottom = parentViewTop + calendar.offsetHeight;

                    const elemTop = elem.offsetTop;
                    const elemBottom = elemTop + elem.offsetHeight

                    return ((elemBottom <= parentViewBottom) && (elemTop >= parentViewTop));
                }

                function showNextMonth(){
                    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
                    currentMonth = (currentMonth + 1) % 12;

                    const div = document.createElement('div');
                    div.innerText = months[currentMonth];
                    wrapper.appendChild(div);

                    showMonth(currentMonth, currentYear);
                }

                function showMonth(month, year){
                    const firstDay = (new Date(year, month)).getDay();
                    const daysInMonth = 32 - new Date(year, month, 32).getDate();
                    const ul = document.createElement('ul');
                    let date = 1;

                    for(let i=0; i<6; i++){
                        //create individual cells, and filling them up with data
                        for(let j=0; j<7; j++){
                            if(i === 0 && j < firstDay-1){
                                const li = document.createElement('li');
                                li.innerText = '';
                                li.classList.add('past');
                                ul.appendChild(li);
                            }
                            else if(date > daysInMonth) break;
                            else{
                                const li = document.createElement('li');
                                li.innerText = date;
                                if(date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) li.classList.add('today');
                                else if(new Date(year, month, date) < today) li.classList.add('past');
                                else if(j === 6 || j === 5) li.classList.add('weekend'); 

                                if(!li.classList.contains('past')){
                                    li.addEventListener('mouseover', e => {
                                        navUl.innerHTML = '';
                                        const p = document.createElement('p');
                                        let date2 = new Date(year, month, li.innerText);

                                        p.innerText = `${days[date2.getDay()]} ${date2.getDate()} ${months[date2.getMonth()]} ${year === today.getFullYear() ? '' : year}`;
                                        p.innerText += ` - ${tasks.howManyTasksInSpecifiedDay(date2).length} tasks due`;
                                        p.style.cssText = 'grid-area: 1 / 1 / 2 / -1; align-self: center; justify-self: center; font-size: .85rem; color: #737373';
                                        navUl.appendChild(p);
                                    });
                                    li.addEventListener('mouseout', e => {
                                        navUl.innerHTML = '';
                                        navUlElements.forEach(el => navUl.appendChild(el));
                                    });
                                    li.addEventListener('click', e => {
                                        let date2 = new Date(year, month, e.currentTarget.innerText);
                                        data.dateUtilFunctions.styleDueDateBtnFun(date2);
                                        data.dueDate = data.dateUtilFunctions.formatDateFun(date2);
                                        _hideElWithClass(/date-picker/, 'show');
                                        input.value = data.dueDate.toText();
                                    });
                                }
                                ul.appendChild(li);
                                date++;
                            }
                        }
                    }
                    wrapper.appendChild(ul);
                }
            }

            function styleDueDateBtn(date){
                const btn = dueDateBtn.querySelector('.btn');
                const img = btn.querySelector('img');
                const today = new Date();
                const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
                const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
                
                if(date === null){
                    btn.innerText = 'Set due date';
                    btn.insertBefore(img, btn.firstChild);
                    btn.style.color = '#737373';
                    img.style.filter = 'invert(48%) sepia(2%) saturate(8%) hue-rotate(334deg) brightness(92%) contrast(92%)';
                }
                else if(date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()){
                    btn.innerText = 'Today';
                    btn.insertBefore(img, btn.firstChild);
                    btn.style.color = '#059669';
                    img.style.filter = 'invert(39%) sepia(96%) saturate(520%) hue-rotate(115deg) brightness(92%) contrast(96%)';
                }
                else if(date.getDate() === tomorrow.getDate() && date.getMonth() === tomorrow.getMonth() && date.getFullYear() === tomorrow.getFullYear()){
                    btn.innerText = 'Tomorrow';
                    btn.insertBefore(img, btn.firstChild);
                    btn.style.color = '#fbbf24';
                    img.style.filter = 'invert(84%) sepia(47%) saturate(2119%) hue-rotate(339deg) brightness(104%) contrast(97%)';
                }
                else if(date.getDate() <= nextWeek.getDate() && date.getMonth() <= nextWeek.getMonth() && date.getFullYear() === nextWeek.getFullYear()){
                    btn.innerText = `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
                    btn.insertBefore(img, btn.firstChild);
                    btn.style.color = '#7e22ce';
                    img.style.filter = 'invert(16%) sepia(67%) saturate(6573%) hue-rotate(272deg) brightness(84%) contrast(92%)';
                }
                else{
                    btn.innerText = `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear() === today.getFullYear() ? '' : date.getFullYear()}`;
                    btn.insertBefore(img, btn.firstChild);
                    btn.style.color = '#737373';
                    img.style.filter = 'invert(48%) sepia(2%) saturate(8%) hue-rotate(334deg) brightness(92%) contrast(92%)';
                }
            }
        }
        else if(isLabelPicker){
            const labelPicker = data.addTaskContainer.querySelector('.top .label .label-picker');
            //Create label picker content
            createLabelPickerContent();
            //put labels inside input
            putLabelsInsideInput();

            function putLabelsInsideInput(){
                const options = data.addTaskContainer.querySelectorAll('.top .label .label-picker > div');
                const spliceIn = (originalStr, strToAdd, pos) => [originalStr.slice(0, pos), strToAdd, originalStr.slice(pos)].join('');

                options.forEach(el => {
                    el.addEventListener('click', e => {
                        if(!el.classList.contains('checked')){
                            el.classList.add('checked');
                            data.taskName.value = spliceIn(data.taskName.value, `@${el.innerText} `, data.caretPos);
                        }else{
                            const re = new RegExp(`@${el.innerText}`, 'gi');
                            data.taskName.value = data.taskName.value.replace(re, '');
                            data.taskName.value = data.taskName.value.trim();
                            el.classList.remove('checked');
                        }
                        data.taskName.focus();
                        lookForLabels(data.taskName);
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

                existingLabels.names.forEach(el => {
                    data.allUniqueMatchesInsideTaskName.find(item => item.slice(1) === el) ? content += getTemplate(el, 'checked') : content += getTemplate(el);
                });
                labelPicker.innerHTML = content;
            }
        }
        else if(isProjectPicker){
            const selectProjectBtn = data.addTaskContainer.querySelector('.bottom .select-project');
            const projectPicker = data.addTaskContainer.querySelector('.project-picker');
            const inbox = projectPicker.querySelector('.inbox');
            const mainProjects = projectPicker.querySelectorAll('ul figcaption');
            const sideProjects = projectPicker.querySelectorAll('ul li');
            const allProjects = [inbox, ...mainProjects, ...sideProjects];
            const [...projectChecked] = projectPicker.querySelectorAll('img.projectChecked');
            const input = projectPicker.querySelector('input');
            input.value = '';
            allProjects.forEach(el => el.style.removeProperty('display'));

            mainProjects.forEach(el => el.querySelector('.bullet').style.cssText = `background-color: ${projects.getAllProjects().find(proj => el.innerText === proj.name).colorValue};`);

            allProjects.forEach(el => {
                el.addEventListener('click', e => {
                    const clickedProject = e.target.innerText;
                    projects.getAllProjects().forEach(el2 => {
                        if(el2.name === clickedProject){
                            selectProjectBtn.innerHTML = el2.getTemplateHTML() + `<img src="${moreSvg}" alt="expand">`;
                            data.projectName = {element: el2, subProjectIndex: null};
                        }
                        else{
                            el2.subProjects.forEach((sub, i) => {
                                if(sub.name === clickedProject){
                                    selectProjectBtn.innerHTML = el2.getTemplateHTML(i) + `<img src="${moreSvg}" alt="expand">`;
                                    data.projectName = {element: el2, subProjectIndex: i};                                 
                                }
                            });
                        }
                    });
                    const img = e.currentTarget.querySelector('img.projectChecked');
                    projectChecked.forEach(el => el.classList.contains('active') ? el.classList.remove('active') : el);
                    img.classList.add('active');
                    _hideElWithClass(/project-picker/, 'show');
                },{once: true});
            });

            input.addEventListener('input', e => {
                const re = new RegExp(`${e.target.value}`, 'i');
                allProjects.forEach(el => {
                    re.test(el.innerText) ? el.style.display = 'flex' : el.style.display = 'none'; 
                });
            });
        }
    };

    const _resetValuesAddTaskContainer = function(){
        data.priority = null;
        data.dueDate = null;
        data.projectName = null;
        data.labels = null;
        data.taskName.value = '';
        data.description.value = '';
        data.allUniqueMatchesInsideTaskName = [];

        // reset due date btn and date picker
        const dueDateBtn = data.addTaskContainer.querySelector('.top .due-date'); 
        const input = data.addTaskContainer.querySelector('.due-date .date-picker .type-date input');
        const btn = dueDateBtn.querySelector('.btn');
        const img = btn.querySelector('img');
        const inputValidationText = data.addTaskContainer.querySelector('.date-picker .input-validation-text');
        const anyTasksText = inputValidationText.querySelector('div:first-of-type div p:nth-of-type(2)');
        const fullDateTypedInInput = inputValidationText.querySelector('div:first-of-type div p:first-of-type');
        const eventIcon = inputValidationText.querySelector('div:first-of-type img');
        const icon = data.addTaskContainer.querySelector('.date-picker .type-date .icon img');
        input.value = '';
        btn.innerText = 'Today';
        btn.insertBefore(img, btn.firstChild);
        btn.style.color = '#059669';
        img.style.filter = 'invert(39%) sepia(96%) saturate(520%) hue-rotate(115deg) brightness(92%) contrast(96%)';
        icon.src = `${light}`;
        icon.style.filter = 'invert(23%) sepia(2%) saturate(3000%) hue-rotate(349deg) brightness(87%) contrast(82%)';
        eventIcon.src = eventBusy;
        fullDateTypedInInput.innerText = 'No results';
        anyTasksText.innerText = '';

        // reset project picker and select project btn
        const selectProjBtn = data.addTaskContainer.querySelector('.bottom .select-project');
        const projectChecked = data.addTaskContainer.querySelectorAll('.bottom .project-picker img.projectChecked');
        const inboxChecked = data.addTaskContainer.querySelector('.bottom .project-picker .inbox img.projectChecked');

        selectProjBtn.innerHTML = `<img src="${inboxIcon}" alt="select-project"><p>Inbox</p><img src="${moreSvg}" alt="expand">`;
        projectChecked.forEach(el => el.classList.contains('active') ? el.classList.remove('active') : el);
        inboxChecked.classList.add('active');

        // reset priority picker
        const priorityBtn = data.addTaskContainer.querySelector('.top .priority .btn');
        const choices = data.addTaskContainer.querySelectorAll('.top .priority .priority-picker > div');

        choices.forEach(el => el.classList.contains('prio4') ? el.classList.add('checked') : el.classList.remove('checked'));
        priorityBtn.innerHTML = `<img class="svg" src="${flagOutline}" alt="more">Priority`;

        // reset label picker
        const options = data.addTaskContainer.querySelectorAll('.top .label .label-picker > div');
        options.forEach(el => el.classList.contains('checked') ? el.classList.remove('checked') : el);
        
        // remove red boxes inside task name input
        const wrapper = data.addTaskContainer.querySelector('.top .inputs div:first-of-type');
        const allRedBoxes = wrapper.querySelectorAll('.label-added');     
        allRedBoxes.forEach(el => wrapper.removeChild(el));

        // reset add task btn
        data.addBtn.style.cssText = 'opacity: 0.6; cursor:not-allowed;';
        data.addBtn.removeEventListener('click', _addTask);
    };

    const _discardCurrentTaskAlert = function(hideTaskBox){
        const alertBox = document.querySelector('.alert-box');
        const cancel = document.querySelector('.alert-box .buttons button:first-of-type');
        const xBtn = document.querySelector('.alert-box .icons .close');
        const discardBtn = document.querySelector('.alert-box .buttons button:last-of-type');
        const filterBg = document.querySelector('.filter-background');
        alertBox.style.display = 'flex';
        filterBg.style.display = 'block';
                
        document.removeEventListener('click', activateButtons);
        document.addEventListener('click', alertBoxDecision);

        function alertBoxDecision(e){
            if((e.target != alertBox && !alertBox.contains(e.target)) || e.target === cancel || (e.target === xBtn || xBtn.contains(e.target))){ 
                alertBox.style.display = 'none';
                filterBg.style.display = 'none';
                document.removeEventListener('click', alertBoxDecision);
                document.addEventListener('click', activateButtons);
                return;
            }
            else if(e.target === discardBtn){
                alertBox.style.display = 'none';
                filterBg.style.display = 'none';
                hideTaskBox();
                document.removeEventListener('click', alertBoxDecision);
                document.addEventListener('click', activateButtons);
            }
        }
    };

    function activateButtons(e){
        const isAnyOfButtonsClicked = data.showHideBtn.findIndex(item => e.target === item.btn || item.btn.contains(e.target));
        const isBtnToggleElClicked = data.showHideBtn.find(item => e.target === item.el || (item.el.contains(e.target)&&e.target != data.cancelBtn));
        
        if(isAnyOfButtonsClicked != -1){
            const i = isAnyOfButtonsClicked;
            const itemsWithSameLayer = data.showHideBtn.filter(item => item.layer === data.showHideBtn[i].layer && item != data.showHideBtn[i]);
            
            hideItemsOnTheSameLayer();
            showClickedItem();
            
            function showClickedItem(){
                data.showHideBtn[i].active = true;
                _activateChoices(data.showHideBtn[i].btn, data.showHideBtn[i].el, data.showHideBtn[i].className);
                data.showHideBtn[i].el.classList.toggle(data.showHideBtn[i].className);
            }

            function hideItemsOnTheSameLayer(){
                itemsWithSameLayer.forEach(item => {
                    item.active = false;
                    item.el.classList.remove(item.className);
                });
            }
        }
        else{
            const onlyActive = data.showHideBtn.filter(item => item.active);
            
            if(onlyActive.length > 0){
                const sortByLayer = onlyActive.sort((a,b) => b.layer - a.layer);
                
                if(isBtnToggleElClicked != sortByLayer[0] && !(data.labelBox.classList.contains('show') && sortByLayer[0].layer === 1)){
                    if((sortByLayer[0].el === data.addTaskContainer && data.taskName.value != '')||
                    (sortByLayer[0].el === data.addTaskContainer && data.taskName.value != '' && e.target === data.cancelBtn)){
                        _discardCurrentTaskAlert(() => {
                            _resetValuesAddTaskContainer();
                            sortByLayer[0].active = false;
                            sortByLayer[0].el.classList.remove(sortByLayer[0].className);
                        });
                    }
                    else{
                        if((sortByLayer[0].el === data.addTaskContainer)||(sortByLayer[0].el === data.addTaskContainer && e.target === data.cancelBtn)) 
                            _resetValuesAddTaskContainer();
                        sortByLayer[0].active = false;
                        sortByLayer[0].el.classList.remove(sortByLayer[0].className);
                    }
                }   
            }
        }

        // Hide label-box 
        if(e.target != data.taskName && e.target != data.labelBox && !data.labelBox.contains(e.target)){
            data.labelBox.classList.remove('show');
        }
    }

    const getAllButtons = function(includeContainer){
        data.showHideBtn.push({
            el: data.addTaskContainer.querySelector('.date-picker'),
            btn: data.addTaskContainer.querySelector('.flex-container > div:first-child .btn'),
            className: 'show',
            layer: 2,
            active: false
        });

        data.showHideBtn.push({
            el: data.addTaskContainer.querySelector('.flex-container > .priority .priority-picker'),
            btn: data.addTaskContainer.querySelector('.flex-container > .priority .btn'),
            className: 'show',
            layer: 2,
            active: false
        });
        
        data.showHideBtn.push({
            el: data.addTaskContainer.querySelector('.label-picker'),
            btn: data.addTaskContainer.querySelector('.flex-container > .label .btn'),
            className: 'show',
            layer: 2,
            active: false
        });

        data.showHideBtn.push({
            el: data.addTaskContainer.querySelector('.bottom .project-picker'),
            btn: data.addTaskContainer.querySelector('.bottom .select-project'),
            className: 'show',
            layer: 2,
            active: false
        });

        if(includeContainer){
            data.showHideBtn.push({
                el: data.addTaskContainer,
                btn: document.querySelector('.top-panel .add-task'),
                className: 'toggleAddTask',
                layer: 1,
                active: false
            });
        }

        data.showHideBtn.push({
            el: data.addTaskContainer.querySelector('.date-picker .add-time .time-picker'),
            btn: data.addTaskContainer.querySelector('.date-picker .add-time p'),
            className: 'show',
            layer: 3,
            active: false
        });
    };

    getAllButtons(true);

    return{
        getAllButtons,
    };

})();

export default addTaskBox
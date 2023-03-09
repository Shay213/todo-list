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

const addTaskBox = (function(){
    let showHideBtn = []; 
    const addBtn = document.querySelector('.add-task-container button.add-btn');
    const cancelBtn = document.querySelector('.add-task-container button.cancel-btn');
    const taskName = document.getElementById('task-name');
    const description = document.getElementById('description');
    const labelBox = document.querySelector('.add-task-container .label-box');
    const expandArrow = document.querySelector('.add-task-container .date-picker .input-validation-text .date-req img');
    const dateReqText = document.querySelector('.add-task-container .date-picker .input-validation-text > div:nth-of-type(2) ul');
    let priority = null;
    let dueDate = null;
    let projectName = null;
    let labels = null;
    let testLabels = ['cat', 'dog', 'horse', 'lion', 'bird', 'dino', 'driver', 'tree', 'carpet', 'ham', 'horny', 'lol', 'less', 'likely'];
    let isLabelBoxVisible = false;
    let activeLabelBoxItem;
    let currLabelBasedOnCaretPos;
    let dateUtilFunctions;
    // inside taskName
    let caretPos;
    let allUniqueMatchesInsideTaskName = [];
    let isLabelRepeated;

    const _addTask = function(e){
        tasks.createTask({
            priority: priority,
            taskName: taskName.value,
            description: description.value,
            dueDate: dueDate,
            projectName: projectName,
            labels: labels
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

    expandArrow.addEventListener('click', e => dateReqText.classList.toggle('show'));

    function lookForLabels(e){
        _checkTaskNameEmpty();
        
        let currString;
        if(e === taskName){
            currString = e.value;
            caretPos = e.selectionStart;
        }else{
            _hideElWithClass(/label-picker/, 'show');
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
            if(allMatches.find(el => el.str.toLowerCase() === match[0].toLowerCase())) isLabelRepeated = true;
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
        labels = unique;
        
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
        // prevent add task container from disappearing
        document.removeEventListener('click', activateButtons);
        showHideBtn.forEach((item, i) => {
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
            const dueDateBtn = document.querySelector('.add-task-container .due-date');
            const input = document.getElementById('type-due-date');
            const inputValidationText = document.querySelector('.add-task-container .date-picker .input-validation-text');
            const dateReqText = document.querySelector('.add-task-container .date-picker .input-validation-text > div:nth-of-type(2) ul');
            const anyTasksText = inputValidationText.querySelector('div:first-of-type div p:nth-of-type(2)');
            const fullDateTypedInInput = inputValidationText.querySelector('div:first-of-type div p:first-of-type');
            const eventIcon = inputValidationText.querySelector('div:first-of-type img');
            const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
            const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
            const today = new Date();
            const quickBtns = document.querySelectorAll('.add-task-container .due-date .date-picker .pick-icon > div');
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
            
            
            dateUtilFunctions = {
                formatDateFun: (date, repeat = '') => formatDate(date, repeat),
                styleDueDateBtnFun: (date) => styleDueDateBtn(date),
            };

            function changeDateBtn(e){
                let date;
                switch(e.currentTarget.querySelector('span').innerText){
                    case 'Today':
                        date = new Date(today.getFullYear(), today.getMonth(), today.getDate());
                        styleDueDateBtn(date);
                        dueDate = formatDate(date);
                        _hideElWithClass(/date-picker/, 'show');
                        input.value = dueDate.toText();
                        break;
                    case 'Tomorrow':
                        date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+1);
                        styleDueDateBtn(date);
                        dueDate = formatDate(date);
                        _hideElWithClass(/date-picker/, 'show');
                        input.value = dueDate.toText();
                        break;
                    case 'Next week':
                        date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);
                        styleDueDateBtn(date);
                        dueDate = formatDate(date);
                        _hideElWithClass(/date-picker/, 'show');
                        input.value = dueDate.toText();
                        break;
                    case 'Next weekend':
                        let howManyDaysToWeekend = today.getDay() === 6 || today.getDay === 7 ? 7 : 6-today.getDay(); 
                        date = new Date(today.getFullYear(), today.getMonth(), today.getDate()+howManyDaysToWeekend);
                        styleDueDateBtn(date);
                        dueDate = formatDate(date);
                        _hideElWithClass(/date-picker/, 'show');
                        input.value = dueDate.toText();
                        break;
                    case 'No date':
                        styleDueDateBtn(null);
                        dueDate = null;
                        _hideElWithClass(/date-picker/, 'show');
                        input.value = '';
                        break;
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
                const icon = document.querySelector('.add-task-container .date-picker .type-date .icon img');
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
                            dueDate = formattedDate;

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
                        dueDate = formattedDate;
                        
                        input.addEventListener('focusout', e => styleDueDateBtn(date),{once:true});                                                      
                    }
                    else invalidInput('No results');

                    function invalidInput(txt){
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
   
                const wrapper = document.querySelector('.add-task-container .date-picker .calendar .months');
                wrapper.innerHTML = '';
                const currMonthEl = document.querySelector('.add-task-container .date-picker .calendar .curr-month');
                const calendar = document.querySelector('.add-task-container .date-picker .calendar');
                const nav = document.querySelector('.add-task-container .date-picker .calendar .nav');
                const navUl = nav.querySelector('ul');
                const navUlElements = navUl.querySelectorAll('li');
                const previousBtn = document.querySelector('.add-task-container .date-picker .calendar .nav .icons > div:first-of-type');
                const goToStartBtn = document.querySelector('.add-task-container .date-picker .calendar .nav .icons > div:nth-of-type(2)');
                const nextBtn = document.querySelector('.add-task-container .date-picker .calendar .nav .icons > div:last-of-type');
                const input = document.getElementById('type-due-date');
                calendar.scrollTop = 0;

                calendar.addEventListener('scroll', scrolling);
                previousBtn.addEventListener('click', previous);
                goToStartBtn.addEventListener('click', goToStart);
                nextBtn.addEventListener('click', next);

                currMonthEl.innerHTML = months[currentMonth] + ' ' + currentYear;
                showMonth(currentMonth, currentYear);
                showNextMonth();
                const calendarUl = document.querySelector('.add-task-container .date-picker .calendar .months ul');
                let currUl = calendarUl;


                function scrolling(e){
                    calendar.scrollTop === 0 ? nav.style.cssText = 'border: none;':nav.style.cssText = 'border-bottom: 1px solid gray;';
                    
                    if(isScrolledIntoView(currUl.nextElementSibling.nextElementSibling)){
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
                                else if(date < today.getDate()) li.classList.add('past');
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
                                        dateUtilFunctions.styleDueDateBtnFun(date2);
                                        dueDate = dateUtilFunctions.formatDateFun(date2);
                                        _hideElWithClass(/date-picker/, 'show');
                                        input.value = dueDate.toText();
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
            const labelPicker = document.querySelector('.add-task-container .top .label .label-picker');
            //Create label picker content
            createLabelPickerContent();
            //put labels inside input
            putLabelsInsideInput();

            function putLabelsInsideInput(){
                const options = document.querySelectorAll('.add-task-container .top .label .label-picker > div');
                const spliceIn = (originalStr, strToAdd, pos) => [originalStr.slice(0, pos), strToAdd, originalStr.slice(pos)].join('');

                options.forEach(el => {
                    el.addEventListener('click', e => {
                        if(!el.classList.contains('checked')){
                            el.classList.add('checked');
                            taskName.value = spliceIn(taskName.value, `@${el.innerText} `, caretPos);
                        }else{
                            const re = new RegExp(`@${el.innerText}`, 'gi');
                            taskName.value = taskName.value.replace(re, '');
                            taskName.value = taskName.value.trim();
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
            const selectProjectBtn = document.querySelector('.add-task-container .bottom .select-project');
            const projectPicker = document.querySelector('.add-task-container .project-picker');
            const inbox = projectPicker.querySelector('.inbox');
            const mainProjects = projectPicker.querySelectorAll('ul figcaption');
            const sideProjects = projectPicker.querySelectorAll('ul li');
            const allProjects = [inbox, ...mainProjects, ...sideProjects];
            const [...projectChecked] = projectPicker.querySelectorAll('img.projectChecked');
            const input = projectPicker.querySelector('input');
            input.value = '';
            allProjects.forEach(el => el.style.removeProperty('display'));

            allProjects.forEach(el => {
                el.addEventListener('click', e => {
                    const clickedProject = e.target.innerText;
                    projects.getAllProjects().forEach(el2 => {
                        if(el2.name === clickedProject){
                            selectProjectBtn.innerHTML = el2.getTemplateHTML() + `<img src="${moreSvg}" alt="expand">`;
                            document.documentElement.style.setProperty('--bullet-filter', `${el2.filterValue}`);
                            projectName = {element: el2, sideProjectIndex: null};
                        }
                        else{
                            el2.subProjects.forEach((sub, i) => {
                                if(sub.name === clickedProject){
                                    selectProjectBtn.innerHTML = el2.getTemplateHTML(i) + `<img src="${moreSvg}" alt="expand">`;
                                    document.documentElement.style.setProperty('--bullet-filter', `${el2.filterValue}`);  
                                    projectName = {element: el2, sideProjectIndex: i};                                 
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
        priority = null;
        dueDate = null;
        projectName = null;
        labels = null;
        taskName.value = '';
        description.value = '';
        allUniqueMatchesInsideTaskName = [];

        // reset due date btn and date picker
        const dueDateBtn = document.querySelector('.add-task-container .top .due-date'); 
        const input = document.getElementById('type-due-date');
        const btn = dueDateBtn.querySelector('.btn');
        const img = btn.querySelector('img');
        input.value = '';
        btn.innerText = 'Today';
        btn.insertBefore(img, btn.firstChild);
        btn.style.color = '#059669';
        img.style.filter = 'invert(39%) sepia(96%) saturate(520%) hue-rotate(115deg) brightness(92%) contrast(96%)';

        // reset project picker and select project btn
        const selectProjBtn = document.querySelector('.add-task-container .bottom .select-project');
        const projectChecked = document.querySelectorAll('.add-task-container .bottom .project-picker img.projectChecked');
        const inboxChecked = document.querySelector('.add-task-container .bottom .project-picker .inbox img.projectChecked');

        selectProjBtn.innerHTML = `<img src="${inboxIcon}" alt="select-project"><p>Inbox</p><img src="${moreSvg}" alt="expand">`;
        projectChecked.forEach(el => el.classList.contains('active') ? el.classList.remove('active') : el);
        inboxChecked.classList.add('active');

        // reset priority picker
        const priorityBtn = document.querySelector('.add-task-container .top .priority .btn');
        const choices = document.querySelectorAll('.add-task-container .top .priority .priority-picker > div');

        choices.forEach(el => el.classList.contains('prio4') ? el.classList.add('checked') : el.classList.remove('checked'));
        priorityBtn.innerHTML = `<img class="svg" src="${flagOutline}" alt="more">Priority`;

        // reset label picker
        const options = document.querySelectorAll('.add-task-container .top .label .label-picker > div');
        options.forEach(el => el.classList.contains('checked') ? el.classList.remove('checked') : el);
        
        // remove red boxes inside task name input
        const wrapper = document.querySelector('.add-task-container .top .inputs div:first-of-type');
        const allRedBoxes = wrapper.querySelectorAll('.label-added');     
        allRedBoxes.forEach(el => wrapper.removeChild(el));

        // reset add task btn
        addBtn.style.cssText = 'opacity: 0.6; cursor:not-allowed;';
        addBtn.removeEventListener('click', _addTask);
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
        const isAnyOfButtonsClicked = showHideBtn.findIndex(item => e.target === item.btn || item.btn.contains(e.target));
        const isBtnToggleElClicked = showHideBtn.find(item => e.target === item.el || (item.el.contains(e.target)&&e.target != cancelBtn));
        
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
                    if((sortByLayer[0].el.classList.contains('add-task-container') && taskName.value != '')||
                    (sortByLayer[0].el.classList.contains('add-task-container') && taskName.value != '' && e.target === cancelBtn)){
                        _discardCurrentTaskAlert(() => {
                            _resetValuesAddTaskContainer();
                            sortByLayer[0].active = false;
                            sortByLayer[0].el.classList.remove(sortByLayer[0].className);
                        });
                    }
                    else{
                        if((sortByLayer[0].el.classList.contains('add-task-container'))||
                        (sortByLayer[0].el.classList.contains('add-task-container') && e.target === cancelBtn)) _resetValuesAddTaskContainer();
                        sortByLayer[0].active = false;
                        sortByLayer[0].el.classList.remove(sortByLayer[0].className);
                    }
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

        _addToShowHideBtn({
            el: document.querySelector('.add-task-container .date-picker .add-time .time-picker'),
            btn: document.querySelector('.add-task-container .date-picker .add-time p'),
            className: 'show',
            layer: 3,
            active: false
        });
    };

    return {
        getAllButtons,
    };
})();

export default addTaskBox
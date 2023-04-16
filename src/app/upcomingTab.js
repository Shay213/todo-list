import { createTaskHTMLContent } from "./createTaskHTMLContent";
import tasks from "./tasks";
import { startOfWeek, isEqual } from "date-fns";

const upcomingTab = (function(){
    const upcomingContainer = document.querySelector('.upcoming');
    const mainContainer = document.querySelector('.main-container');
    const taskAndWrapperTemplate = (date, taskTemplate) =>`
    <ul>
        <figcaption>
            <h4>${date}</h4>
        </figcaption>
        ${taskTemplate}
    </ul>
    <div class="add-task">
        <div>+</div>
        <p>Add task</p>
    </div> `;
    const tasksWithDate = tasks.getAllTasks().filter(task => task.dueDate);
    const overdueTasks = arr => arr.filter(task => {
        if(task.getDateObj()){
            let date = new Date();
            date.setHours(0,0,0,0);
            return task.getDateObj() < date;
        }else{
            return false;
        }
    });
    const allTasksInDayContent = (year, month, day) => {
        let content = '';
        tasksWithDate.forEach(task => {
            if(day === task.dueDate.day && month === task.dueDate.month && year === task.dueDate.year){
                content += createTaskHTMLContent(task);
            }
        });
        return content;
    };

    createContent();
    function createContent(){
        const today = new Date();
        let currentMonth = today.getMonth();
        let currentYear = today.getFullYear();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
        const formatDate = (year,month,day) => {
            const date = new Date(year, month, day);
            return `${days[date.getDay()]} - ${date.getDate()} ${months[date.getMonth()]}${year != today.getFullYear() ? " - "+today.getFullYear() : ""}`;
        };

        showMonth(currentMonth, currentYear);
        showNextMonth();
        showNextMonth();
        showNextMonth();
        showNextMonth();
        showNextMonth();
        showNextMonth();
        showNextMonth();
        updateNavDays(today);

        mainContainer.addEventListener('scroll', scrolling);
        const [...navAllElements] = upcomingContainer.querySelectorAll('.nav > .week > div');
        const navTodayElement = upcomingContainer.querySelector('.nav > .week > .today');
        navTodayElement.classList.add('active');
        const firstNavElement = upcomingContainer.querySelector('.nav > .week > div:first-of-type');
        const lastNavElement = upcomingContainer.querySelector('.nav > .week > div:last-of-type');
        const [...allTaskElements] = document.querySelectorAll('.upcoming > ul:not(.overdue)');
        let scrolledWeeks = 0;
        let currNavActiveElement = navTodayElement;
        let lastTaskElement = document.querySelector('.upcoming > ul:nth-last-of-type(15)');
        let todayTaskElement = document.querySelector('.upcoming > ul:nth-of-type(2)');
        let currTaskElement = todayTaskElement;
    
        function scrolling(e){
            const currScrollTop = mainContainer.scrollTop;

            if(isScrolledIntoView(lastTaskElement, currScrollTop)){
                showNextMonth();
                lastTaskElement = document.querySelector('.upcoming > ul:nth-last-of-type(15)');
            }
            // FAST SCROLLING IS NOT WORKING 
            if(!isScrolledIntoView(currTaskElement, currScrollTop)){
                currTaskElement = currTaskElement.nextElementSibling;
                if(currTaskElement.classList.contains('add-task')) return;
                else{
                    currNavActiveElement.classList.remove('active');
                    currNavActiveElement = currNavActiveElement.nextElementSibling;

                    if(!currNavActiveElement){
                        navAllElements.forEach(el => {
                            el.classList.remove('past');
                            el.classList.remove('today');
                        });
                        scrolledWeeks++;
                        updateNavDays(new Date(today.getFullYear(), today.getMonth(), today.getDate() + scrolledWeeks * 7));
                        currNavActiveElement = firstNavElement;
                    }
                    
                    currNavActiveElement.classList.add('active');
                }
            }
            /*else if(!currTaskElement.previousElementSibling.classList.contains('overdue') && isScrolledIntoView(currTaskElement.previousElementSibling, currScrollTop)){
                currTaskElement = currTaskElement.previousElementSibling;
                if(currTaskElement.classList.contains('add-task')) return;
                else{
                    currNavActiveElement.classList.remove('active');
                    currNavActiveElement = currNavActiveElement.previousElementSibling;

                    if(!currNavActiveElement){
                        navAllElements.forEach(el => {
                            el.classList.remove('past');
                            el.classList.remove('today');
                        });
                        scrolledWeeks--;
                        updateNavDays(new Date(today.getFullYear(), today.getMonth(), today.getDate() + scrolledWeeks * 7));
                        currNavActiveElement = lastNavElement;
                    }

                    currNavActiveElement.classList.add('active');
                }
            }*/
        }

        function isScrolledIntoView(elem, scroll){
            const parentViewTop = scroll+127.8;
            const parentViewBottom = parentViewTop + mainContainer.offsetHeight;
            const elemTop = elem.offsetTop;
            const elemBottom = elemTop + elem.offsetHeight;
            //console.log(parentViewTop,elemTop);
            return ((elemBottom <= parentViewBottom) && (elemTop >= parentViewTop));
        }
        
        function updateNavDays(dateObj){
            const todayClone = today;
            todayClone.setHours(0,0,0,0);
            const weekElements = document.querySelectorAll('.upcoming > .nav > .week > div');
            const startOfWeekDate = startOfWeek(dateObj, {weekStartsOn: 1});
            weekElements.forEach((el, i) => {
                const dayEl = el.querySelector('.dayNum');
                const date = new Date(dateObj.getFullYear(), dateObj.getMonth(), startOfWeekDate.getDate() + i);
                dayEl.textContent = date.getDate();
                if(date < todayClone) el.classList.add('past');
                else if(isEqual(date, todayClone))el.classList.add('today');
            });
        }

        /*
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

        */

        function showNextMonth(){
            currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
            currentMonth = (currentMonth + 1) % 12;

            showMonth(currentMonth, currentYear);
        }

        function showMonth(month, year){
            const firstDay = (new Date(year, month)).getDay();
            const daysInMonth = 32 - new Date(year, month, 32).getDate();
            let date = 1;

            for(let i=0; i<6; i++){
                //create individual cells, and filling them up with data
                for(let j=0; j<7; j++){
                    //if(i === 0 && j < firstDay-1){}
                    if(date > daysInMonth) break;
                    else{
                        if(date === today.getDate() && year === today.getFullYear() && month === today.getMonth()){
                            const template = taskAndWrapperTemplate(formatDate(year, month, date) + ' - Today', allTasksInDayContent(year, month, date));
                            const range = document.createRange();
                            const fragment = range.createContextualFragment(template);
                            upcomingContainer.appendChild(fragment);
                        }
                        else if(!(new Date(year, month, date) < today)){
                            const template = taskAndWrapperTemplate(formatDate(year, month, date), allTasksInDayContent(year, month, date));
                            const range = document.createRange();
                            const fragment = range.createContextualFragment(template);
                            upcomingContainer.appendChild(fragment);
                        }
                        date++;
                    }
                }
            }
        }
    }

})();

export default upcomingTab
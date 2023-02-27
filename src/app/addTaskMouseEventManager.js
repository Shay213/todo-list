const addTaskMouseEventManager = (function(){
    let elements = []; 
    let invokeOnce = true;

    const _showElement = function({btn, element, className}) {
        btn.addEventListener('click', show);
        
        function show(e){
            e.stopImmediatePropagation();
            if(e.currentTarget.classList.contains('btn')){
                elements.forEach((el, i) => {
                    if(el.element != element && [...el.element.classList].find(el => /date-picker|priority-picker|label-picker|project-picker/.test(el))){
                        el.element.classList.remove(`${className}`);
                        elements.splice(i, 1);
                    }
                });
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

    const run = function(){
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
        run,
    };
})();

export default addTaskMouseEventManager
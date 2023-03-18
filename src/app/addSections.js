import projects from "./projects";
import addTaskBoxInline from "./addTaskBoxInline";

const addSections = (function(){
    const [...projectsEls] = document.querySelectorAll('.main-container > .project');
    const buttons = document.querySelectorAll('.main-container > .project > .add-section');
    const template = `
    <div class="add-section-box">
        <input type="text" placeholder="Name this section">
        <p class="noValid">Section already exists!</p>
        <div class="buttons">
            <button type="button">Add section</button>
            <button type="button">Cancel</button>
        </div>
    </div>
    `;
    const sectionTemplate = name => `
    <ul class="${name.toLowerCase()}">
        <figcaption>
            <h4>${name}</h4>
        </figcaption>
    </ul>
    <div class="add-task">
        <div>+</div>
        <p>Add task</p>
    </div>
    <div class="add-section">
        <div></div>
        <p>Add section</p>
        <div></div>
    </div>`;

    buttons.forEach(button => button.addEventListener('click', addSectionBox));

    function addSectionBox(e){
        const el = new DOMParser().parseFromString(template, 'text/html').querySelector('div');
        const clickedBtn = e.currentTarget;
        clickedBtn.style.display = 'none';
        clickedBtn.after(el);
        const currProjEl = projectsEls.find(projEl => projEl.contains(el));
        const currProj = projects.getAllProjects().find(proj => currProjEl.classList.contains(proj.name.toLowerCase()));
    
        const input = el.querySelector('input');
        const addBtn = el.querySelector('.buttons > button:first-of-type');
        const cancelBtn = el.querySelector('.buttons > button:last-of-type');
        const noValidMessage = el.querySelector('.noValid');

        addBtn.addEventListener('click', addSubProj);
        cancelBtn.addEventListener('click', cancel);

        input.addEventListener('input', e => {
            const re = new RegExp(`^${e.target.value}$`,'i');
            const isInSubProj = currProj.subProjects.find(subProj => re.test(subProj.name));

            if(isInSubProj){
                noValidMessage.style.display = 'block';
                input.style.outline = '1px solid red';
            }else{
                noValidMessage.style.display = 'none';
                input.style.outline = '1px solid green';
            }
        
            if(e.target.value === '' || isInSubProj){
                addBtn.style.opacity = '.5';
                addBtn.style.cursor = 'not-allowed';
                addBtn.removeEventListener('click', addSubProj);
            }else{
                addBtn.style.opacity = '1';
                addBtn.style.cursor = 'pointer';
                addBtn.addEventListener('click', addSubProj);
            }
        });

        function cancel(e){
            el.remove();
            clickedBtn.style.display = 'flex';
        }

        function addSubProj(e){
            currProj.createSubProject(input.value);
            console.log(currProj);
            const sectionElements = new DOMParser().parseFromString(sectionTemplate(input.value), 'text/html').querySelectorAll('body > *');
            clickedBtn.after(sectionElements[0]);
            sectionElements[0].after(sectionElements[1]);
            sectionElements[1].after(sectionElements[2]);
            cancel();

            sectionElements[1].addEventListener('click', addTaskBoxInline.showAddTaskBox);
            sectionElements[2].addEventListener('click', addSectionBox);
            projects.updateProjectPicker();
        }
    }
})();

export default addSections
import projects from "./projects";
import { toggleSidebarProjects } from "./toggleSidebarProjects";
import options from '../assets/icons/options-outline.svg';
import moreDots from '../assets/icons/more-dots.svg';
import { tabSwitch } from "./tabSwitch";
import addTaskBoxInline from "./addTaskBoxInline";

const addProjects = (function(){
    const addProjectBox = document.querySelector('.add-project');
    let addProjectBtn = document.querySelector('.sidebar ul:last-of-type > figcaption > img:first-of-type');
    const cancel = document.querySelector('.add-project > .buttons > button:first-of-type');
    const add = document.querySelector('.add-project > .buttons > button:last-of-type');
    const input = document.querySelector('.add-project > .inputs > input');
    const colorBtn = document.querySelector('.add-project > .inputs > .color-btn');
    const colorPicker = document.querySelector('.add-project > .inputs > .color-picker');
    const noValidMessage = document.querySelector('.add-project > .inputs > .noValid');
    let isColorPickerVisible = false;
    const capitalizeFirstLetter = str => str.charAt(0).toUpperCase() + str.slice(1);

    const _projectTemplate = name => `
    <div class="container ${name} project">
        <div class="title">
            <h3>${capitalizeFirstLetter(name)}</h3>
            <div class="view">
                <img class="svg grayFilter" src="${options}" alt="options">
                <p>View</p>
            </div>
            <div class="more">
                <img class="svg grayFilter" src="${moreDots}" alt="more">
            </div>
        </div>
        <ul></ul>
        <div class="add-task">
            <div>+</div>
            <p>Add task</p>
        </div>
        <div class="add-section">
            <div></div>
            <p>Add section</p>
            <div></div>
        </div>
    </div>`;

    input.addEventListener('input', e => {
        const re = new RegExp(`^${e.target.value}$`, 'i');
        const isInExisting = projects.getAllProjects().find(project => re.test(project.name));
        console.log(isInExisting);
        if(isInExisting){
            noValidMessage.style.display = 'block';
            input.style.outline = '1px solid red';
        }else{
            noValidMessage.style.display = 'none';
            input.style.outline = '1px solid green';
        }
    
        if(e.target.value === '' || isInExisting){
            add.style.opacity = '.5';
            add.style.cursor = 'not-allowed';
            add.removeEventListener('click', addProject);
        }else{
            add.style.opacity = '1';
            add.style.cursor = 'pointer';
            add.addEventListener('click', addProject);
        }
    });

    function addProject(){
        const project = projects.createProject(input.value, colorBtn.innerText.toLowerCase());
        const el = new DOMParser().parseFromString(_projectTemplate(input.value.trim()), 'text/html').querySelector('div');
        tabSwitch(true);

        document.removeEventListener('click', hideAddProjBox);
        toggleAddProjBox(false);
        projects.updateProjectPicker();
        projects.updateProjectsSidebar();
        addProjectBtn = document.querySelector('.sidebar ul:last-of-type > figcaption > img:first-of-type');
        addProjectBtn.addEventListener('click', init);
        toggleSidebarProjects();
        
        el.querySelector('div.add-task').addEventListener('click', addTaskBoxInline.showAddTaskBox);
        document.querySelector('.main-container').appendChild(el);
        tabSwitch();
    }

    addProjectBtn.addEventListener('click', init);

    function init(e){
        e.stopImmediatePropagation();
        toggleAddProjBox(true);
        document.addEventListener('click', hideAddProjBox);
    }

    colorBtn.addEventListener('click', e => {
        if(isColorPickerVisible){
            isColorPickerVisible = false;
            colorPicker.style.display = 'none';
        }else{
            createColorPickerContent();
            isColorPickerVisible = true;
            colorPicker.style.display = 'block';
        }
    });

    const createColorPickerContent = () => {
        const template = (value, name) => `<div><div style="background-color: ${value};"></div>${name}</div>`;
        const project = projects.getAllProjects()[1];
        const projectOriginalColor = project.color;
        const colors = project.availableColors;
        colorPicker.innerHTML = '';
        colors.forEach(color => {
            project.color = color;
            const el = new DOMParser().parseFromString(template(project.colorValue, color), 'text/html').querySelector('div');
            el.addEventListener('click', pickColor.bind({value: project.colorValue, color: color}));
            function pickColor(e){
                isColorPickerVisible = false;
                colorPicker.style.display = 'none';
                colorBtn.innerHTML = `<div style="background-color: ${this.value};"></div>${this.color}`;
            }
            colorPicker.appendChild(el);
        });
        project.color = projectOriginalColor;
    };

    function hideAddProjBox(e){
        if(e.target != addProjectBox && !addProjectBox.contains(e.target) || e.target === cancel){
            toggleAddProjBox(false);
            document.removeEventListener('click', hideAddProjBox);
        }
    }

    function toggleAddProjBox(show){
        const addProjEl = document.querySelector('.add-project');
        const grayFilter = document.querySelector('.filter-background');
        if(show){
            addProjEl.style.display = 'block';
            grayFilter.style.display = 'block';
        }else{
            addProjEl.style.display = 'none';
            grayFilter.style.display = 'none';
            input.value = '';
            isColorPickerVisible = false;
            colorPicker.style.display = 'none';
            colorBtn.innerHTML = `<div style="background-color: #737373;"></div>Neutral`;
            add.style.opacity = '.5';
            add.style.cursor = 'not-allowed';
            add.removeEventListener('click', addProject);
            input.style.outline = '1px solid #cacaca';
        }
    };
})();

export default addProjects
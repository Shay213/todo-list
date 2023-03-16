import checkBold from '../assets/icons/check-bold.svg';
import inboxIcon from '../assets/icons/inbox.svg';
import pentagon from '../assets/icons/pentagon.svg';
import inbox from '../assets/icons/inbox.svg';
import more from '../assets/icons/more-dots.svg';

const projects = (function(){
    const allProjects = [];
    const projectPicker = document.querySelector('.add-task-container .project-picker');
    const sidebarProjects = document.querySelector('.sidebar > ul:last-of-type');

    class Project{
        constructor(name, color){
            this.name = name;
            this.color = color;
            this.subProjects = [];
            this.availableColors = ['yellow', 'orange', 'red', 'lime', 'teal', 'cyan', 'purple', 'neutral'];
        }

        createSubProject(name){
            this.subProjects.push({
                name: name,
            });
        }
        
        getTemplateHTML(subProjectIndex=null){      
            return this.name === 'Inbox' ? `<img src="${inbox}" alt="select-project"><p>${this.name}</p>`:
            `<div style="display:flex;align-items:center; gap: 6px">
            <div class="bullet" style="background-color: ${this.colorValue}"></div><p>${this.name}${subProjectIndex === null ? '':'/' + this.subProjects[subProjectIndex].name}</p>
            </div>`;
        }

        get colorValue(){
            switch(this.color){
                case 'yellow':
                    return '#facc15';
                case 'orange':
                    return '#f97316';
                case 'red':
                    return '#ef4444';
                case 'lime':
                    return '#a3e635';
                case 'teal':
                    return '#14b8a6';
                case 'cyan':
                    return '#22d3ee';
                case 'purple':
                    return '#a855f7';
                case 'neutral':
                    return '#737373';
            }
        }
    };

    const _updateProjectsSidebar = function(){
        let content = '';
        const projectTemplate = (color, name) =>
        `<li>
            <div class="bullet" style="background-color: ${color}"></div>
            <p>${name}</p>
            <p class="counter"></p>
            <img class="svg" src="${more}" alt="more">
        </li>`;
        allProjects.forEach(el => {
            if(el.name === 'Inbox') return;
            content += projectTemplate(el.colorValue, el.name);
        });
        sidebarProjects.innerHTML += content;
    };

    const _updateProjectPicker = function(){
        let content = '<input type="text" placeholder="Type a project">';
        const inboxTemplate = `
        <div class="inbox">
            <img src="${inboxIcon}" alt="inbox">
            <p>Inbox</p>
            <img class="projectChecked active" src="${checkBold}" alt="checked">
        </div>`;
        content += inboxTemplate;
        const projectTemplate = (name,subProjects) => `
        <ul>
            <figcaption>
                <div class="bullet"></div>
                <p style="padding-left: 11px;">${name}</p>
                <img class="projectChecked" src="${checkBold}" alt="checked">
            </figcaption>
            ${subProjects}
        </ul>`;
        const subProjectTemplate = (name) => `
            <li>
                <img src="${pentagon}" alt="el">
                <p>${name}</p>
                <img class="projectChecked" src="${checkBold}" alt="checked">
            </li>`;        

        allProjects.forEach(el => {
            if(el.name === 'Inbox') return;
            let subProjectsContent = '';
            el.subProjects.forEach(el2 => subProjectsContent += subProjectTemplate(el2.name));
            content += projectTemplate(el.name, subProjectsContent);
        });
        projectPicker.innerHTML += content;  
    };

    const _initialProjects = (function(){
        allProjects.push(new Project('Inbox', ''));
        allProjects.push(new Project('Home', 'neutral'));
        allProjects[1].createSubProject('Routines');
        allProjects[1].createSubProject('Inspiration');
        _updateProjectPicker();
        _updateProjectsSidebar();
    })();

    const getAllProjects = () => allProjects;

    return {
        getAllProjects,
    };
})();


export default projects



// CREATE TEMPLATE FOR PROJECTS
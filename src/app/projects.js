import checkBold from '../assets/icons/check-bold.svg';
import inboxIcon from '../assets/icons/inbox.svg';
import pentagon from '../assets/icons/pentagon.svg';
import inbox from '../assets/icons/inbox.svg';

const projects = (function(){
    const allProjects = [];
    const projectPicker = document.querySelector('.add-task-container .project-picker');

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
            `<p class="bullet">${this.name}${subProjectIndex === null ? '':'/' + this.subProjects[subProjectIndex].name}</p>`;
        }

        get filterValue(){
            switch(this.color){
                case 'yellow':
                    return 'invert(96%) sepia(41%) saturate(5669%) hue-rotate(338deg) brightness(98%) contrast(98%)';
                case 'orange':
                    return 'invert(68%) sepia(38%) saturate(1303%) hue-rotate(331deg) brightness(100%) contrast(97%)';
                case 'red':
                    return 'invert(61%) sepia(85%) saturate(1973%) hue-rotate(315deg) brightness(99%) contrast(96%)';
                case 'lime':
                    return 'invert(85%) sepia(57%) saturate(588%) hue-rotate(24deg) brightness(94%) contrast(92%)';
                case 'teal':
                    return 'invert(93%) sepia(47%) saturate(6869%) hue-rotate(127deg) brightness(88%) contrast(87%)';
                case 'cyan':
                    return 'invert(73%) sepia(99%) saturate(1296%) hue-rotate(150deg) brightness(90%) contrast(109%)';
                case 'purple':
                    return 'invert(78%) sepia(36%) saturate(7485%) hue-rotate(221deg) brightness(100%) contrast(98%)';
                case 'neutral':
                    return 'invert(61%) sepia(80%) saturate(9%) hue-rotate(32deg) brightness(91%) contrast(94%)';
            }
        }
    };

    const _updateProjectPicker = function(){
        let content = '<input type="text" name="project" id="project" placeholder="Type a project">';
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
                <p>${name}</p>
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
        allProjects[1].createSubProject('some text');
        _updateProjectPicker();
    })();

    const getAllProjects = () => allProjects;

    return {
        getAllProjects,
    };
})();


export default projects
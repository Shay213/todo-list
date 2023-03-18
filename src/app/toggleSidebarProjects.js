export const toggleSidebarProjects = () => {
    const btn = document.querySelector('.sidebar ul:last-of-type > figcaption > img:last-of-type');
    const projects = document.querySelectorAll('.sidebar ul:last-of-type > li');
    let visible = true;

    btn.addEventListener('click', e => {
        if(visible){
            visible = false;
            btn.style.cssText = 'transform: rotate(90deg); transition: 200ms;';
            projects.forEach(project => project.style.cssText = 'transform: scaleX(0); transition: 200ms; transform-origin: -100% 50%;');
        }else{
            visible = true;
            btn.style.cssText = 'transform: rotate(0deg); transition: 200ms;';
            projects.forEach(project => project.style.cssText = 'transform: scaleX(1); transition: 200ms; transform-origin: -100% 50%;');
        }
    });
};
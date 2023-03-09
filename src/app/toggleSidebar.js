export function toggleSidebar(){
    const icon = document.querySelector('.top-panel.left ul li:first-child');
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('.main-container');
    
    icon.addEventListener('click', e => {
        sidebar.classList.contains('hide') ? main.style.cssText = `transform: translate(0); transition: transform 500ms;` :
                                             main.style.cssText = `transform: translate(-${sidebar.offsetWidth/2}px); transition: transform 500ms`;
        sidebar.classList.toggle('hide');
    });
};
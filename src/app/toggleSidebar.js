export function toggleSidebar(){
    const icon = document.querySelector('.top-panel.left ul li:first-child');
    const sidebar = document.querySelector('.sidebar');
    
    icon.addEventListener('click', e => {
        sidebar.classList.toggle('hide');
    });
};
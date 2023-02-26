export function searchBarFocus() {
    const search = document.getElementById('search');
    const label = document.querySelector('.top-panel ul li.search label');
        
    search.addEventListener('focus', e => {
        label.style.setProperty('--searchBar-icon-color', 'invert(0%) sepia(0%) saturate(7483%) hue-rotate(312deg) brightness(100%) contrast(107%)');
        search.style.setProperty('--searchBar-placeholder-color', '#000');
        search.style.backgroundColor = '#fff';
    });

    search.addEventListener('focusout', e => {
        label.style.setProperty('--searchBar-icon-color', 'invert(100%) sepia(0%) saturate(7500%) hue-rotate(198deg) brightness(123%) contrast(101%)');
        search.style.setProperty('--searchBar-placeholder-color', '#fff');
        search.style.removeProperty('background-color');
    });
};
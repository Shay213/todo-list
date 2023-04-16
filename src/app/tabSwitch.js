export const tabSwitch = function(disable = false){
    const tabsButtons = document.querySelectorAll('.sidebar li');
    const [...tabs] = document.querySelectorAll('.main-container > .container');
    
    !disable ? tabsButtons.forEach(btn => btn.addEventListener('click', toggle)) : tabsButtons.forEach(btn => btn.removeEventListener('click', toggle))

    function toggle(e){
        let tabName = e.currentTarget.querySelector('p').innerText;
        if(tabName === 'Filters & Labels') tabName = 'filters';
        const elToShow = tabs.find(tab => tab.classList.contains(`${tabName.toLowerCase()}`));
        tabs.forEach(tab => tab.style.display = 'none');
        elToShow.style.display = 'block';
    }
};

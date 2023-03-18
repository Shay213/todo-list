export const tabSwitch = function(disable = false){
    const tabsButtons = document.querySelectorAll('.sidebar li');
    const [...tabs] = document.querySelectorAll('.main-container > .container');
    
    !disable ? tabsButtons.forEach(btn => btn.addEventListener('click', toggle)) : tabsButtons.forEach(btn => btn.removeEventListener('click', toggle))

    function toggle(e){
        const tabName = e.currentTarget.querySelector('p').innerText;
        const elToShow = tabs.find(tab => tab.classList.contains(`${tabName.toLowerCase()}`));
        tabs.forEach(tab => tab.style.display = 'none');
        elToShow.style.display = 'block';
    }
};

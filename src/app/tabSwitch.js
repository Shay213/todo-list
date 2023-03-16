export const tabSwitch = function(){
    const tabsButtons = document.querySelectorAll('.sidebar li');
    const [...tabs] = document.querySelectorAll('.main-container > .container');
    
    tabsButtons.forEach(btn => btn.addEventListener('click', e => {
        const tabName = e.currentTarget.querySelector('p').innerText;

        const elToShow = tabs.find(tab => tab.classList.contains(`${tabName.toLowerCase()}`));
        tabs.forEach(tab => tab.style.display = 'none');
        elToShow.style.display = 'block';
    }));
};

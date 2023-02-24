import './main.css';

function component(){
    const element = document.createElement('div');
    
    element.textContent = 'Hello webpack!';
    element.classList.add('hello');
    console.log('test');

    return element;
}

document.body.appendChild(component());
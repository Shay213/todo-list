export function sidebarResize(){
    const handler = document.querySelector('.sidebar .handler');
    const grid = document.getElementById('content');
    const body = document.querySelector('body');
    let isHandlerDragging = false;
    let startX;
    let gridFirstColWidth;

    document.addEventListener('mousedown', e => {
        if(e.target === handler){
            isHandlerDragging = true;
            startX = e.clientX;
            gridFirstColWidth = startX;
            body.style.cursor = 'col-resize'
        }
    });

    document.addEventListener('mousemove', e => {
        if(!isHandlerDragging) return;
        e.preventDefault();

        let move = e.clientX - startX;
        if(gridFirstColWidth + move < 420 && gridFirstColWidth + move > 230)
            grid.style.cssText = `grid-template-columns: ${gridFirstColWidth + move}px 1fr;`;
    });

    document.addEventListener('mouseup', e => {
        isHandlerDragging = false;
        body.style.cursor = 'auto';
    });
};
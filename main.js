function toggleInfo() {
    var info = document.getElementById('info');
    var middle = document.getElementById('middle');
    var column1 = document.getElementById('column1');
    var column2 = document.getElementById('column2');
    
    if (info.style.display === 'none' || info.style.display === '') {
        info.style.display = 'block';
        setTimeout(() => {
            info.style.width = '500px';
            info.style.opacity = '1';
            column1.classList.add('small');
            column2.classList.add('small');
        }, 10);
        middle.innerHTML = 'X';
    } else {
        info.style.width = '0';
        info.style.opacity = '0';
        column1.classList.remove('small');
        column2.classList.remove('small');
        setTimeout(() => {
            info.style.display = 'none';
        }, 500);
        middle.innerHTML = 'ERDEM TURGUT';
    }
}

function setupScrolling() {
    const columns = document.querySelectorAll('.column');
    
    columns.forEach(column => {
        const scrollContainer = column.querySelector('.scroll-container');
        const scrollHeight = scrollContainer.scrollHeight / 2;
        
        scrollContainer.style.animationDuration = `${scrollHeight * 0.02}s`;
    });
}

window.addEventListener('load', setupScrolling);
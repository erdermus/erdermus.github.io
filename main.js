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
            column1.style.width = 'calc(25% - 35px)';
            column2.style.width = 'calc(25% - 35px)';
        }, 10);
        middle.innerHTML = 'X';
    } else {
        info.style.width = '0';
        info.style.opacity = '0';
        column1.style.width = 'calc(50% - 70px)';
        column2.style.width = 'calc(50% - 70px)';
        setTimeout(() => {
            info.style.display = 'none';
        }, 500);
        middle.innerHTML = 'ERDEM TURGUT';
    }
}

function setupInfiniteScroll() {
    const columns = document.querySelectorAll('.column');
    
    columns.forEach((column, index) => {
        const scrollContainer = column.querySelector('.scroll-container');
        const images = scrollContainer.querySelectorAll('img');
        const totalHeight = Array.from(images).reduce((sum, img) => sum + img.offsetHeight, 0); 

        const duration = index === 0 ? totalHeight * 0.02 : totalHeight * 0.015;
        scrollContainer.style.animationDuration = `${duration}s`;
        
        images.forEach(img => {
            const clone = img.cloneNode(true);
            scrollContainer.appendChild(clone);
        });

        function checkScroll() {
            const scrolled = Math.abs(scrollContainer.getBoundingClientRect().top - column.getBoundingClientRect().top);
            if (scrolled >= totalHeight) {
                scrollContainer.style.animation = 'none';
                scrollContainer.offsetHeight; // Trigger reflow
                scrollContainer.style.animation = `scrollImages ${duration}s linear infinite`;
            }
            requestAnimationFrame(checkScroll);
        }
        checkScroll();
    });
}

window.addEventListener('load', setupInfiniteScroll);
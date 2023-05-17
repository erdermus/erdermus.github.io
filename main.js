function toggleInfo() {
    var info = document.getElementById('info');
    var middle = document.getElementById('middle');
    var column1 = document.getElementById('column1');
    var column2 = document.getElementById('column2');
    
    if (info.style.display === 'none') {
        info.style.display = 'block';
        info.style.width = '300px';
        middle.innerHTML = 'X';
        setTimeout(function() {
            column1.classList.add('small');
            column2.classList.add('small');
        }, 250); // Timeout equal to the transition duration
    } else {
        info.style.width = '0';
        column1.classList.remove('small');
        column2.classList.remove('small');
        middle.innerHTML = 'Your Name';
        setTimeout(function() {
            info.style.display = 'none';
        }, 250); // Timeout equal to the transition duration
    }
}
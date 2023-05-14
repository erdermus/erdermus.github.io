function toggleColumn3() {
  var column3 = document.getElementById('column3');
  var title = document.getElementById('title');
  var close = document.getElementById('close');
  if (column3.classList.contains('hidden')) {
    column3.classList.remove('hidden');
    title.style.display = 'none';
    close.style.display = 'block';
  } else {
    column3.classList.add('hidden');
    title.style.display = 'block';
    close.style.display = 'none';
  }
}

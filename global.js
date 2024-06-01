function loadMenu() {
    fetch('/menu/menu.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('menu').innerHTML = data;
        })
        .catch(error => console.error('Error loading menu:', error));
}
window.onload = loadMenu;
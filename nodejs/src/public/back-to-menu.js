function createMenuButton() {
    // Create the div element
    var divElement = document.createElement('div');
    divElement.style.display = 'block';
    divElement.style.textAlign = 'center';

    // Create the anchor element
    var anchorElement = document.createElement('a');
    anchorElement.href = '/main';
    anchorElement.className = 'glassy-button logout-button';
    anchorElement.textContent = 'Menü';

    // Append the anchor element to the div element
    divElement.appendChild(anchorElement);

    // Append the div element to the div with id "back"
    var backDiv = document.getElementById('back');
    if (backDiv) {
        backDiv.appendChild(divElement);
    } else {
        console.error('Element with id "back" not found.');
    }
}

createMenuButton();
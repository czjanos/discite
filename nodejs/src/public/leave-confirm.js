window.addEventListener('beforeunload', function (e) {
    // Display a confirmation message
    var confirmationMessage = 'Biztosan elszeretnéd hagyni az oldalt?';
    console.log(confirmationMessage);

    // Standard for most browsers
    e.returnValue = confirmationMessage;

    // For some older browsers
    return confirmationMessage;
});

// Additional code to handle the user's choice when leaving the page
window.addEventListener('unload', function () {
    // Perform cleanup or additional actions if needed
    console.log('Performing cleanup before leaving the page...');
});
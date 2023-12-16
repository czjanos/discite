document.getElementById('create-account').addEventListener('click', function() {
    //alert('Create Account Clicked!');
    window.location.href = '/register';
});
 
document.getElementById('try-out').addEventListener('click', function() {
    //alert('Try Out Clicked!');
    // Navigate to the main page
    window.location.href = '/games';
});
 
const loginElement = document.getElementById('login')
const loginFormElement = document.getElementById('login-form'); 


loginElement.addEventListener('click', validateForm);
function validateForm(e) {
    e.preventDefault();
    const username = loginFormElement.elements['username'].value;
    const password = loginFormElement.elements['password'].value;
    if (username === "" || password === "") {
        alert("Username and password are required");
        return false;
    }

    console.log(username, password);
    return true;
}
const registerElement = document.getElementById('register')
const registerFormElement = document.getElementById('register-form'); 


registerElement.addEventListener('click', validateForm);
function validateForm(e) {
    e.preventDefault();
    const username = registerFormElement.elements['username'].value;
    const password = registerFormElement.elements['password'].value;
    const email = registerFormElement.elements['email'].value;
    if (username === "" || password === "" || email === "") {
        alert("Username, email and password are required");
        return false;
    }

    console.log(username, password);
    window.location.href = '/games';
    return true;
}
function register() {

    const registerUser = require('../logic/registerUser')
    const selectHost = require('../../src/utils/routerHost')
    const secretPassGen = require('../../src/utils/secretPassGen')
    const selectLanguage = require('../../src/utils/routerLanguage');

    try {

        const country = document.getElementById('country').value
        const language = selectLanguage(country)
        const name = document.getElementById('name').value
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        const repeatPassword = document.getElementById('repeatPassword').value
        const phone = document.getElementById('phone').value
        const storeCode = document.getElementById('storeCode').value
        const host = selectHost(country)
        const secretPass = secretPassGen('thisIsRegister', email)

        registerUser(name, email, password, repeatPassword, storeCode, phone, language, host, secretPass)
        .then(() => {
            document.getElementById('country').value = '';
            document.getElementById('name').value = '';
            document.getElementById('email').value = '';
            document.getElementById('password').value = '';
            document.getElementById('repeatPassword').value = '';
            document.getElementById('phone').value = '';
            document.getElementById('storeCode').value = '';
            alert(language.registerSucces)
        })
    } catch (error) {
        alert(error)
    }
}

const form = document.getElementById('registerForm')
form.addEventListener('submit', function (event) {
    event.preventDefault()
    register()
});


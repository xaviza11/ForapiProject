
function login() {

    const autenticatheUser = require('./src/logic/autenticatheUsers')
    const selectHost = require('./src/utils/routerHost');
    const selectLanguage = require('./src/utils/routerLanguage');
    const secretPassGen = require('./src/utils/secretPassGen')
    const encrypteToken = require('./src/utils/storeFunctions/encrypted/encrypteToken')
    const encrypteEmail = require('./src/utils/storeFunctions/encrypted/encrypteEmail')
    const saveCountry = require('./src/utils/storeFunctions/nonEncrypted/saveCountry')

    function handleLogin() {

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const country = document.getElementById('language').value

        try {
            const host = selectHost(country)
            const language = selectLanguage(country)
            saveCountry(country)

            const secretPass = secretPassGen('thisIsLogIn', email)

            autenticatheUser(email, password, language, host, secretPass)
                .then((token) => {
                    console.log(token)
                    try {
                        encrypteToken(token)
                        encrypteEmail(email)
                        document.getElementById('navigate').click()
                    } catch (error) { alert(error) }
                })
        } catch (error) {
            alert(error)
        }
    }

    const form = document.getElementById('login-form')

    form.addEventListener('submit', function (event) {
        event.preventDefault()
        handleLogin()
    });
}

login()






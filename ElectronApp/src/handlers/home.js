function home() {
    const retrieveUser = require('../logic/retrieveUser');
    const decrypteEmail = require('../utils/storeFunctions/encrypted/decrypteEmail')
    const decrypteToken = require('../utils/storeFunctions/encrypted/decrypteToken')
    const decrypteUser = require('../utils/storeFunctions/encrypted/decrypteUser');
    const generatePass = require('../utils/secretPassGen')
    const getCountry = require('../utils/storeFunctions/nonEncrypted/getCountry')
    const selectHost = require('../utils/routerHost');
    const selectLanguage = require('../utils/routerLanguage');
    const encrypteUser = require('../utils/storeFunctions/encrypted/encrypteUser')
    const encrypteToken = require('../utils/storeFunctions/encrypted/encrypteToken')
    const encrypteEmail = require('../utils/storeFunctions/encrypted/encrypteEmail')
    const saveStores = require('../utils/storeFunctions/nonEncrypted/saveStores')
    const encrypteItemsList = require('../utils/storeFunctions/encrypted/encrypteItemsList')

    const decryptedEmail = decrypteEmail()
    const decryptedToken = decrypteToken()
    const decryptedUser = decrypteUser()
    const retrieveCountry = getCountry()
    const host = selectHost(retrieveCountry.country)
    const language = selectLanguage(retrieveCountry.country)

    const passCreated = generatePass(decryptedToken.token, decryptedEmail.email)

    try {
        if (decrypteEmail.email === 'noEmail' || decrypteEmail.email === null) {
            //TODO here need to do loagOut
        } else {
            retrieveUser(decryptedToken.token, language, host, passCreated)
                .then(response => {
                    if (response.gender === 'personal') {
                        try {
                            encrypteToken('noKey')
                            encrypteUser({ name: 'noUser' })
                            encrypteEmail('noEmail')
                        } catch (error) {
                            alert(language.errorSavingData)
                        }
                    } else {
                        try {
                            encrypteUser(response.user);
                            saveStores(response.stores);
                            encrypteItemsList(response.itemsList);
                            encrypteToken(response.token);
                        } catch (error) {
                            alert(language.errorSavingData)
                        }
                    }
                })
        }
    } catch (error) {
        alert(error)
    }
}

module.exports = home
async function settings() {
    const decrypteEmail = require('../utils/storeFunctions/encrypted/decrypteEmail')
    const decrypteToken = require('../utils/storeFunctions/encrypted/decrypteToken')
    const generatePass = require('../utils/secretPassGen')
    const getCountry = require('../utils/storeFunctions/nonEncrypted/getCountry')
    const selectHost = require('../utils/routerHost');
    const routerLanguage = require('../utils/routerLanguage');
    const deleteAccount = require('../logic/deleteAccount')
    const updateUser = require('../logic/updateUser')
    const encrypteToken = require('../utils/storeFunctions/encrypted/encrypteToken')
    const location = getCountry()
    const language = routerLanguage(location.country)

    setUp(language)

    function setUp(language) {
        const rootDiv = document.getElementById('settings')
        const childElements = Array.from(rootDiv.children);
        if (!childElements.length) {
            createUpdateUser(rootDiv, language)
            createDeleteUser(rootDiv, language)
        }
    }

    function createUpdateUser(rootDiv, language) {
        const updateUserDiv = document.createElement('div')
        updateUserDiv.className = 'w-full h-[30vh] flex flex-col justify-center items-center'

        const updateUserTitle = document.createElement('h2')
        updateUserTitle.className = 'mb-[2vh]'
        const inputNewEmail = document.createElement('input')
        inputNewEmail.className = 'mb-[1vh] border-b  border-black'
        inputNewEmail.id = 'inputNewEmail'
        const inputNewName = document.createElement('input')
        inputNewName.className = 'mb-[1vh] border-b border-black'
        inputNewName.id = 'inputNewName'
        const inputNewPhone = document.createElement('input')
        inputNewPhone.className = 'mb-[1vh] border-b border-black'
        inputNewPhone.id = 'inputNewPhone'
        const inputNewPassword = document.createElement('input')
        inputNewPassword.className = 'mb-[1vh] border-b border-black'
        inputNewPassword.id = 'inputNewPassword'
        inputNewPassword.type = 'password'
        const inputCurrentPassword = document.createElement('input')
        inputCurrentPassword.className = 'mb-[1vh] border-b border-black'
        inputCurrentPassword.id = 'inputCurrentPassword'
        inputCurrentPassword.type = 'password'
        const updateUserButton = document.createElement('h3')
        updateUserButton.id = 'updateUserButton'

        updateUserTitle.textContent = language.updateItem
        inputNewEmail.placeholder = language.newEmail
        inputNewName.placeholder = language.newName
        inputNewPhone.placeholder = language.newPhone
        inputNewPassword.placeholder = language.newPassword
        inputCurrentPassword.placeholder = language.currentPassword
        updateUserButton.textContent = language.send

        updateUserButton.className = 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-3xl content-center mt-[2vh]';

        updateUserDiv.appendChild(updateUserTitle)
        updateUserDiv.appendChild(inputNewEmail)
        updateUserDiv.appendChild(inputNewName)
        updateUserDiv.appendChild(inputNewPhone)
        updateUserDiv.appendChild(inputNewPassword)
        updateUserDiv.appendChild(inputCurrentPassword)
        updateUserDiv.appendChild(updateUserButton)

        rootDiv.appendChild(updateUserDiv)

        updateUserButton.addEventListener('click', async () => {
            try {
                const decryptedEmail = await decrypteEmail()
                const decryptedToken = await decrypteToken()
                const retrieveCountry = await getCountry()
                const host = selectHost(retrieveCountry.country)
                const language = routerLanguage(retrieveCountry.country)
                const passCreated = generatePass(decryptedToken.token, decryptedEmail.email)
                
                const newEmail = document.getElementById('inputNewEmail').value
                const newName = document.getElementById('inputNewName').value
                const newPhone = document.getElementById('inputNewPhone').value
                const newPassword = document.getElementById('inputNewPassword').value
                const password = document.getElementById('inputCurrentPassword').value
                updateUser(decryptedToken.token, password, newEmail, newPassword, newName, newPhone, language, host, passCreated)
                .then(async response => {
                    alert(language.userUpdated)
                    encrypteToken(response)
                })
            } catch (error) {
                alert(error)
            }
        })
    }

    function createDeleteUser(rootDiv, language) {
        const deleteUser = document.createElement('div')
        deleteUser.className = 'w-full h-[30vh] flex flex-col justify-center items-center'

        const deleteUserTitle = document.createElement('h2')
        deleteUserTitle.className = ['mb-[2vh]']
        const inputValidate = document.createElement('input')
        inputValidate.className = 'mb-[1vh] border-b border-black' 
        inputValidate.id = 'inputValidate'
        const deleteUserButton = document.createElement('h3')

        deleteUserButton.addEventListener('click', () => {
            try {
                const password = document.getElementById('inputValidate').value
                const decryptedEmail = decrypteEmail()
                const decryptedToken = decrypteToken()
                const retrieveCountry = getCountry()
                const host = selectHost(retrieveCountry.country)
                const language = routerLanguage(retrieveCountry.country)
                const passCreated = generatePass(decryptedToken.token, decryptedEmail.email)
                deleteAccount(decryptedToken.token, password, language, host, passCreated)
            } catch (error) {
                alert(error)
            }
        })

        deleteUserTitle.textContent = language.deleteUser
        inputValidate.placeholder = language.password
        deleteUserButton.textContent = language.delete

        deleteUserButton.className = 'bg-red-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-3xl content-center mt-[2vh]';

        deleteUser.appendChild(deleteUserTitle)
        deleteUser.appendChild(inputValidate)
        deleteUser.appendChild(deleteUserButton)
        rootDiv.appendChild(deleteUser)
    }
}

module.exports = settings
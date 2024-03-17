function updateStoresHandler() {

    const deleteOneStore = require('../logic/deleteStore')
    const retrieveOneStore = require('../logic/retrieveOneStore')
    const retrieveStores = require('../utils/storeFunctions/nonEncrypted/getStores')
    const decrypteEmail = require('../utils/storeFunctions/encrypted/decrypteEmail')
    const decrypteToken = require('../utils/storeFunctions/encrypted/decrypteToken')
    const encrypteToken = require('../utils/storeFunctions/encrypted/encrypteToken')
    const secretPassGen = require('../utils/secretPassGen')
    const getCountry = require('../utils/storeFunctions/nonEncrypted/getCountry')
    const routerLanguage = require('../utils/routerLanguage')
    const location = getCountry()
    const language = routerLanguage(location.country)
    const routerHost = require('../utils/routerHost')
    const stores = retrieveStores()

    const updateStores = document.getElementById('updateStores');

    const childElements = Array.from(updateStores.children);

    for (const child of childElements) {
        updateStores.removeChild(child);
    }

    let storeSelected

    const deleteStoreButton = document.getElementById('deleteStoreButton')

    deleteStoreButton.addEventListener
    ('click', function () {
        const deleteStore = document.getElementById('deleteStore').value
        if (storeSelected) {
            if (deleteStore === 'delete') {
                const id = storeSelected.storeId
                try {
                    const decryptedEmail = decrypteEmail()
                    const decryptedToken = decrypteToken()
                    const collection = storeSelected.collection
                    const secretPass = secretPassGen(decryptedToken.token, decryptedEmail.email)
                    const host = routerHost(location.country)
                    deleteOneStore(id, collection, secretPass, decryptedToken.token, language, host)
                        .then(response => {
                            encrypteToken(response.token)
                            alert(language.storeDeleted)
                            try {
                                const deleteOfStorage = require('../utils/storeFunctions/nonEncrypted/deleteStores')
                                const storesArray = require('../stg/stores.json')
                                storeSelected.textContent = ''
                                deleteOfStorage(response.id, storesArray.stores)
                            }catch(error){
                                console.log(error)
                            }
                        })
                } catch (error) { alert(error) }
            } else alert(language.writeDelete)
        } else alert(language.selectStore)
    })

    updateStores.addEventListener("click", function (event) {
        const selectedStoreIndex = Array.from(updateStores.children).indexOf(event.target);
        const selectedStore = stores.stores[selectedStoreIndex];

        if (selectedStore) {
            storeSelected = selectedStore;

            const updateContainer = document.getElementById('updateContainer');
            const h2Element = updateContainer.querySelector('h2');

            if (h2Element) {
                updateContainer.removeChild(h2Element);
            }

            const title = document.createElement('h2');
            title.textContent = selectedStore.name;
            updateContainer.appendChild(title);
        }
    });

    stores.stores.map(function (store, index) {
        const dataElement = document.createElement("div");
        dataElement.className = "cursor-pointer mt-4";
        dataElement.textContent = store.name;
        updateStores.appendChild(dataElement);
    });
}

module.exports = updateStoresHandler
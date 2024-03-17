async function updateItems() {

    const updateProps = require('../logic/updateProps')
    const deleteItem = require('../logic/deleteItem')
    const updateImg = require('../logic/updateImg')
    const updateItem = require('../logic/updateItem')
    const retrieveUserItem = require('../logic/retrieveUserItems')
    const retrieveOneItem = require('../logic/retrieveOneItem')

    const deleteImg = require('../utils/deleteImg')

    const getStores = require('../utils/storeFunctions/nonEncrypted/getStores')
    const storesOfUser = getStores()
    const decrypteItems = require('../utils/storeFunctions/encrypted/decrypteItems')
    const itemsList = decrypteItems()
    const decrypteEmail = require('../utils/storeFunctions/encrypted/decrypteEmail')
    const decrypteToken = require('../utils/storeFunctions/encrypted/decrypteToken')
    const routerLanguage = require('../utils/routerLanguage')
    const getCountry = require('../utils/storeFunctions/nonEncrypted/getCountry')
    const routerHost = require('../utils/routerHost')
    const secretPassGen = require('../utils/secretPassGen')
    const encrypteToken = require('../utils/storeFunctions/encrypted/encrypteToken')
    const location = getCountry()
    const language = routerLanguage(location.country)

    const storesContainer = document.getElementById('storesUpdate')

    if (storesContainer) {


        storesOfUser.stores.forEach((store, index) => {

            const divElement = document.createElement('div')

            clearDiv(storesContainer)

            const nameElement = document.createElement('h2');
            nameElement.textContent = store.name

            divElement.appendChild(nameElement);
            storesContainer.appendChild(divElement)

            divElement.addEventListener('click', () => {
                try {

                    const decryptedEmail = decrypteEmail()
                    const decryptedToken = decrypteToken()
                    const secretPass = secretPassGen(decryptedToken.token, decryptedEmail.email)
                    const host = routerHost(location.country)
                    retrieveUserItem(itemsList.itemsListId, secretPass, decryptedToken.token, language, host)
                        .then(response => {

                            encrypteToken(response.token)
                            const itemsContainer = document.getElementById('items')
                            clearDiv(itemsContainer)
                            const inputSearch = document.createElement('input')
                            inputSearch.placeholder = language.searchItem
                            inputSearch.id = 'inputSearch'

                            const buttonInputSearch = document.createElement('button')
                            buttonInputSearch.textContent = language.search

                            buttonInputSearch.addEventListener('click', () => {
                                const searchValue = document.getElementById('inputSearch').value.toLowerCase()
                                clearDiv(itemsContainer)
                                const buttonReset = document.createElement('button')
                                buttonReset.textContent = language.reset
                                itemsContainer.appendChild(buttonReset)
                                buttonReset.addEventListener('click', () => {
                                    clearDiv(itemsContainer)
                                    updateItems()
                                })
                                for (let j = 0; j < response.items.length; j++) {
                                    for (let i = 0; i < response.items[j].items.length; i++) {
                                        const itemToSearch = response.items[j].items[i].name.toLowerCase();
                                        if (itemToSearch.includes(searchValue)) {
                                            const newItem = document.createElement('h2')
                                            newItem.textContent = response.items[j].items[i].name
                                            itemsContainer.appendChild(newItem)
                                        }
                                    }
                                }
                            })

                            itemsContainer.appendChild(inputSearch)
                            itemsContainer.appendChild(buttonInputSearch)

                            createContent(response, store)
                        })
                } catch (error) {
                    if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError)
                        alert(error.message)
                    else
                        alert(error.message)
                }
            })
        });

        function clearDiv(element) {
            if (element) {
                element.innerHTML = ''
            }
        }

        function createContent(item, store) {
            for (let i = 0; i < item.items.length; i++) {
                for (let j = 0; j < item.items[i].items.length; j++) {
                    if (item.items[i].storeId === store.storeId) {
                        const itemsContainer = document.getElementById('items')

                        const divElement = document.createElement('div')

                        const nameElement = document.createElement('h2');
                        nameElement.id = 'name'
                        nameElement.textContent = item.items[i].items[j].name

                        const collection = item.items[i].items[j].collection

                        divElement.appendChild(nameElement);

                        divElement.addEventListener('click', () => {
                            try {
                                const decryptedEmail = decrypteEmail()
                                const decryptedToken = decrypteToken()
                                const secretPass = secretPassGen(decryptedToken.token, decryptedEmail.email)
                                const host = routerHost(location.country)

                                retrieveOneItem(item.items[i].items[j].itemId, collection, secretPass, language, host, decryptedToken.token, decryptedEmail.email,)
                                    .then(response => {
                                        encrypteToken(response.token)
                                        const updateItemPanel = document.getElementById('updateItemPanel')
                                        clearDiv(updateItemPanel)

                                        const inputTitle = document.createElement('input')
                                        inputTitle.placeholder = language.newTitle
                                        inputTitle.id = 'inputTitle'

                                        const inputDescription = document.createElement('input')
                                        inputDescription.placeholder = language.newDescription
                                        inputDescription.id = 'inputDescription'

                                        const inputPrice = document.createElement('input')
                                        inputPrice.type = 'number'
                                        inputPrice.placeholder = language.newPrice
                                        inputPrice.id = 'inputPrice'

                                        const updateButton = document.createElement('button')
                                        updateButton.textContent = language.update

                                        const clickedElement = divElement;

                                        updateButton.addEventListener('click', () => {
                                            const id = response.item._id
                                            const title = document.getElementById('inputTitle').value
                                            const description = document.getElementById('inputDescription').value
                                            const price = document.getElementById('inputPrice').value
                                            try {
                                                const decryptedEmail = decrypteEmail()
                                                const decryptedToken = decrypteToken()
                                                const secretPass = secretPassGen(decryptedToken.token, decryptedEmail.email)
                                                const host = routerHost(location.country)
                                                const priceFloat = parseFloat(price)
                                                updateItem(id, title, description, priceFloat, collection, itemsList.itemsListId, secretPass, decryptedToken.token, language, host)
                                                    .then(response => {
                                                        alert(language.itemUpdated)
                                                        encrypteToken(response.token)
                                                        clickedElement.textContent = response.name
                                                    })
                                            } catch (error) { alert(error.message) }
                                        })

                                        const deleteButton = document.createElement('button')
                                        deleteButton.textContent = language.deleteItem
                                        deleteButton.addEventListener('click', () => {
                                            const id = response.item._id
                                            try { 
                                                const decryptedEmail = decrypteEmail()
                                                const decryptedToken = decrypteToken()
                                                const secretPass = secretPassGen(decryptedToken.token, decryptedEmail.email)
                                                const host = routerHost(location.country)
                                                deleteItem(id, propsList, collection, secretPass, language, host, decryptedToken.token, decryptedEmail.email)
                                                    .then(token => {
                                                        encrypteToken(token)
                                                    })
                                            } catch (error) { alert(error.message) }
                                        })

                                        const divButtons = document.createElement('div')
                                        divButtons.classList = 'flex w-full justify-around'
                                        const buttonImg = document.createElement('button')
                                        buttonImg.textContent = 'images'
                                        const buttonProps = document.createElement('button')
                                        buttonProps.textContent = 'props'

                                        const imgPanel = document.getElementById('ImgPanel')

                                        buttonImg.addEventListener('click', () => {
                                            clearDiv(imgPanel)
                                            const Images = []
                                            const addProp = document.createElement('button')
                                            addProp.textContent = language.addProps
                                            addProp.addEventListener('click', () => {
                                                console.log(Images)
                                            })
                                            imgPanel.appendChild(addProp)
                                            for (let i = 0; i < response.item.img.length; i++) {
                                                const newImg = document.createElement('h2')
                                                newImg.textContent = response.item.img[i]
                                                imgPanel.appendChild(newImg)
                                                Images.push(response.item.img[i])
                                                const deleteProp = document.createElement('button')
                                                deleteProp.textContent = language.deleteProp
                                                deleteProp.addEventListener('click', () => {
                                                    deleteImg(Images[i])
                                                    Images.splice(i, 1);
                                                    const id = response.item._id
                                                    try {
                                                        const decryptedEmail = decrypteEmail()
                                                        const decryptedToken = decrypteToken()
                                                        const secretPass = secretPassGen(decryptedToken.token, decryptedEmail.email)
                                                        const host = routerHost(location.country)
                                                        updateImg(id, images, collection, secretPass, decryptedToken.token, decryptedEmail.email, language, host,)
                                                            .then(token => {
                                                                alert(language.added)
                                                                encrypteToken(token)
                                                            })
                                                    } catch (error) {
                                                        if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError)
                                                            alert(error.message)
                                                        else
                                                            alert(error.message)
                                                    }
                                                })
                                                imgPanel.appendChild(deleteProp)
                                            }
                                        })

                                        buttonProps.addEventListener('click', () => {
                                            clearDiv(imgPanel)
                                            const propsList = []
                                            const addProp = document.createElement('button')
                                            addProp.textContent = language.addProp
                                            const inputAddProp = document.createElement('input')
                                            inputAddProp.placeholder = language.addPropTitle
                                            inputAddProp.id = 'inputAddProp'
                                            imgPanel.appendChild(inputAddProp)
                                            const inputAddPropValue = document.createElement('input')
                                            inputAddPropValue.placeholder = language.addPropValue
                                            inputAddPropValue.id = 'inputAddPropValue'
                                            imgPanel.appendChild(inputAddPropValue)
                                            addProp.addEventListener('click', () => {
                                                const title = document.getElementById('inputAddProp').value
                                                const props = document.getElementById('inputAddPropValue').value
                                                const propsArray = props.split(',').map(prop => prop.trim());
                                                const propsObject = { [title]: propsArray };
                                                propsList.push(propsObject);
                                                const id = response.item._id
                                                try {
                                                    const decryptedEmail = decrypteEmail()
                                                    const decryptedToken = decrypteToken()
                                                    const secretPass = secretPassGen(decryptedToken.token, decryptedEmail.email)
                                                    const host = routerHost(location.country)
                                                    updateProps(id, propsList, collection, secretPass, language, host, decryptedToken.token, decryptedEmail.email)
                                                        .then(token => {
                                                            const imgPanel = document.getElementById('ImgPanel');

                                                            const title = document.getElementById('inputAddProp');
                                                            const newTitle = title.value;
                                                            title.value = '';

                                                            const props = document.getElementById('inputAddPropValue');
                                                            const newProps = props.value;
                                                            props.value = '';

                                                            const titleTxt = document.createElement('h2');
                                                            titleTxt.textContent = newTitle;

                                                            const propsTxt = document.createElement('h2');
                                                            propsTxt.textContent = newProps;

                                                            const deleteProp = document.createElement('button15')
                                                            deleteProp.textContent = 'deleteProp'

                                                            //TODO Delete the display of the prop

                                                            imgPanel.appendChild(titleTxt);
                                                            imgPanel.appendChild(propsTxt);
                                                            imgPanel.appendChild(deleteProp)

                                                            alert(language.added)

                                                            encrypteToken(token);
                                                        })
                                                } catch (error) {
                                                    if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError)
                                                        alert(error.message)
                                                    else
                                                        alert(error.message)
                                                }
                                            })
                                            imgPanel.appendChild(addProp)
                                            for (let i = 0; i < response.item.props.length; i++) {
                                                for (const prop in response.item.props[i]) {
                                                    propsList.push(response.item.props[i]);

                                                    const titleText = document.createElement('h2');
                                                    titleText.textContent = prop;
                                                    titleText.id = `title-${i}`; // Utilizar un identificador único para cada elemento
                                                    const newProp = document.createElement('h2');
                                                    newProp.textContent = response.item.props[i][prop];
                                                    newProp.id = `prop-${i}`; // Utilizar un identificador único para cada elemento
                                                    const deleteProp = document.createElement('button');
                                                    deleteProp.textContent = language.deleteProp;
                                                    deleteProp.id = i;

                                                    deleteProp.addEventListener('click', (event) => {
                                                        const indexToRemove = event.target.id;
                                                        propsList.splice(indexToRemove, 1);
                                                        const id = response.item._id;

                                                        try {
                                                            const decryptedEmail = decrypteEmail();
                                                            const decryptedToken = decrypteToken();
                                                            const secretPass = secretPassGen(decryptedToken.token, decryptedEmail.email);
                                                            const host = routerHost(location.country);

                                                            const titleElement = document.getElementById(`title-${indexToRemove}`);
                                                            const propElement = document.getElementById(`prop-${indexToRemove}`);

                                                            if (titleElement) {
                                                                imgPanel.removeChild(titleElement);
                                                            }

                                                            if (propElement) {
                                                                imgPanel.removeChild(propElement);
                                                            }

                                                            imgPanel.removeChild(event.target)

                                                            updateProps(id, propsList, collection, secretPass, language, host, decryptedToken.token, decryptedEmail.email)
                                                                .then(token => {
                                                                    encrypteToken(token);
                                                                });
                                                        } catch (error) {
                                                            if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError) {
                                                                alert(error.message);
                                                            } else {
                                                                alert(error.message);
                                                            }
                                                        }
                                                    });

                                                    imgPanel.appendChild(titleText);
                                                    imgPanel.appendChild(newProp);
                                                    imgPanel.appendChild(deleteProp);
                                                }
                                            }
                                        })

                                        divButtons.appendChild(buttonImg)
                                        divButtons.appendChild(buttonProps)

                                        updateItemPanel.appendChild(inputTitle)
                                        updateItemPanel.appendChild(inputDescription)
                                        updateItemPanel.appendChild(inputPrice)
                                        updateItemPanel.appendChild(updateButton)
                                        updateItemPanel.appendChild(divButtons)
                                        updateItemPanel.appendChild(deleteButton)
                                    })
                            } catch (error) {
                                if (error instanceof TypeError || error instanceof FormatError || error instanceof LengthError)
                                    alert(error.message)
                                else
                                    alert(error.message)
                            }
                        })
                        itemsContainer.appendChild(divElement)
                    }
                }
            }
        }
    }
}

module.exports = updateItems
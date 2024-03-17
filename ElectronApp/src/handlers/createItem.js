function createItem(socket) {

    const getStores = require('../utils/storeFunctions/nonEncrypted/getStores')
    const storesOfUser = getStores()
    const storesContainer = document.getElementById('stores')
    const upload = require('../utils/uploadImg')
    const addItem = require('../logic/addItem')
    const routerLanguage = require('../utils/routerLanguage')
    const secretPassGen = require('../utils/secretPassGen')
    const decrypteToken = require('../utils/storeFunctions/encrypted/decrypteToken')
    const decrypteEmail = require('../utils/storeFunctions/encrypted/decrypteEmail')
    const encrypteEmail = require('../utils/storeFunctions/encrypted/encrypteEmail')
    const routerHost = require('../utils/routerHost')
    const getCountry = require('../utils/storeFunctions/nonEncrypted/getCountry')
    const encrypteToken = require('../utils/storeFunctions/encrypted/encrypteToken')
    const location = getCountry()
    const language = routerLanguage(location.country)
    const host = routerHost(location.country)

    const props = []
    const inventories = []

    if (storesContainer) {

        const childElements = storesContainer.children;
        const childCount = childElements.length;

        for (let i = childCount - 1; i >= 0; i--) {
            storesContainer.removeChild(childElements[i]);
        }

        storesOfUser.stores.forEach((store, index) => {
            const divElement = document.createElement('div')

            const nameElement = document.createElement('h2');
            nameElement.textContent = store.name

            const cityElement = document.createElement('h2');
            cityElement.textContent = store.city

            divElement.appendChild(nameElement);
            divElement.appendChild(cityElement);
            storesContainer.appendChild(divElement)

            divElement.addEventListener('click', () => {
                
                const newItem = document.getElementById('newItem')

                clearDiv(newItem)

                const titleInput = document.createElement('input');
                titleInput.type = 'text';
                titleInput.id = 'title';
                titleInput.placeholder = language.enterTitle
                newItem.appendChild(titleInput);

                const descriptionInput = document.createElement('input');
                descriptionInput.type = 'text';
                descriptionInput.id = 'description';
                descriptionInput.placeholder = language.newDescription
                newItem.appendChild(descriptionInput);

                const referenceInput = document.createElement('input');
                referenceInput.type = 'text';
                referenceInput.id = 'reference';
                referenceInput.placeholder = language.inputReference
                newItem.appendChild(referenceInput);


                const currencies = document.createElement('select');
                currencies.id = 'currencies';

                const options = ['€', '$'];

                options.forEach(function (opcion, index) {
                    const option = document.createElement('option');
                    option.value = options[index];
                    option.text = opcion;
                    currencies.appendChild(option);
                });

                currencies.value = '0';

                newItem.appendChild(currencies);

                addSelect(newItem)

                const priceInput = document.createElement('input');
                priceInput.type = 'number';
                priceInput.id = 'price';
                priceInput.placeholder = language.inputPrice
                newItem.appendChild(priceInput);

                const propsInput = document.createElement('input');
                propsInput.type = 'text';
                propsInput.id = 'props';
                propsInput.placeholder = language.inputProps
                newItem.appendChild(propsInput);

                const subProps = document.createElement('input');
                subProps.type = 'text';
                subProps.id = 'subProps';
                subProps.placeholder = language.inputSubProps;
                newItem.appendChild(subProps);

                const buttonProps = document.createElement('button')
                buttonProps.id = 'addProps'
                buttonProps.textContent = language.addProps

                buttonProps.addEventListener('click', () => {
                    drawProps()
                })

                newItem.appendChild(buttonProps)

                /*const inventoriesInput = document.createElement('input');
                inventoriesInput.type = 'text';
                inventoriesInput.id = 'inventories';
                inventoriesInput.placeholder = language.inputInventories
                newItem.appendChild(inventoriesInput);

                const quantity = document.createElement('input');
                quantity.type = 'text';
                quantity.id = 'quantity';
                quantity.placeholder = language.inputQuantitys
                newItem.appendChild(quantity);

                const buttonInventories = document.createElement('button')
                buttonInventories.id = 'addInventories'
                buttonInventories.textContent = language.AddInventories

                buttonInventories.addEventListener('click', () => {
                    drawInventories()
                })

                newItem.appendChild(buttonInventories)*/

                const imgInput = document.createElement('input');
                imgInput.type = 'file';
                imgInput.id = 'img';
                imgInput.accept = 'image/*';
                imgInput.multiple = true;
                newItem.appendChild(imgInput);

                const buttonSend = document.createElement('button')
                buttonSend.id = 'send'
                buttonSend.textContent = language.send
                newItem.appendChild(buttonSend)

                buttonSend.addEventListener('click', () => {
                    sendData(store.storeId)
                })

                const addFromFile = document.createElement('input')
                addFromFile.id = 'file'
                addFromFile.type = 'file';
                addFromFile.multiple = false;
                newItem.appendChild(addFromFile)

                const buttonFromFile = document.createElement('button')
                buttonFromFile.textContent = language.loadFromFile
                newItem.appendChild(buttonFromFile)

                buttonFromFile.addEventListener('click', () => {
                    const files = document.getElementById('file')
                    const selectedFiles = files.files;

                    if (selectedFiles.length !== 0) {
                        const file = selectedFiles[0];
                        const reader = new FileReader();

                        reader.onload = function (e) {
                            const fileData = e.target.result;

                            try {
                                const jsonData = JSON.parse(fileData);
                                sendFromFile(jsonData)
                            } catch (error) {
                                console.error(language.errorJSON, error);
                            }
                        };
                        reader.readAsText(file);
                    } else {
                        alert(language.documentsNotSelected);
                    }
                })

                const divProps = document.createElement('div')
                divProps.id = 'divProps'
                const divInventories = document.createElement('div')
                divInventories.id = 'divInventories'

                const divContainer = document.createElement('div')
                divContainer.className = 'flex'

                divContainer.appendChild(divProps)
                divContainer.appendChild(divInventories)

                newItem.appendChild(divContainer)
            });
        });

        function drawProps() {
            if (props.length > 0) clearProps()
            const divProps = document.getElementById('divProps');

            const propsInput = document.getElementById('props').value;
            const subpropsInput = document.getElementById('subProps').value;

            const propsArray = propsInput.split(',').map(prop => prop.trim());
            const subpropsArray = subpropsInput.split(',').map(subprop => subprop.trim());

            const dynamicObject = {};
            dynamicObject[propsArray] = subpropsArray;

            props.push(dynamicObject);

            props.forEach((propItem) => {
                for (const key in propItem) {
                    const propDiv = document.createElement('div');
                    propDiv.className = 'mb-2'

                    const propTitle = document.createElement('h2');
                    propTitle.textContent = key;

                    const propValues = document.createElement('ul');

                    propItem[key].forEach((value) => {
                        const listItem = document.createElement('li');
                        listItem.textContent = value;
                        propValues.appendChild(listItem);
                    });

                    propDiv.appendChild(propTitle);
                    propDiv.appendChild(propValues);
                    divProps.appendChild(propDiv);
                }
            });
        }

        function drawInventories() {

            if (inventories.length > 0) clearInventories()

            const divInventories = document.getElementById('divInventories')

            const propsInput = document.getElementById('inventories').value;
            const subpropsInput = document.getElementById('quantity').value;

            const propsArray = propsInput.split(',').map(prop => prop.trim());
            const subpropsArray = subpropsInput.split(',').map(subprop => subprop.trim());

            const dynamicObject = {};
            dynamicObject[propsArray] = subpropsArray[0];

            inventories.push(dynamicObject);

            inventories.forEach((inventoryItem) => {
                for (const key in inventoryItem) {
                    const inventoryDiv = document.createElement('div');
                    inventoryDiv.className = 'mb-2'

                    const inventoryTitle = document.createElement('h2');
                    inventoryTitle.textContent = key;

                    const inventoryValue = document.createElement('p');
                    inventoryValue.textContent = `${language.quanitity} ${inventoryItem[key]}`;

                    inventoryDiv.appendChild(inventoryTitle);
                    inventoryDiv.appendChild(inventoryValue);
                    divInventories.appendChild(inventoryDiv);
                }
            });
        }

        function clearDiv(div) {
            const childNodes = div.childNodes;

            for (let i = childNodes.length - 1; i >= 0; i--) {
                div.removeChild(childNodes[i]);
            }
        }

        function clearProps() {
            const divProps = document.getElementById('divProps');
            const childNodes = divProps.childNodes;

            for (let i = childNodes.length - 1; i >= 0; i--) {
                divProps.removeChild(childNodes[i]);
            }
        }

        function clearInventories() {
            const divInventories = document.getElementById('divInventories');
            const childNodes = divInventories.childNodes;

            for (let i = childNodes.length - 1; i >= 0; i--) {
                divInventories.removeChild(childNodes[i]);
            }
        }

        function addSelect(container) {
            const selectOptions = [
                { value: 'furniture', text: language.furniture },
                { value: 'books', text: language.books },
                { value: 'tv', text: language.tv },
                { value: 'music', text: language.music },
                { value: 'photography', text: language.photography },
                { value: 'phones', text: language.phones },
                { value: 'computers', text: language.computers },
                { value: 'electronics', text: language.electronics },
                { value: 'office', text: language.office },
                { value: 'games', text: language.games },
                { value: 'toys', text: language.toys },
                { value: 'kids', text: language.kids },
                { value: 'home', text: language.home },
                { value: 'tools', text: language.tools },
                { value: 'beautyAndHealth', text: language.beautyAndHealth },
                { value: 'clotes', text: language.clothes },
                { value: 'shoes', text: language.shoes },
                { value: 'jewelry', text: language.jewelry },
                { value: 'sport', text: language.sport },
                { value: 'cars', text: language.cars },
                { value: 'motorbikes', text: language.motorbikes },
              ];
              
              const selectElement = document.createElement('select');
              selectElement.id = 'collection';
              
              selectOptions.forEach(optionData => {
                const option = document.createElement('option');
                option.value = optionData.value;
                option.text = optionData.text;
                selectElement.appendChild(option);
              });
              
              container.appendChild(selectElement);
        }

        async function sendData(soldBy) {

            alert('work')

            const decryptedToken = await decrypteToken()
            const title = document.getElementById('title').value
            const description = document.getElementById('description').value
            const price = document.getElementById('price').value
            const img = document.getElementById('img')
            const collection = document.getElementById('collection').value
            const reference = document.getElementById('reference').value
            const currency = document.getElementById('currencies').value
            let images = []
            
            console.log('work')

            const selectedFiles = img.files;

            for (let i = 0; i < selectedFiles.length; i++) {
                try {
                    const res = await upload(selectedFiles[i], decryptedToken.token);
                    images.push(res.url);
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
            }

            try {
                if (selectedFiles.length !== 0) {
                    try {
                        const decryptedEmail = decrypteEmail()
                        const decryptedToken = decrypteToken()
                        const secretPass = secretPassGen(decryptedToken.token, decryptedEmail.email)
                        addItem(price, title, description, props, images, inventories, soldBy, collection, reference, secretPass, language, host, decryptedToken.token, currency)
                            .then(response => {
                                alert(language.newItemCreated)
                                encrypteToken(response.token)
                            })
                    } catch (error) { alert(error) }
                } else {
                    alert(language.imagesNotSelected);
                }
            } catch (error) { alert(error) }
        }

        async function sendFromFile(jsonData) {
            const decryptedToken = decrypteToken()
            const price = jsonData.price
            const title = jsonData.title
            const description = jsonData.description
            const props = jsonData.props
            const inventories = jsonData.inventories
            const soldBy = jsonData.soldBy
            const collection = jsonData.collection
            const reference = jsonData.reference

            try {
                if (selectedFiles.length === 0) {

                    const images = []

                    for (let i = 0; i < selectedFiles.length; i++) {
                        const res = await upload(selectedFiles[i], decryptedToken.token)
                        console.log(res.url)
                        images.push(res.url)
                    }
                        const decryptedEmail = decrypteEmail()
                        const decryptedToken = decrypteToken()
                        const secretPass = secretPassGen(decryptedToken.token, decryptedEmail.email)
                        addItem(price, title, description, props, images, inventories, soldBy, collection, reference, secretPass, language, host, decryptedToken.token)
                            .then(token => {
                                encrypteToken(token)
                            })
                            .catch(error => {
                                alert(error.message)
                            }) 
                } else {
                    alert(language.imagesNotSelected);
                }
            } catch (error) { alert(error) }
        }
    }
}

module.exports = createItem
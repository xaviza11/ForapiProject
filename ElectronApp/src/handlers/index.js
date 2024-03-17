const io = require('socket.io-client');
const decrypteUser = require('../utils/storeFunctions/encrypted/decrypteUser')
const decryptedUser = decrypteUser()

const home = require('../handlers/home')
const chat = require('../handlers/chat')
const updateStHandler = require('../handlers/updateStores')
const addStore = require('../handlers/addStore')
const updateItems = require('../handlers/updateItems')
const calendar = require('../handlers/calendar')
const createItem = require('../handlers/createItem')
const settingsHandler = require('../handlers/settings')
const {setUpHome, setUpAddStore, setUpUpdateSt} = require('../handlers/setUp');

home() 

const socket = io('http://http://192.168.50.148:80', {
    auth: {
        userId: decryptedUser._id
    }
});

document.addEventListener('DOMContentLoaded', function () {
    setUpHome()
    const home = document.getElementById('home')
    const settings = document.getElementById('settings')
    const chats = document.getElementById('chats')
    const addSt = document.getElementById('addSt')
    const addIt = document.getElementById('addIt')
    const updateSt = document.getElementById('updateSt')
    const updateItem = document.getElementById('updateItem')
    calendar()

    const navigateHome = document.getElementById('navigateHome');
    navigateHome.addEventListener('click', function () {
        home.classList.remove('hidden')
        chats.classList.add('hidden')
        settings.classList.add('hidden')
        updateSt.classList.add('hidden')
        addSt.classList.add('hidden')
        addIt.classList.add('hidden')
        updateItem.classList.add('hidden')
        resetColors()
        const h2home = navigateHome.querySelector('h2');
        h2home.classList.add('text-green-500', 'border-green-500');
        h2home.classList.remove('text-white', 'border-white');
    });

    /*const navigateChat = document.getElementById('navigateChat');
    navigateChat.addEventListener('click', function () {
        home.classList.add('hidden')
        chats.classList.remove('hidden')
        settings.classList.add('hidden')
        updateSt.classList.add('hidden')
        addIt.classList.add('hidden')
        addSt.classList.add('hidden')
        updateItem.classList.add('hidden')
        resetColors()
        const h2chat = navigateChat.querySelector('h2');
        h2chat.classList.add('text-green-500', 'border-green-500');
        h2chat.classList.remove('text-white', 'border-white');
        chat(socket)
    });*/

    const navigateAddStores = document.getElementById('navigateAddStores');
    navigateAddStores.addEventListener('click', function () {
        setUpAddStore()
        home.classList.add('hidden')
        chats.classList.add('hidden')
        settings.classList.add('hidden')
        updateSt.classList.add('hidden')
        addIt.classList.add('hidden')
        addSt.classList.remove('hidden')
        updateItem.classList.add('hidden')
        const firstClick = document.getElementById('search')
        resetColors()
        const h2addStore = navigateAddStores.querySelector('h2');
        h2addStore.classList.add('text-green-500', 'border-green-500');
        h2addStore.classList.remove('text-white', 'border-white');
        firstClick.addEventListener('click', function () {
            addStore(socket)
        });
    });

    const navigateUpdateStores = document.getElementById('navigateUpdateStores');
    navigateUpdateStores.addEventListener('click', function () {
        setUpUpdateSt()
        home.classList.add('hidden')
        chats.classList.add('hidden')
        settings.classList.add('hidden')
        updateSt.classList.remove('hidden')
        addIt.classList.add('hidden')
        addSt.classList.add('hidden')
        updateItem.classList.add('hidden')
        resetColors()
        const h2updateStore = navigateUpdateStores.querySelector('h2');
        h2updateStore.classList.add('text-green-500', 'border-green-500');
        h2updateStore.classList.remove('text-white', 'border-white');
        updateStHandler(socket)
    });

    const navigateAddItem = document.getElementById('navigateAddItem');
    navigateAddItem.addEventListener('click', function () {
        home.classList.add('hidden')
        chats.classList.add('hidden')
        settings.classList.add('hidden')
        updateSt.classList.add('hidden')
        addIt.classList.remove('hidden')
        addSt.classList.add('hidden')
        updateItem.classList.add('hidden')
        resetColors()
        const h2addItems = navigateAddItem.querySelector('h2');
        h2addItems.classList.add('text-green-500', 'border-green-500');
        h2addItems.classList.remove('text-white', 'border-white');
        createItem(socket)
    });

    const navigateUpdateItems = document.getElementById('navigateUpdateItems');
    navigateUpdateItems.addEventListener('click', function () {
        home.classList.add('hidden')
        chats.classList.add('hidden')
        settings.classList.add('hidden')
        updateSt.classList.add('hidden')
        addIt.classList.add('hidden')
        addSt.classList.add('hidden')
        updateItem.classList.remove('hidden')
        resetColors()
        const h2updateItem = navigateUpdateItems.querySelector('h2');
        h2updateItem.classList.add('text-green-500', 'border-green-500');
        h2updateItem.classList.remove('text-white', 'border-white');
        updateItems(socket)
    });

    const navigateSettings = document.getElementById('navigateSettings');
    navigateSettings.addEventListener('click', function () {
        home.classList.add('hidden')
        chats.classList.add('hidden')
        settings.classList.remove('hidden')
        updateSt.classList.add('hidden')
        addSt.classList.add('hidden')
        addIt.classList.add('hidden')
        updateItem.classList.add('hidden')
        resetColors()
        const h2settings = navigateSettings.querySelector('h2');
        h2settings.classList.add('text-green-500', 'border-green-500');
        h2settings.classList.remove('text-white', 'border-white');
        settingsHandler()
    });
});

function resetColors() {
    const home = document.getElementById('navigateHome')
    const graphs = document.getElementById('navigateGraphs')
    //const chat = document.getElementById('navigateChat')
    const addStores = document.getElementById('navigateAddStores')
    const updateSt = document.getElementById('navigateUpdateStores')
    const addItem = document.getElementById('navigateAddItem')
    const updateItem = document.getElementById('navigateUpdateItems')
    const settings = document.getElementById('navigateSettings')

    const h2home = home.querySelector('h2');
    h2home.classList.remove('text-green-500', 'border-green-500');
    h2home.classList.add('text-white', 'border-white');

    /*const h2chat = chat.querySelector('h2');
    h2chat.classList.remove('text-green-500', 'border-green-500');
    h2chat.classList.add('text-white', 'border-white');*/

    const h2addStore = addStores.querySelector('h2');
    h2addStore.classList.remove('text-green-500', 'border-green-500');
    h2addStore.classList.add('text-white', 'border-white');

    const h2updateStore = updateSt.querySelector('h2');
    h2updateStore.classList.remove('text-green-500', 'border-green-500');
    h2updateStore.classList.add('text-white', 'border-white');

    const h2addItems = addItem.querySelector('h2');
    h2addItems.classList.remove('text-green-500', 'border-green-500');
    h2addItems.classList.add('text-white', 'border-white');

    const h2updateItem = updateItem.querySelector('h2');
    h2updateItem.classList.remove('text-green-500', 'border-green-500');
    h2updateItem.classList.add('text-white', 'border-white');

    const h2settings = settings.querySelector('h2');
    h2settings.classList.remove('text-green-500', 'border-green-500');
    h2settings.classList.add('text-white', 'border-white');
}


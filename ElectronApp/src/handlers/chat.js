function chat(socket) {
    const decrypteUser = require('../utils/storeFunctions/encrypted/decrypteUser');
    const decryptedUser = decrypteUser();
    let myChat
    let myIndex

    socket.emit('searchChats', { _id: decryptedUser._id, gender: decryptedUser.gender });

    socket.on('response', response => {

        pushEvents(response)

        response.sort((a, b) => {
            return a.chatIsReadingStore === b.chatIsReadingStore ? 0 : a.chatIsReadingStore ? 1 : -1;
        });

        response.sort(function (a, b) {
            let dateA = new Date(a.messages[a.messages.length - 1].date);
            console.log(dateA)
            let dateB = new Date(b.messages[b.messages.length - 1].date);
            return dateB - dateA;
        })

        const chatsContainer = document.getElementById('chatsContainer');
        const childElements = chatsContainer.children;

        for (let i = childElements.length - 1; i >= 0; i--) {
            const child = childElements[i];
            chatsContainer.removeChild(child);
        }

        response.map((element, index) => {
            pushChats(chatsContainer, element, index)
        });

        const chatElements = document.querySelectorAll('#chat');

        socket.on('updateOneChat', item => {
            if (item._id === myChat) {
                pushMessages([item], item.messages, 0);
                const chatElements = document.querySelectorAll('#chat');
                chatElements.forEach((element, chatIndex) => {
                    if (chatIndex === myIndex) {
                        const pointElement = element.querySelector('#point');
                        if (pointElement) {
                            pointElement.remove();
                        }
                    }
                });
            }
        });

        socket.on('userHasNewChat', item => {
            const newDiv = document.createElement('div');
            newDiv.classList.add('border-b', 'border-gray-600', 'mt-2', 'flex', 'items-center', 'justify-around')
            const index = chatsContainer.childElementCount
            newDiv.setAttribute('key', index)
            newDiv.setAttribute('id', 'chat')
            const leftContent = document.createElement('div');
            leftContent.classList.add('flex', 'items-start', 'flex-col', 'space-y-1', 'pr-4');
            const newH2 = document.createElement('h2');
            newH2.textContent = item.userName;
            const newH2B = document.createElement('h2');
            newH2B.textContent = item.date;
            leftContent.appendChild(newH2);
            leftContent.appendChild(newH2B);
            newDiv.appendChild(leftContent);
            if (item.chatIsReadingStore === false) {
                const textElement = document.createElement('div');
                textElement.id = 'point'
                textElement.classList.add('w-4', 'h-4', 'bg-green-500', 'text-white', 'text-center', 'rounded-full');
                newDiv.appendChild(textElement);
            }

            chatsContainer.appendChild(newDiv);
        })

        socket.on('retrieveNewMessage', item => {
            if (item._id === myChat) {
                pushMessages([item], item.messages, 0);
                const chatElements = document.querySelectorAll('#chat');
                chatElements.forEach((element, chatIndex) => {
                    if (chatIndex === myIndex) {
                        const pointElement = element.querySelector('#point');
                        if (pointElement) {
                            pointElement.remove();
                        }
                    }
                });
            } else {
                const position = response.findIndex(element => element._id === item._id);
                const chatElements = document.querySelectorAll('#chat');
                chatElements.forEach((element, chatIndex) => {
                    if (position === chatIndex) {
                        const textElement = document.createElement('div');
                        textElement.id = 'point'
                        textElement.classList.add('w-4', 'h-4', 'bg-green-500', 'text-white', 'text-center', 'rounded-full');
                        element.appendChild(textElement);
                    }
                });
            }
        })

        chatElements.forEach((element, index) => {
            element.addEventListener('click', () => {
                const chatId = response[index]._id;
                socket.emit('joinChat', chatId);
                myChat = chatId;
                myIndex = index

                socket.emit('updateChats', { _id: response[index]._id, name: response[index].storeName, isReading: response[index].storeId });

                const chatDisplay = document.getElementById('chatDisplay')
                const titleElement = document.createElement('h2');
                titleElement.id = 'title';
                titleElement.className = 'text-center';
                chatDisplay.appendChild(titleElement);
                titleElement.textContent = element.userName

                const buttonElement = document.createElement('button');
                pushSendInput(buttonElement)
                pushItems(response[index])

                buttonElement.addEventListener('click', () => {
                    const inputValue = document.getElementById('newMessage').value;
                    const payload = response[index];

                    const date = new Date();
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const day = String(date.getDate()).padStart(2, '0');
                    const hours = String(date.getHours()).padStart(2, '0');
                    const minutes = String(date.getMinutes()).padStart(2, '0');

                    let formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;

                    socket.emit('addMessage', {
                        retrieveName: payload.storeName,
                        _id: payload._id,
                        newMessage: inputValue,
                        formattedDateA: formattedDate
                    });
                    socket.emit('updateChats', { _id: payload._id, name: payload.storeName });
                });
            });
        });
    });
}

function pushMessageUser(chatDisplay, titleElement, author, message, date) {
    const newDiv = document.createElement('div');
    newDiv.className = 'bg-green-200 p-2 rounded-lg text-left mt-2';
    const userElement = document.createElement('h2');
    userElement.textContent = author
    const messageElement = document.createElement('h2');
    messageElement.textContent = message
    const dateElement = document.createElement('h2');
    dateElement.textContent = date
    newDiv.appendChild(userElement);
    newDiv.appendChild(messageElement);
    newDiv.appendChild(dateElement);
    chatDisplay.appendChild(newDiv);
}

function pushMessageStore(chatDisplay, titleElement, author, message, date) {
    const newDiv = document.createElement('div');
    newDiv.className = 'bg-gray-200 p-2 rounded-lg text-right mt-2';
    const userElement = document.createElement('h2');
    userElement.textContent = author
    const messageElement = document.createElement('h2');
    messageElement.textContent = message
    const dateElement = document.createElement('h2');
    dateElement.textContent = date
    newDiv.appendChild(userElement);
    newDiv.appendChild(messageElement);
    newDiv.appendChild(dateElement);
    chatDisplay.appendChild(newDiv);
}

function pushSendInput(buttonElement) {
    const chatPanel = document.getElementById('chatPanel')
    const containerDiv = document.createElement('div');
    containerDiv.className = 'fixed bottom-0 left-[32vw] p-4';
    chatPanel.appendChild(containerDiv)
    const innerDiv = document.createElement('div');
    innerDiv.className = 'flex space-x-2 items-center';
    const inputElement = document.createElement('input');
    inputElement.id = 'newMessage'
    inputElement.className = 'border border-gray-300 rounded-2xl px-3 py-2 w-[31vw]';
    inputElement.type = 'text';
    inputElement.placeholder = 'Escribe tu mensaje...';
    buttonElement.id = 'sendMessage';
    buttonElement.className = 'bg-green-500 hover:bg-green-600 text-white font-semibold rounded-3xl px-4 py-2';
    buttonElement.textContent = '>';
    innerDiv.appendChild(inputElement);
    innerDiv.appendChild(buttonElement);
    containerDiv.appendChild(innerDiv);
}

function pushChats(chatsContainer, element, index) {
    const newDiv = document.createElement('div');
    newDiv.classList.add('border-b', 'border-gray-600', 'mt-2', 'flex', 'items-center', 'justify-around');
    newDiv.setAttribute('key', index)
    newDiv.setAttribute('id', 'chat')
    const leftContent = document.createElement('div');
    leftContent.classList.add('flex', 'items-start', 'flex-col', 'space-y-1', 'pr-4');
    const newH2 = document.createElement('h2');
    newH2.textContent = element.userName;
    const newH2B = document.createElement('h2');
    newH2B.textContent = element.messages[element.messages.length - 1].date;
    leftContent.appendChild(newH2);
    leftContent.appendChild(newH2B);
    newDiv.appendChild(leftContent);
    if (element.chatIsReadingStore === false) {
        const textElement = document.createElement('div');
        textElement.id = 'point'
        textElement.classList.add('w-4', 'h-4', 'bg-green-500', 'text-white', 'text-center', 'rounded-full');
        newDiv.appendChild(textElement);
    }

    chatsContainer.appendChild(newDiv);
}

function clearChatDisplay() {
    const chatDisplay = document.getElementById('chatDisplay');
    const childElements = Array.from(chatDisplay.children);

    for (const child of childElements) {
        chatDisplay.removeChild(child);
    }
}

function pushMessages(response, messages, index) {

    clearChatDisplay()

    for (let j = 0; j < messages.length; j++) {
        if (messages[j].author === response[index].userName) {
            const chatDisplay = document.getElementById('chatDisplay')
            const titleElement = document.getElementById('title')
            const author = messages[j].author
            const message = messages[j].message
            const date = messages[j].date;
            console.log(date)

            pushMessageUser(chatDisplay, titleElement, author, message, date)
        } else {
            const chatDisplay = document.getElementById('chatDisplay')
            const titleElement = document.getElementById('title')
            const author = messages[j].author
            const message = messages[j].message
            const date = messages[j].date;

            pushMessageStore(chatDisplay, titleElement, author, message, date)
        }
    }
}

async function pushEvents(response) {
    const getEvents = require('../utils/storeFunctions/nonEncrypted/getEvents')
    const events = await getEvents()
    const saveEvents = require('../utils/storeFunctions/nonEncrypted/saveEvents')

    const eventsIds = []

    for (let i = 0; i < events.events.length; i++) {
        if (events.events[i]._id) {
            eventsIds.push(events.events[i]._id)
        }
    }

    for (let j = 0; j < response.length; j++) {
        const isValid = eventsIds.includes(response[j]._id)
        if (!isValid) {
            saveEvents({ _id: response[j]._id, deadLine: response[j].deadLine, items: response[j].items, storeId: response[j].storeId, userName: response[j].userName, isOrder: true })
        }
    }
}

function pushItems(chat) {

    const eventsPanel = document.getElementById('eventsPanel')
    eventsPanel.innerHTML = '';

    for (let i = 0; i < chat.items.length; i++) {
        const name = chat.items[i].name
        const quantity = chat.items[i].quantity

        const nameTXT = document.createElement('h2')
        const quantityTXT = document.createElement('h2')

        nameTXT.textContent = name
        quantityTXT.textContent = quantity

        eventsPanel.appendChild(nameTXT)
        eventsPanel.appendChild(quantityTXT)
    }
}

module.exports = chat
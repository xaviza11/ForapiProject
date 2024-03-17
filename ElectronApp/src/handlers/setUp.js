function setUpHome() {
    const getCountry = require('../utils/storeFunctions/nonEncrypted/getCountry')
    const routerLanguage = require('../utils/routerLanguage')

    const location = getCountry()
    const language = routerLanguage(location.country)

    const homePanel = document.createElement('div');
    homePanel.id = 'homePanel';
    homePanel.className = 'flex flex-col justify-center items-center overflow-y-auto absolute top-[4vh] left-[12vw] border-2 border-gray-600 h-[45vh] w-[42vw] bg-black';

    const additionalContentDiv = document.createElement('div');
    additionalContentDiv.className = 'h-96 w-80 rounded-lg bg-white p-2 user-select-none flex flex-col justify-center items-center';
    additionalContentDiv.id = 'table';

    const tableHeader = document.createElement('div');
    tableHeader.className = 'flex justify-around items-center rounded-tl-lg rounded-tr-lg p-4 h-14 w-full text-gray-700';

    const monthHeaderDiv = document.createElement('div');
    monthHeaderDiv.id = 'month-header';

    const buttonsDiv = document.createElement('div');
    buttonsDiv.className = 'buttons';

    const prevMonthButton = document.createElement('button');
    prevMonthButton.className = 'icon';
    prevMonthButton.id = 'prevMonth';
    prevMonthButton.textContent = '⬅️';

    const nextMonthButton = document.createElement('button');
    nextMonthButton.className = 'icon';
    nextMonthButton.id = 'nextMonth';
    nextMonthButton.textContent = '➡️';

    const resetDateButton = document.createElement('button');
    resetDateButton.className = 'icon';
    resetDateButton.id = 'resetDate';
    resetDateButton.textContent = '🔁';

    buttonsDiv.appendChild(prevMonthButton);
    buttonsDiv.appendChild(nextMonthButton);
    buttonsDiv.appendChild(resetDateButton);

    tableHeader.appendChild(monthHeaderDiv);
    tableHeader.appendChild(buttonsDiv);

    additionalContentDiv.appendChild(tableHeader);

    homePanel.appendChild(additionalContentDiv);

    const homeDiv = document.getElementById('home');
    homeDiv.appendChild(homePanel);

    const newEventDiv = document.getElementById('newEvent');

    const newEventDateHeading = document.createElement('h2');
    newEventDateHeading.id = 'newEventDate';
    newEventDateHeading.className = 'mb-[2vh]';

    const newEventTitleInput = document.createElement('input');
    newEventTitleInput.className = 'mb-[1vh] border-b border-black'
    newEventTitleInput.id = 'newEventTitle';
    newEventTitleInput.placeholder = language.enterTitle

    const newEventDescriptionInput = document.createElement('input');
    newEventDescriptionInput.className = 'mb-[1vh] border-b border-black'
    newEventDescriptionInput.id = 'newEventDescription';
    newEventDescriptionInput.placeholder = language.enterDescription;

    const newEventButton = document.createElement('button');
    newEventButton.id = 'newEventButton';
    newEventButton.className = 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-3xl content-center mt-[2vh]';
    newEventButton.textContent = language.send

    newEventDiv.appendChild(newEventDateHeading);
    newEventDiv.appendChild(newEventTitleInput);
    newEventDiv.appendChild(newEventDescriptionInput);
    newEventDiv.appendChild(newEventButton);
}

function setUpAddStore() {

    const getCountry = require('../utils/storeFunctions/nonEncrypted/getCountry')
    const routerLanguage = require('../utils/routerLanguage')

    const location = getCountry()
    const language = routerLanguage(location.country)

    const addStorePanelDiv = document.getElementById('addStorePanel');

    const childElements = addStorePanelDiv.children;

    for (let i = childElements.length - 1; i >= 0; i--) {
        const child = childElements[i];
        addStorePanelDiv.removeChild(child);
    }

    const heading = document.createElement('h2');
    heading.className = 'mb-[5vh]';
    heading.textContent = language.insertNameAndCity

    const storeNameInput = document.createElement('input');
    storeNameInput.id = 'storeName';
    storeNameInput.className = 'mb-[1vh] border-b border-black'
    storeNameInput.placeholder = language.storeName

    const cityInput = document.createElement('input');
    cityInput.id = 'city';
    cityInput.className = 'mb-[1vh] border-b border-black'
    cityInput.placeholder = language.insertCity

    const countrySelect = document.createElement('select');
    countrySelect.id = 'country';
    countrySelect.name = 'country';

    const countryOption = document.createElement('option');
    countryOption.value = 'ES';
    countryOption.textContent = language.spain

    const collectionOption = document.createElement('option');
    collectionOption.value = 'furniture';
    collectionOption.textContent = language.furnitures;

    const submitButton = document.createElement('button');
    submitButton.id = 'search';
    submitButton.className = 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-3xl content-center mt-[4vh]';
    submitButton.textContent = language.send

    addStorePanelDiv.appendChild(heading);
    addStorePanelDiv.appendChild(storeNameInput);
    addStorePanelDiv.appendChild(cityInput);
    countrySelect.appendChild(countryOption);
    addStorePanelDiv.appendChild(countrySelect);
    addStorePanelDiv.appendChild(submitButton);
}

function setUpUpdateSt() {

    const getCountry = require('../utils/storeFunctions/nonEncrypted/getCountry')
    const routerLanguage = require('../utils/routerLanguage')

    const location = getCountry()
    const language = routerLanguage(location.country)

    const updateSt = document.getElementById('updateSt')
    const updateContainer = document.getElementById('updateContainer')

    const childElements = Array.from(updateContainer.children);

    for (const child of childElements) {
        updateContainer.removeChild(child);
    }

    const disclaimer = document.createElement('p')
    disclaimer.textContent = language.storesUpdate
    disclaimer.className = 'mb-[4vh]'

    const inputEmail = document.createElement('input')
    inputEmail.className = 'mb-[1vh] border-b border-black'
    inputEmail.placeholder = language.writeDelete
    inputEmail.id = 'deleteStore'

    const deleteStoreButton = document.createElement('button');
    deleteStoreButton.id = 'deleteStoreButton';
    deleteStoreButton.className = 'bg-red-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-3xl content-center mt-[2vh] mb-[2vh]';
    deleteStoreButton.textContent = language.delete

    updateContainer.appendChild(disclaimer)
    updateContainer.appendChild(inputEmail)
    updateContainer.appendChild(deleteStoreButton);

    updateSt.appendChild(updateContainer);
}

module.exports = { setUpHome, setUpAddStore, setUpUpdateSt }
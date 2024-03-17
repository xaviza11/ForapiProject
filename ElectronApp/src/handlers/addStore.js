function addStore(socket) {

    //! it's possible to has changes in the token so maybe need update

    const retrieveUser = require('../utils/storeFunctions/encrypted/decrypteUser')
    const encrypteToken = require('../utils/storeFunctions/encrypted/encrypteToken')
    const decrypteToken = require('../utils/storeFunctions/encrypted/decrypteToken')
    const decrypteEmail = require('../utils/storeFunctions/encrypted/decrypteEmail')
    const addStore = require('../logic/addStore')
    const getCountry = require('../utils/storeFunctions/nonEncrypted/getCountry')
    const saveStores = require('../utils/storeFunctions/nonEncrypted/saveStores')
    const routerLanguage = require('../utils/routerLanguage')
    const routerHost = require('../utils/routerHost')
    const location = getCountry()
    const language = routerLanguage(location.country)
    const host = routerHost(location.country)
    const secretPassGen = require('../utils/secretPassGen')
    require('dotenv').config()

    const {TOKEN} = process.env

    alert(language.searchingStore)

    const xhr = new XMLHttpRequest();
    xhr.onerror = () => reject(new Error('connection error'));

    const storeNameValue = document.getElementById('storeName').value
    const countryValue = document.getElementById('country').value
    const cityValue = document.getElementById('city').value
    const tokenApi = TOKEN;

    let url = `https://api.app.outscraper.com/maps/reviews-v3?query=${storeNameValue},%20${cityValue},%20${countryValue}&reviewsLimit=3&async=false&language=es`;

    xhr.open('GET', url);
    xhr.setRequestHeader('Authorization', `Bearer ${tokenApi}`);

    xhr.send()

    xhr.onload = function () {

        try {
            const response = JSON.parse(xhr.responseText);
            const reviewsData = [];
            const retrievedUser = retrieveUser()

            console.log(response)

            const query = storeNameValue + ', ' + cityValue + ', ' + countryValue
            const name = response.data[0].name
            const location = { coordinates: response.data[0].latitude + ', ' + response.data[0].longitude, type: 'point' };
            const address = response.data[0].full_address
            const owner = retrievedUser._id //cambiar por token
            const postalCode = response.data[0].postal_code
            const phone = response.data[0].phone
            const email = retrievedUser.email
            const webSide = response.data[0].site
            const country = response.data[0].country
            const city = response.data[0].city
            const state = response.data[0].state
            const type = response.data[0].type
            const logo = response.data[0].logo
            const rating = response.data[0].rating
            const totalReviews = response.data[0].reviews
            const workingHours = response.data[0].working_hours
            const reviewsPerScore = response.data[0].reviews_per_score
            const collection = 'none'

            pushReviews(response)
            drawContent(name, address, postalCode, phone, city)

            const save = document.getElementById('save')
            save.addEventListener('click', function () {
                    addStoreHandler(query, location, name, address, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, owner, email, collection, language, host);
            }
            )
        } catch (error) {
            alert(error)
        }

        function addStoreHandler(query, location, name, address, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, owner, email, collection, language, host) {

            try {
                const decryptedEmail = decrypteEmail()
                const decryptedToken = decrypteToken()
                const secretPass = secretPassGen(decryptedToken.token, decryptedEmail.email)

                addStore(query, location, name, address, postalCode, country, city, state, webSide, phone, type, logo, rating, totalReviews, reviewsData, workingHours, reviewsPerScore, decryptedEmail.email, owner, collection, secretPass, decryptedToken.token, decrypteEmail.email, language, host)
                    .then(response => {
                        try{
                        encrypteToken(response.token)
                        saveStores(response.stores)
                        alert(language.createStoreSuccess);
                        const storeAdded = document.getElementById('storeAdded')
                        storeAdded.innerHTML = ''
                        }catch(error) {alert(error)}
                    })
            } catch (error) { alert(error.message) }
        }

        function pushReviews(response) {
            try {
                if (response.data[0].reviews_data[0]) {
                    reviewsData.push({
                        author: response.data[0].reviews_data[0].author_title,
                        review: response.data[0].reviews_data[0].review,
                        reviewRating: response.data[0].reviews_data[0].review_rating,
                    });
                }
            } catch (error) { console.log(error) }

            try {
                if (response.data[0].reviews_data[1]) {
                    reviewsData.push({
                        author: response.data[0].reviews_data[1].author_title,
                        review: response.data[0].reviews_data[1].review,
                        reviewRating: response.data[0].reviews_data[1].review_rating,
                    });
                }
            } catch (error) { console.log(error) }

            try {
                if (response.data[0].reviews_data[2]) {
                    reviewsData.push({
                        author: response.data[0].reviews_data[2].author_title,
                        review: response.data[0].reviews_data[2].review,
                        reviewRating: response.data[0].reviews_data[2].review_rating,
                    });
                }
            } catch (error) { console.log(error) }
        }

        function drawContent(name, address, postalCode, phone, city) {
            const storeAdded = document.getElementById('storeAdded')
            const newText = document.createElement('div')
            newText.classList.add('w-[20vw]')
            const newName = document.createElement('h4')
            newName.textContent = name
            const newAddress = document.createElement('h4')
            newAddress.textContent = address
            const newPostalCode = document.createElement('h4')
            newPostalCode.textContent = postalCode
            const newCity = document.createElement('h4')
            newCity.textContent = city
            const newPhone = document.createElement('h4')
            newPhone.textContent = phone
            const addText = document.createElement('h4')
            addText.textContent = language.ifCorrectSend
            const newButton = document.createElement('button')
            newButton.textContent = language.send
            newButton.className = 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-3xl content-center mt-[2vh] ml-[6vw]'
            newButton.id = 'save'
            newText.appendChild(addText)
            newText.appendChild(newName)
            newText.appendChild(newAddress)
            newText.appendChild(newPostalCode)
            newText.appendChild(newCity)
            newText.appendChild(newPhone)
            newText.appendChild(newButton)
            storeAdded.appendChild(newText)
        }
    }
}

module.exports = addStore
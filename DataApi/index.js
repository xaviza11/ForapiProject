require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')

//**************************************************** */
//const socketIo = require('socket.io'); 
//const socketHandler = require('./socket/socket')
//************************************************ */

const deleteOldSearches = require('./utils/deleteOldSearches')

const authenticateUserHandler = require('./handlers/authenticateUserHandler')
const registerUserHandler = require('./handlers/registerUserHandler')
const retrieveUserHandler = require('./handlers/retrieveUserHandler')
const createAddHandler = require('./handlers/createAddHandler')
const createSearchHandler = require('./handlers/createSearchHandler')
const validateTagsHandler = require('./handlers/validateTagsHandler')
const updateLikesHandler = require('./handlers/updateLikesHandler')
const newOrderHandler = require('./handlers/newOrderHandler')
const retrieveOrders = require('./handlers/retrieveOrdersHandler')
const retrieveCountryHandler = require('./handlers/retrieveCountryHandler')
const retrieveLikesHandler = require('./handlers/retrieveLikesHandler')
const addFurnitureHandler = require('./handlers/addFurnitureHandler')
const addStoreHandler = require('./handlers/addStoreHandler')
const retrieveSearchHandler = require('./handlers/retrieveSearchHandler')
const createCodeHandler = require('./handlers/createCodeHandler')
const deleteAccountHandler = require('./handlers/deleteAccountHandler')
const updateUserHandler = require('./handlers/updateUserHandler')
const recoveryAccountHandler = require('./handlers/recoveryAccountHandler')
const updatePropsHandler = require('./handlers/updatePropsHandler')
const deleteItemHandler = require('./handlers/deleteItemHandler')
const updateImagesHandler = require('./handlers/updateImagesHandler')
const updateItemHandler = require('./handlers/updateItemHandler')
const retrieveUserItemsHandler = require('./handlers/retrieveUserItemsHandler')
const retrieveOneItemHandler = require('./handlers/retrieveOneItemHandler')
const deleteStoreHandler = require('./handlers/deleteStoreHandler')
const retrieveOneStoreHandler = require('./handlers/retrieveOneStoreHandler')
const addItemToBasketHandler = require('./handlers/addToBAsketHandler')
const retrieveBasketHandler = require('./handlers/retrieveBasketHandler')
const deleteItemOnBasketHandler = require('./handlers/deleteItemOnBasketHandler')
const createAdminHandler = require('./handlers/createAdminHandler')
const updateProfileImageHandler = require('./handlers/updateProfileImageHandler')
const createRandomSearchHandler = require('./handlers/createRandomSearchHandler')

const jsonBodyParser = require('./utils/jsonBodyParser')
const cors = require('./utils/cors')
const jwtVerifier = require('./utils/jwtVerifier')

const { MONGODB_URL } = process.env

mongoose.connect(MONGODB_URL)
    .then(() => {

        console.log(`db connected to ${MONGODB_URL}`)

        const api = express()

        api.use(cors)

        //working
        api.get('/admin/create', createAdminHandler)
        api.post('/users/auth', jsonBodyParser, authenticateUserHandler)
        api.post('/users/register', jsonBodyParser, registerUserHandler)
        api.post('/users', jwtVerifier, jsonBodyParser, retrieveUserHandler)
        api.post('/createAdd', jwtVerifier, jsonBodyParser, createAddHandler)
        api.post('/tags', jsonBodyParser, jwtVerifier, validateTagsHandler)
        api.post('/search/create', jsonBodyParser, jwtVerifier, createSearchHandler)
        api.put('/updateLikes', jsonBodyParser, jwtVerifier, updateLikesHandler)
        api.post('/retrieveCountry', jsonBodyParser, jwtVerifier, retrieveCountryHandler)
        api.post('/newOrder', jsonBodyParser, jwtVerifier, newOrderHandler)
        //api.get('/orders', jwtVerifier, retrieveOrders)
        api.post('/likes', jwtVerifier, jsonBodyParser, retrieveLikesHandler)
        api.post('/addFurniture', jwtVerifier, jsonBodyParser, addFurnitureHandler)
        api.post('/addStore', jwtVerifier, jsonBodyParser, addStoreHandler)
        api.post('/search/retrieve', jsonBodyParser, jwtVerifier, retrieveSearchHandler)
        api.post('/codes/create', jsonBodyParser, jwtVerifier, createCodeHandler)
        api.delete('/account/delete', jsonBodyParser, jwtVerifier, deleteAccountHandler)
        api.put('/account/update', jsonBodyParser, jwtVerifier, updateUserHandler)
        api.get('/recovery/account', jsonBodyParser, recoveryAccountHandler)
        api.put('/props/update', jsonBodyParser, jwtVerifier, updatePropsHandler)
        api.delete('/item/delete', jsonBodyParser, jwtVerifier, deleteItemHandler)
        api.put('/item/updateImg', jsonBodyParser, jwtVerifier, updateImagesHandler)
        api.put('/item/updateItem', jsonBodyParser, jwtVerifier, updateItemHandler)
        api.post('/userItems/retrieve', jsonBodyParser, jwtVerifier, retrieveUserItemsHandler)
        api.post('/items/retrieveOneItem', jsonBodyParser, jwtVerifier, retrieveOneItemHandler)
        api.delete('/store/delete', jsonBodyParser, jwtVerifier, deleteStoreHandler)
        api.post('/store/retrieveOne', jsonBodyParser, jwtVerifier, retrieveOneStoreHandler)
        api.post('/basket/addItem', jsonBodyParser, jwtVerifier, addItemToBasketHandler)
        api.post('/basket/retrieve', jsonBodyParser, jwtVerifier, retrieveBasketHandler)
        api.post('/uploadProfileImage', jsonBodyParser,  updateProfileImageHandler)
        api.delete('/basket/deleteItem', jsonBodyParser, jwtVerifier, deleteItemOnBasketHandler)
        api.post('/createRandomSearch', jsonBodyParser, jwtVerifier, createRandomSearchHandler)

        const { PORT } = process.env

        api.listen(PORT, () => console.log(`server listening on port ${PORT}`))
    })
    .catch(error => console.error(error))

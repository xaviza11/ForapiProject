require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express')
const socketIo = require('socket.io');
const http = require('http');
const socketHandler = require('./socket/socket')

const jsonBodyParser = require('./utils/jsonBodyParser')
const cors = require('./utils/cors')
const jwtVerifier = require('./utils/jwtVerifier')

const { MONGODB_URL } = process.env

const createNewChatHandler = require('./handlers/createChatsHandler')

mongoose.connect(MONGODB_URL)
    .then(() => {

        console.log(`db connected to ${MONGODB_URL}`)

        const api = express()

        api.use(cors)

        api.post('/createNewChat', jsonBodyParser, createNewChatHandler)

        const { PORT } = process.env
        const server = http.createServer(api);
        const io = socketIo(server, {
            cors: {
              origin: "http://localhost:19006",
              methods: ["GET", "POST"],
              allowedHeaders: ["my-custom-header"],
              credentials: true
            }})

            socketHandler(io)
          
          server.listen(PORT, () => {
            console.log(`Server Socket.io listening on port ${PORT}`);
          });

    })
    .catch(error => console.error(error))

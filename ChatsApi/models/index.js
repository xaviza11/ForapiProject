const { model } = require('mongoose')
const {chats,} = require('./schemas')

const Chats = model('chats', chats)

module.exports = {
    Chats,
}

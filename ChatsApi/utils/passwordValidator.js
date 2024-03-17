const seedrandom = require('seedrandom')
const { Users } = require('../models');
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_SECRET_RENOVATE, REQUESTS_LIMIT, JWT_EXPIRATION, REQUESTS_LIMIT_MINUTES, JWT_RENOVATION } = process.env


async function retrieveEmail(id) {
    try {
        const user = await Users.findById(id);
        return user.email;
    } catch (error) {
        console.log(error);
        return false
    }
}

async function passwordValidator(token, email, password) {

    const decodedToken = jwt.decode(token, JWT_SECRET);

    let retrievedEmail

    if (email === null) retrievedEmail = await retrieveEmail(decodedToken.sub)
    else retrievedEmail = email

    if (retrieveEmail === false) return false

    const numbers = [ 17, 6, 2, 18, 20, -6, -1, -11, -13, -18 ]
    let index = 0
    let result = false
    const resArray = []

    for (let i = numbers.length; i > 0; i--) {
        index = index + 1
        const rng = seedrandom(retrievedEmail);
        const rng2 = seedrandom(token)
        const randomNumber = rng()
        const randomNumber2 = rng2()

        const A = 12 * 0.013 - 100 + numbers[i]
        const B = 2 + 1 * A * 0.3 - numbers[i]
        const C = 2023 - 4 * B - A - numbers[i]

        const resBefore = A / B + C * 3 * randomNumber + randomNumber2 * numbers[i]

        const res = parseFloat(resBefore.toFixed(6));


        if (password === res) resArray.push(res)
    }

    if (resArray.length === 1) return true
    else return false
}

module.exports = passwordValidator


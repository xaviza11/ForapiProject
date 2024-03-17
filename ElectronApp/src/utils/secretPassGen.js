const seedrandom = require('seedrandom')

function secretPassGen(token, email) {

    const numbers = [17, 6, 2, 18, 20, -6, -1, -11, -13, -18]
    const randomIndex = Math.floor(Math.random() * numbers.length);

    const semilla = email;
    const rng = seedrandom(semilla);
    const rng2 = seedrandom(token)
    const randomNumber = rng()
    const randomNumber2 = rng2()

    const day = 12 * 0.013 - 100 + numbers[randomIndex]
    const month = 2 + 1 * day * 0.3 - numbers[randomIndex]
    const year = 2023 - 4 * month - day - numbers[randomIndex]

    const roundedValues = day / month + year * 3 * randomNumber + randomNumber2 * numbers[randomIndex]

    const result = parseFloat(roundedValues.toFixed(6));

    return result
}

module.exports = secretPassGen
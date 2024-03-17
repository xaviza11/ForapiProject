const es = require('../languages/index')

function selectLanguage(language) {
    if(language === 'ES' ) return es
    else if (language === null) return es
    else return es
}

module.exports = selectLanguage
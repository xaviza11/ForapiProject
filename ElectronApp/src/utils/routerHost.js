 function selectHost(location) {
    if(location === 'ES' ) return 'https://apidataforapi-production.up.railway.app/'
    else if (location === null) return 'https://apidataforapi-production.up.railway.app/'
    else return alert('FORAPI not work in, ' + location)
}

module.exports = selectHost
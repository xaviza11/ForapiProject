async function createApiKey() {
    const crypto = require('crypto');

    function generateApiKey(length = 32) {
      return crypto.randomBytes(length).toString('hex');
    }
    
    const apiKey = generateApiKey();
    return apiKey
}

module.exports = createApiKey
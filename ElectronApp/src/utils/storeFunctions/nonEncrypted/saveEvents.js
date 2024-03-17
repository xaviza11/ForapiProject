const fs = require('fs')

function saveEvents(event) {
    let dataToStore = { events: [] };

    if (fs.existsSync('src/stg/events.json')) {
        const jsonData = fs.readFileSync('src/stg/events.json', 'utf8');
        dataToStore = JSON.parse(jsonData);
    }

    if (!dataToStore.events) {
        dataToStore.events = [];
    }

    const existingEventCount = dataToStore.events.length;

    event.index = existingEventCount;
    dataToStore.events.push(event);

    const updatedData = JSON.stringify(dataToStore, null, 2);
    fs.writeFileSync('src/stg/events.json', updatedData, 'utf8');
}

module.exports = saveEvents
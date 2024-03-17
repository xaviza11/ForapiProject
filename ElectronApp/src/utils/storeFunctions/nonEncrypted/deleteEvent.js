const fs = require('fs')

function deleteEvent(index) {
    const eventDataFile = 'src/stg/events.json';

    if (fs.existsSync(eventDataFile)) {
        const jsonData = fs.readFileSync(eventDataFile, 'utf8');
        const dataToStore = JSON.parse(jsonData);

        if (Array.isArray(dataToStore.events)) {
            const eventIndex = dataToStore.events.findIndex(event => event.index === index);

            if (eventIndex !== -1) {
                dataToStore.events.splice(eventIndex, 1);
                dataToStore.events.forEach((event, i) => {
                    event.index = i;
                });
                const updatedData = JSON.stringify(dataToStore, null, 2);
                fs.writeFileSync(eventDataFile, updatedData, 'utf8');
            }
        }
    }
}

module.exports = deleteEvent
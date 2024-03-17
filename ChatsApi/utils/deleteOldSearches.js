const cron = require('node-cron');
const { RenovationTokens, Users, Bans, BlackList, Searches } = require('../models/index');

function start() {
    console.log('deleteOldSearches working');
    const task = cron.schedule('0 4 * * *', () => {
        const currentDate = new Date();

        let deletes = 0

        Searches.find({})
            .then(results => {
                results.forEach(search => {
                    const searchDate = new Date(search.date);
                    searchDate.setTime(searchDate.getTime() + 24 * 60 * 60 * 1000);
                    if (searchDate < currentDate) {
                        Search.findByIdAndDelete(search._id, (err) => {
                            if (err) {
                                console.error('Error on delete seaches:', err);
                            } else {
                                deletes = deletes + 1
                                console.log(deletes, 'searches has been deleted')
                            }
                        });
                    }
                });
            })
            .catch(err => {
                console.error('Error on search searches:', err);
            });
    });

    task.start();
}

start();

module.exports = start;
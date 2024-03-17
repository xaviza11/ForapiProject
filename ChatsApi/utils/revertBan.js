const cron = require('node-cron');
const { RenovationTokens, Users, Bans, BlackList } = require('../models/index');

function start() {
    let totalNotBanNow = 0
    const usersToUnban = [];
    console.log('revertBan working');
    const task = cron.schedule('21 * * * *', () => {
        Bans.findOne({})
            .then(bannedUsers => {
                if (bannedUsers) {
                    console.log('there are: ', bannedUsers.usersBans.length, ' users banneds')
                    for (let i = bannedUsers.usersBans.length - 1; i >= 0; i--) {
                        Users.findById(bannedUsers.usersBans[i])
                            .then(user => {
                                const currentDate = new Date()
                                if (currentDate > user.banDate && user.strikes < 3) {
                                    console.log(user.name, 'is not banned now')
                                    user.isBanned = false;
                                    user.save()
                                    totalNotBanNow = totalNotBanNow + 1
                                    usersToUnban.push(user._id.toString());
                                } else if (user.strikes >= 3) {
                                    BlackList.findOneAndUpdate({}, { $push: { blackUsers: { email: user.email, phone: user.phone } } })
                                        .then(() => {
                                            bannedUsers.usersBans.splice(i, 1);
                                            bannedUsers.save();
                                            Users.findByIdAndDelete(user._id)
                                                .then(d => {
                                                    console.log('user: ', d.email, ' whit phone ', d.phone, ' now is on blackList cannot singUp again and use the app.')
                                                })
                                        })
                                }
                            })
                    }
                    Bans.findOneAndUpdate({}, { $pullAll: { usersBans: usersToUnban } })
                        .then(() => {
                            console.log('reverBans finish ----> now are: ', bannedUsers.usersBans.length - totalNotBanNow, 'banneds')
                        })
                }
            })
    });

    task.start();
}

start()

module.exports = start
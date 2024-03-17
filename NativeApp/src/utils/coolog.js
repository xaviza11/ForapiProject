console.log('%cCOOL LOG %cv1.0', 'font-size: 24px;', 'font-size: 12px;')

function log(level, message) {
    let style

    if (level === 'PC')
        style = 'color: green'
    else if (level === 'INFO')
        style = 'color: dodgerblue'
    else if (level === 'NAVIGATE')
        style = 'color: purple'
    else if (level === 'ERROR')
        style = 'color: tomato'
    else if (level === 'FATAL')
        style = 'color: white; background-color: tomato'
    else if (level === 'SAVE')
        style = 'color: orange';

    console.log('%c' + level + ': ' + message, style)
}

log.on = true
log.level = 'PC'

log.pc = function (message) {
    this.on && this.level === 'PC' && this('PC', message)
}

log.info = function (message) {
    this.on && (this.level === 'PC' || this.level === 'INFO') && this('INFO', message)
}

log.navigate = function (message) {
    this.on && (this.level === 'PC' || this.level === 'INFO' || this.level === 'NAVIGATE') && this('NAVIGATE', message)
}

log.error = function (message) {
    this.on && (this.level === 'PC' || this.level === 'INFO' || this.level === 'NAVIGATE' || this.level === 'ERROR') && this('ERROR', message)
}

log.fatal = function (message) {
    this.on && (this.level === 'PC' || this.level === 'INFO' || this.level === 'NAVIGATE' || this.level === 'ERROR' || this.level === 'FATAL') && this('FATAL', message)
}

log.save = function (message) {
    this.on && (this.level === 'PC' || this.level === 'INFO' || this.level === 'NAVIGATE' || this.level === 'ERROR' || this.level === 'FATAL' || this.level === 'SAVE') && this('SAVE', message)
}

export default log
// module.exports = log
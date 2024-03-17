console.log('%cCOOL LOG %cv --- 1.0', 'font-size: 24px;', 'font-size: 12px;')

function log(level, message, error) {
    let style = '';

    if (level === 'INIT')
        style = '\x1b[36;47m';
    else if (level === 'SUCCESS')
        style = '\x1b[30;47m';
    else if (level === 'ERROR')
        style = '\x1b[41;37m';

    const resetStyle = '\x1b[0m';

    console.log(style + level + ': ' + message + error + resetStyle);
}

module.exports = log
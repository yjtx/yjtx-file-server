var child_process = require('child_process');
var exec = child_process.exec;
var path = require('path');
function open(target) {
    var opener;
    switch (process.platform) {
        case 'darwin':
            opener = 'open';
            break;
        case 'win32':
            opener = 'start ""';
            break;
        default:
            opener = path.join(__dirname, 'xdg-open');
            break;
    }
    if (process.env.SUDO_USER) {
        opener = 'sudo -u ' + process.env.SUDO_USER + ' ' + opener;
    }
    return exec(opener + ' "' + escape(target) + '"', null);
}
exports.open = open;
function escape(s) {
    return s.replace(/"/g, '\\\"');
}

//# sourceMappingURL=open.js.map

var exec = require('child_process').exec
    , path = require('path')
    ;


/**
 * open a file or uri using the default application for the file type.
 *
 * @return {ChildProcess} - the child process object.
 * @param {string} target - the file/uri to open.
 * @param {string} appName - (optional) the application to be used to open the
 *      file (for example, "chrome", "firefox")
 * @param {function(Error)} callback - called with null on success, or
 *      an error object that contains a property 'code' with the exit
 *      code of the process.
 */

export function open(target) {
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
    return exec(opener + ' "' + escape(target) + '"');
}

function escape(s) {
    return s.replace(/"/g, '\\\"');
}

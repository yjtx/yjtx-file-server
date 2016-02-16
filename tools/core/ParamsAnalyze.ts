/**
 * Created by yjtx on 16/2/3.
 */
var argv;
export function getArgv() {
    if(argv) {
        return argv;
    }
    var arr = process.argv.slice(2);
    var args = [];
    var i = 0, li = arr.length;
    for (; i < li; i++) {
        var itemi = arr[i];
        if (itemi.search(/-(\w*)/) == 0) break;
        args.push(itemi);
    }

    var opts = {};
    var values4Opt = [];
    var name = null;
    for (; i < li; i++) {
        var itemi = arr[i];
        if (itemi.search(/-(\w*)/) == 0) {
            if (!name) name = itemi;
            else {
                opts[name] = values4Opt;
                name = itemi;
                values4Opt = [];
            }
        } else {
            values4Opt.push(itemi);
        }
    }

    if (name) opts[name] = values4Opt;

    argv = {
        name: arr[0],
        currDir: process.cwd(),
        args: args,
        opts: opts
    };

    return argv;
}

export function getOption(type) {
    if (getArgv()["opts"][type]) {
        return getArgv()["opts"][type][0];
    }
    return null;
}

import path_lib = require("path");

export function getParserRoot() {
    var path = escapePath(process["mainModule"]['filename']);
    return process.env.YJTX_SERVER_PATH || path_lib.dirname(path)+"/";
}

function escapePath(path) {
    if (!path)
        return "";
    return path.split("\\").join("/");
}
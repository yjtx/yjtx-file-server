/**
 * Created by yjtx on 16/2/4.
 */

import os = require("os");

export class IPConfig {

    findIP():string {
        var ipConfig = os.networkInterfaces();
        var ip = "localhost";
        for (var key in ipConfig) {
            var arr = ipConfig[key];
            var length = arr.length;
            for (var i = 0; i < length; i++) {
                var ipData = arr[i];
                if (!ipData.internal && ipData.family == "IPv4") {
                    ip = ipData.address;
                    return ip;
                }
            }
        }
        return ip;
    }
}
/**
 * Created by yjtx on 16/2/4.
 */
import http = require('http');
import url = require('url');
import fs = require('fs');
import path = require('path');
import os = require("os");
import params = require('./core/ParamsAnalyze');

var mine = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "mp3": "audio/mpeg",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};


export class LocalFiles {
    private getMineType(mineType:string):string {
        if (mineType == null) {
            return null;
        }
        return mine[mineType] || mineType;
    }

    onGet(url, mineType:string, response) {
        this.writeFile(url, mineType, response);
    }

    writeFile(url, mineType:string, response) {
        var self = this;

        var realPath = path.join(url);

        var ext = path.extname(realPath);
        ext = ext ? ext.slice(1) : 'unknown';
        fs.exists(realPath, function (exists) {
            if (!exists) {
                response.writeHead(404, {
                    'Content-Type': 'text/plain'
                });
                console.log(realPath);
                response.write("This request URL " + url + " was not found on this server.");
                response.end();
            } else {
                fs.readFile(realPath, "binary", function (err, file) {
                    if (err) {
                        response.writeHead(500, {
                            'Content-Type': 'text/plain'
                        });
                        response.end(err.toString());
                    } else {
                        var contentType = self.getMineType(mineType) || mine[ext] || "text/plain";
                        response.writeHead(200, {
                            'Accept-Ranges': 'bytes',
                            'Content-Type': contentType,
                            'Content-Length': file.length,
                            'Access-Control-Allow-Origin': '*'
                        });
                        response.write(file, "binary");
                        response.end();
                    }
                });
            }
        });
    }
}
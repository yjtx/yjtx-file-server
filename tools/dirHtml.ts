/**
 * Created by yjtx on 16/2/4.
 */
import http = require('http');
import url = require('url');
import fs = require('fs');
import os = require("os");
import params = require('./core/ParamsAnalyze');

import file = require('./core/FileUtil');

export class DirHtml {

    private fileContent;

    private localUrl:string;

    onGet(url, localUrl, response) {
        this.localUrl = localUrl;
        var self = this;

        if (false/*self.fileContent*/) {
            self.writeFile(url, response);
        }
        else {
            var realPath = file.joinPath(params.getParserRoot(), "template/main.html");
            //self.fileContent = file.readBinary(realPath).toString();
            self.fileContent = file.read(realPath);
            self.writeFile(url, response);
            //fs.readFile(realPath, "binary", function (err, file) {
            //    if (err) {
            //        response.writeHead(500, {
            //            'Content-Type': 'text/plain'
            //        });
            //        response.end(err.toString());
            //    } else {
            //        self.fileContent = file;
            //
            //        self.writeFile(url, response);
            //    }
            //});
        }
    }

    writeFile(url, response) {
        var fileContent = this.fileContent;

        var listr = "";
        if (file.relative(url, this.localUrl)) {
            listr += this.getPreFile("..");
        }

        var list = file.getDirectoryListing(url, true);

        for (var i:number = 0; i < list.length; i++) {
            if (file.isDirectory(file.joinPath(url, list[i]))) {
                listr += this.getDir(list[i]);
            }
            else {
                listr += this.getFile(list[i]);
            }
        }
        fileContent = fileContent.replace(/<ul>[\s\S]*<\/ul>/, '<ul>' + listr + "</ul>");

        var contentType = "text/html";
        response.writeHead(200, {
            'Content-Type': contentType,
            //'Content-Length': fileContent.length,
            'Access-Control-Allow-Origin': '*'
        });
        response.write(fileContent);
        response.end();
    }

    private getPreFile(url):string {
        return `<li class="list score_list">
        <div class="list_title list_div_1" >
        <a href="` + url + `/">
                <img src="__yjtx__/back.gif">
        <span class="txt">` + 'Parent Directory' + `</span>
            </a>
            </div>
            </li>`;
    }

    private getDir(fileName:string):string {
        return `<li class="list score_list">
        <div class="list_title list_div_1" >
        <a href="` + fileName + `/">
                <img src="__yjtx__/folder.gif">
        <span class="txt">` + fileName + `/</span>
            </a>
            </div>
            </li>`;
    }

    private getFile(fileName:string):string {
        return `<li class="list score_list">
        <div class="list_title list_div_1" >
        <a href="` + fileName + `">
                <img src="__yjtx__/text.gif">
        <span class="txt">` + fileName + `</span>
            </a>
            </div>
            </li>`;
    }
}
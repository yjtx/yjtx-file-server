/**
 * Created by yjtx on 16/2/16.
 */

import http = require('http');
import fs = require('fs');
import net = require('net');
import url = require('url');
import {LocalFiles} from "./localFiles";
import {DirHtml} from "./dirHtml";

import file = require('./core/FileUtil');
import path = require("path");

import params = require('./core/ParamsAnalyze');

export class ProxyServer {
    host:string;
    port:number;
    localUrl:string;
    server:http.Server;
    private localFiles:LocalFiles;
    private tempHtml:DirHtml;

    public startServer(host:string, port:number, localUrl:string):void {
        this.host = host;
        this.port = port;
        this.localUrl = localUrl;

        this.localFiles = new LocalFiles();
        this.tempHtml = new DirHtml();

        this.server = http.createServer(this.handleRequest.bind(this));
        this.server.listen(this.port, () => {
            console.log("listening on: \033[1;32;1m" + this.host + ":" + this.port + "\033[0m");
            console.log("local root: \033[1;32;1m" + path.resolve(this.localUrl) + "\033[0m");
        });
        this.server.addListener("error", function () {
            process.exit(1501);
        })
    }

    public stopServer():void {

    }

    private getPath(url:string):string {
        var index1:number = url.indexOf("?");
        var index2:number = url.indexOf("#");
        if(index1 < 0) {
            index1 = url.length;
        }
        if(index2 < 0) {
            index2 = url.length;
        }

        return url.substring(0, Math.min(index1, index2));
    }

    private handleRequest(request, response):void {
        var requestUrl:string = request.url;
        requestUrl = decodeURIComponent(requestUrl);

        var tempUrl:string = file.joinPath(this.localUrl, this.getPath(requestUrl));

        if (requestUrl.indexOf("__yjtx__") >= 0) {//内部文件
            this.localFiles.onGet(file.joinPath(params.getParserRoot(), "template", requestUrl.substring(requestUrl.indexOf("__yjtx__"))), null, response);
            return;
        }

        if (file.isDirectory(tempUrl)) {
            if (file.exists(file.joinPath(tempUrl, "index.php"))) {
                this.localFiles.onGet(file.joinPath(tempUrl, "index.php"), null, response);
            }
            //else if (file.exists(file.joinPath(tempUrl, "index.htm"))) {
            //    this.localFiles.onGet(file.joinPath(tempUrl, "index.htm"), null, response);
            //}
            //else if (file.exists(file.joinPath(tempUrl, "index.html"))) {
            //    this.localFiles.onGet(file.joinPath(tempUrl, "index.html"), null, response);
            //}
            else {
                this.tempHtml.onGet(tempUrl, this.localUrl, response)
            }
        }
        else {
            var mineType = request.headers.accept;
            if (mineType) {
                mineType = mineType.split(",")[0];
            }

            this.localFiles.onGet(tempUrl, mineType, response);
        }
    }
}

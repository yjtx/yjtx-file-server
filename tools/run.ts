/**
 * Created by yjtx on 16/2/3.
 */


import http = require('http');
import fs = require('fs');
import net = require('net');
import url = require('url');
import {LocalFiles} from "./localFiles";
import {DirHtml} from "./dirHtml";

import file = require('./core/FileUtil');

import open = require('./open');

class ProxyServer {
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
            addLog(0, "started", "proxy Server listening on: " + this.host + ":" + this.port);
        });
        this.server.addListener("error", function () {
            process.exit(1501);
        })
    }

    public stopServer():void {

    }

    private handleRequest(request, response):void {
        var tempUrl:string = file.joinPath(this.localUrl, request.url);

        console.log("11 " + request.url);

        if (request.url.indexOf("__yjtx__") >= 0) {//内部文件
            this.localFiles.onGet(file.joinPath(params.getParserRoot(), "template", request.url.substring(request.url.indexOf("__yjtx__"))), null, response);
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
            this.localFiles.onGet(tempUrl, null, response);
        }
    }
}

function addLog(code:number, action:string, message:string):void {
    var data = {
        code: code,
        ide: "proxyserver",
        data: {
            action: action,
            message: message
        }
    };
    console.log(JSON.stringify(data));
}

import params = require('./core/ParamsAnalyze');

import {IPConfig} from "./iPConfig";
var ip = new IPConfig();
var host = params.getOption("--ip") || ip.findIP();

var port = params.getOption("--port") || 3000;

var localUrl = params.getOption("--url") || "";

var server = new ProxyServer();
server.startServer(host, port, localUrl);

open.open(host + ":" + port);
/**
 * Created by yjtx on 16/2/3.
 */


import path = require('path');

import open = require('./open');

import params = require('./core/ParamsAnalyze');

import {IPConfig} from "./iPConfig";
var ip = new IPConfig();
var host = params.getOption("--ip") || ip.findIP();

var port = params.getOption("--port") || 3000;

var localUrl = params.getOption("--root") || path.join("");

var indexPath = params.getOption("--index");

import {ProxyServer} from "./ProxyServer";
var server = new ProxyServer();
server.startServer(host, port, localUrl);

var url:string = "http://" + host + ":" + port + "/"
if (indexPath) {
    url += indexPath;
}
open.open(url);

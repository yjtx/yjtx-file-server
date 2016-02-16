/**
 * Created by yjtx on 16/2/3.
 */
var path = require('path');
var open = require('./open');
var params = require('./core/ParamsAnalyze');
var iPConfig_1 = require("./iPConfig");
var ip = new iPConfig_1.IPConfig();
var host = params.getOption("--ip") || ip.findIP();
var port = params.getOption("--port") || 3000;
var localUrl = params.getOption("--url") || path.join("");
var ProxyServer_1 = require("./ProxyServer");
var server = new ProxyServer_1.ProxyServer();
server.startServer(host, port, localUrl);
open.open(host + ":" + port);

//# sourceMappingURL=run.js.map

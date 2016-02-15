/**
 * Created by yjtx on 16/2/3.
 */
var http = require('http');
var localFiles_1 = require("./localFiles");
var dirHtml_1 = require("./dirHtml");
var file = require('./core/FileUtil');
var open = require('./open');
var ProxyServer = (function () {
    function ProxyServer() {
    }
    ProxyServer.prototype.startServer = function (host, port, localUrl) {
        var _this = this;
        this.host = host;
        this.port = port;
        this.localUrl = localUrl;
        this.localFiles = new localFiles_1.LocalFiles();
        this.tempHtml = new dirHtml_1.DirHtml();
        this.server = http.createServer(this.handleRequest.bind(this));
        this.server.listen(this.port, function () {
            addLog(0, "started", "proxy Server listening on: " + _this.host + ":" + _this.port);
        });
        this.server.addListener("error", function () {
            process.exit(1501);
        });
    };
    ProxyServer.prototype.stopServer = function () {
    };
    ProxyServer.prototype.handleRequest = function (request, response) {
        var tempUrl = file.joinPath(this.localUrl, request.url);
        console.log("11 " + request.url);
        if (request.url.indexOf("__yjtx__") >= 0) {
            this.localFiles.onGet(file.joinPath(params.getParserRoot(), "template", request.url.substring(request.url.indexOf("__yjtx__"))), null, response);
            return;
        }
        if (file.isDirectory(tempUrl)) {
            if (file.exists(file.joinPath(tempUrl, "index.php"))) {
                this.localFiles.onGet(file.joinPath(tempUrl, "index.php"), null, response);
            }
            else {
                this.tempHtml.onGet(tempUrl, this.localUrl, response);
            }
        }
        else {
            this.localFiles.onGet(tempUrl, null, response);
        }
    };
    return ProxyServer;
})();
function addLog(code, action, message) {
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
var params = require('./core/ParamsAnalyze');
var iPConfig_1 = require("./iPConfig");
var ip = new iPConfig_1.IPConfig();
var host = params.getOption("--ip") || ip.findIP();
var port = params.getOption("--port") || 3000;
var localUrl = params.getOption("--url") || "";
var server = new ProxyServer();
server.startServer(host, port, localUrl);
open.open(host + ":" + port);

//# sourceMappingURL=run.js.map

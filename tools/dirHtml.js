var params = require('./core/ParamsAnalyze');
var file = require('./core/FileUtil');
var DirHtml = (function () {
    function DirHtml() {
    }
    DirHtml.prototype.onGet = function (url, localUrl, response) {
        this.localUrl = localUrl;
        var self = this;
        if (false /*self.fileContent*/) {
            self.writeFile(url, response);
        }
        else {
            var realPath = file.joinPath(params.getParserRoot(), "template/main.html");
            //self.fileContent = file.readBinary(realPath).toString();
            self.fileContent = file.read(realPath);
            self.writeFile(url, response);
        }
    };
    DirHtml.prototype.writeFile = function (url, response) {
        var fileContent = this.fileContent;
        var listr = "";
        if (file.relative(url, this.localUrl)) {
            listr += this.getPreFile("..");
        }
        var list = file.getDirectoryListing(url, true);
        for (var i = 0; i < list.length; i++) {
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
    };
    DirHtml.prototype.getPreFile = function (url) {
        return "<li class=\"list score_list\">\n        <div class=\"list_title list_div_1\" >\n        <a href=\"" + url + "/\">\n                <img src=\"__yjtx__/back.gif\">\n        <span class=\"txt\">" + 'Parent Directory' + "</span>\n            </a>\n            </div>\n            </li>";
    };
    DirHtml.prototype.getDir = function (fileName) {
        return "<li class=\"list score_list\">\n        <div class=\"list_title list_div_1\" >\n        <a href=\"" + fileName + "/\">\n                <img src=\"__yjtx__/folder.gif\">\n        <span class=\"txt\">" + fileName + "/</span>\n            </a>\n            </div>\n            </li>";
    };
    DirHtml.prototype.getFile = function (fileName) {
        return "<li class=\"list score_list\">\n        <div class=\"list_title list_div_1\" >\n        <a href=\"" + fileName + "\">\n                <img src=\"__yjtx__/text.gif\">\n        <span class=\"txt\">" + fileName + "</span>\n            </a>\n            </div>\n            </li>";
    };
    return DirHtml;
})();
exports.DirHtml = DirHtml;

//# sourceMappingURL=dirHtml.js.map

'use strict';

var fs        = require('fs');
var qfs       = require("q-io/fs");
var marked    = require('marked');
var highlight = require("highlight.js");
var pointer   = require("json-pointer");

var css = fs.readFileSync(__dirname + "/style/def.css", 'utf8');

marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: true,
    sanitize: true,
    smartLists: true,
    smartypants: true,
    highlight: function (code) {
        return highlight.highlightAuto(code).value;
    }
});

module.exports = function(args){
    var dir = args.path;
    var documentDirs = {};
    if(!dir) throw "Path required!";

    return function(req, res, next){
        if ( documentDirs[req.url] ){
            fs.readFile(documentDirs[req.url], 'utf8', function(err, data){
                if(err) return next();
                marked(data, function (err, content) {
                    if (err) throw err;
                    res.send("<head><style>"+css+"</style></head>"+content);
                });
            });
        } else {
            var url = req.protocol + '://' + req.get('Host');
            walk(dir).then(function(list){
                res.send( "<head><style>"+css+"</style></head>" + renderList(list , "Specifications", url));
            });
        }

        function walk(dir){
            return qfs.listTree(dir).then(function(data){
                var obj = {};
                data.map(function(point){
                    var pathRe = new RegExp(dir);
                    var point  = point.replace(pathRe, "");
                    if(  (/.md/).test(point) ){
                        pointer.set(obj, point.replace(/\.md/, ""), point.replace(/\//, ""));
                        documentDirs[point] = dir + point;
                    }
                });
                return obj;
            });
        }

        function renderList(list, name, url){
            var html ="<h3>"+ name + "</h3><ul>";
            for( var key in list){
                if ( typeof list[key] == "object" ){
                    html += renderList(list[key], key, url);
                } else {
                    html += '<li><a href="'+url+'/'+list[key]+'">' + key.replace(/\..*/, "") + "</a></li>";
                }
            }
            html += "</ul>";
            return html;
        }
    };
};

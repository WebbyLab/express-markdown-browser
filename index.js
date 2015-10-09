'use strict';

var fs        = require('fs');
var qfs       = require("q-io/fs");
var marked    = require('marked');
var highlight = require("highlight.js");
var pointer   = require("json-pointer");
var Q         = require("q");
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
    var allowedFilesPaths;
    var list;
    if (!dir) throw "Path required!";
    return function(req, res, next){

        init().then(function(){
            if ( allowedFilesPaths[req.query.page] ){
                fs.readFile(allowedFilesPaths[req.query.page], 'utf8', function(err, data){
                    if (err) return next();
                    marked(data, function (err, content) {
                        if (err) throw err;
                        res.send("<head><style>"+css+"</style></head>"+content);
                    });
                });
            } else {
                var url = req.originalUrl.replace(/\?.*/, '');
                res.send( "<head><style>"+css+"</style></head>" + renderList(list , "Specifications", url));
            }
        });

        function walk(dir){

            allowedFilesPaths = {};
            list = {};

            return qfs.listTree(dir).then(function(data){
                data.map(function(point){
                    var pathRe = new RegExp(dir);
                    point      = point.replace(pathRe, "");
                    if(  (/.md/).test(point) ){
                        var purePoint = point.replace(/\.md/, "");
                        pointer.set(list, purePoint, purePoint);
                        allowedFilesPaths[purePoint] = dir + point;
                    }
                });
            });
        }

        function renderList(list, name, url){
            var html ="<h3>"+ name + "</h3><ul>";
            for( var key in list){
                if ( typeof list[key] == "object" ){
                    html += renderList(list[key], key, url);
                } else {
                    html += '<li><a href="'+url+'?page='+list[key]+'">' + key.replace(/\..*/, "") + "</a></li>";
                }
            }
            html += "</ul>";
            return html;
        }

        function init(){
            if ( !allowedFilesPaths || !list ){
                return walk(dir);
            } else {
                return Q();
            }
        }
    };
};

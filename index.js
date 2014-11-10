'use strict';

var marked    = require('marked');
var fs        = require('fs');
var highlight = require("highlight.js");

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
    if(!dir) throw "Path required!";
    var css = fs.readFileSync(__dirname + "/style/def.css", 'utf8');

    return function(req, res, next){

        if ((/\.md/).test(req.url)){
            var md;
            try {
                md = fs.readFileSync("." + req.url, 'utf8');
            } catch(e) {
                return next();
            }
            marked(md, function (err, content) {
                if (err) throw err;
                res.send("<head><style>"+css+"</style></head>"+content);
            });
        } else {
            var url = req.protocol + '://' + req.get('Host');
            res.send( "<head><style>"+css+"</style></head>" + renderList(walk(dir), "Specifications", url));
        }

        function walk(dir, prefix){
            if(!prefix) prefix = dir.replace(/.*\//, "");
            var filesTree = {};
            var files;
            try {
                files = fs.readdirSync(dir);
            } catch(e) {
                return next();
            }
            for (var i = 0; i < files.length; i++){
                if ( !files[i].match(/\./g) ){
                    filesTree[files[i]] = walk(dir + "/" + files[i], prefix + "/" + files[i] );
                } else {
                    filesTree[files[i]] = prefix + "/" + files[i] ;
                }
            }

            return filesTree;
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

'use strict';

var port = 9950;

var assert  = require('chai').assert;
var express = require('express');
var request = require('request');
var Emb     = require("../index.js");

var link;

var emb = new Emb({path: __dirname + "/test-apidoc"});
var app = express();

var server = app.listen(port);
app.get('/echo', function(req, res){
    res.send("echo");
});

app.use(emb);

test('Positive: check route.', function(done) {
    request.get("http://127.0.0.1:9950/echo", function optionalCallback(err, httpResponse, body) {
        assert.deepEqual(body, "echo");
        done();
    });
});

test('Positive: Specification list.', function(done) {
    request.get("http://127.0.0.1:9950/echosfdfvc", function optionalCallback(err, httpResponse, body) {
        var moviesRegExp = new RegExp("<h3>movies</h3>");
        var usersRegExp  = new RegExp("<h3>users</h3>");
        var linkRegExp   = new RegExp("http://127.0.0.1:9950/movies/create.md");
        var linkRegExp2  = new RegExp("http://127.0.0.1:9950/users/create.md");

        assert.ok(moviesRegExp.test(body));
        assert.ok(usersRegExp.test(body));
        assert.ok(linkRegExp.test(body));
        assert.ok(linkRegExp2.test(body));

        link = body.match(/href=[\'"]?([^\'" >]+)/)[1];

        done();
    });
});

test('Positive: Check link with md file', function(done) {
    request.get( link, function optionalCallback(err, httpResponse, body) {
        var mainTitleRegExp = new RegExp('<h1 id="movies-create">Movies Create</h1>');
        var titleRegExp     = new RegExp('<span class="hljs-string">"Scarface"</span>');
        var yearRegExp      = new RegExp('<span class="hljs-number">1983</span>');

        assert.ok(mainTitleRegExp.test(body));
        assert.ok(titleRegExp.test(body));
        assert.ok(yearRegExp.test(body));
        done();
    });
});

after(function(done) {
    server.close();
    done();
});





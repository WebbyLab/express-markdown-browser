[![Build Status](https://travis-ci.org/WebbyLab/express-markdown-browser.svg?branch=master)](https://travis-ci.org/WebbyLab/express-markdown-browser)

#Express-Markdown-Browser

>Express middleware for viewing documentation in markdown

## Install

``` bash
npm install express-markdown-browser --save
```

## Usage

For route:

```js
var Emb = require('express-markdown-browser');
var emb = new Emb({path: __dirname + "/apidoc"});

var app = express();

app.get('/apidoc', emb);
```
After GET request to http:/yoursite.com/apidoc you will see specifications list for you project.


For all request without route:

```js
var Emb = require('express-markdown-browser');
var emb = new Emb({path: __dirname + "/apidoc"});

var app = express();

app.get('/echo', function(req, res){
    res.send("echo");
});

app.get('/echo2', function(req, res){
    res.send("echo2");
});

app.use(emb);
```
After GET request to any free route (example: http://yoursite.com/somthing or http://yoursite.com/3242) you will see specifications list for you project.

### Contribution and License Agreement

If you contribute code to this project, you are implicitly allowing your code
to be distributed under the MIT license. You are also implicitly verifying that
all code is your original work. `</legalese>`

## License

Copyright (c) 2014, Webbylab. (MIT License)

See LICENSE for more info.


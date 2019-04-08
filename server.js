// modules =================================================
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var swaggerTools = require('swagger-tools');
var YAML = require('yaml-js');
var env = process.env.NODE_ENV || 'development';
var config = require('config').get(env);
var cors = require('cors');
var resolve = require('json-refs').resolveRefs;
var rfs = require('rotating-file-stream');
var fs = require('fs');
var path = require('path');
var configg = require("config");
var DataPower = configg.get('DataPower');
var _mongoDB = configg.get('MongoDB');
var qs = require('query-string');
const https = require('https');
// configuration ===========================================

// config files
// var db = require('./config/db');
const httpsOptions = {
  key: fs.readFileSync('./certificates/lexicon.key'),
  cert: fs.readFileSync('./certificates/7e41fb84d80d28a7.crt'),
  ca: fs.readFileSync('./certificates/gd_bundle-g2-g1.crt'),
  requestCert: true,
  rejectUnauthorized: false
};

var port = process.env.PORT || 443; // set our port
// mongoose.connect(db.url); // connect to our mongoDB database (commented out after you enter in your own credentials)

// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
  type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({
  extended: false
})); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
var root = YAML.load(fs.readFileSync(path.join(__dirname, 'app/swagger') + '/swagger.yaml').toString());
root.host = config.get('swaggerHost');
root.securityDefinitions.OAuth2.tokenUrl = DataPower.baseUrl;
var options = {
  filter: ['relative', 'remote'],
  loaderOptions: {
    processContent: function (res, callback) {
      callback(null, YAML.load(res.text));
    }
  }
};

// global error handler
function errorHandler(err, req, res, next) {
  console.log("Error: ", err);
  if (res.headersSent) {
    return next(err);
  } else {
    res.status(res.statusCode || 500).json(err);
  }
}

// handles timed out requests
function haltOnTimedout(req, res, next) {
  if (!req.timedout) {
    next();
  } else {
    next(new Error("the request timed out"), null, null, null, 504);
  }
}

global.getParams = function (_qs, flag) {
  var stringParams = decodeURI(qs.stringify(_qs));
  return flag ? '&' + stringParams : '?' + stringParams
}

// Comman header set for request
global.setOption = function (authorization) {
  if (authorization) {
    authorization = authorization.charAt(0).toUpperCase() +
      authorization.slice(1)
  }
  return {
    'content-type': 'application/json',
    authorization: authorization,
    'x-ibm-client-id': DataPower.client_id,
    'x-ibm-client-secret': DataPower.client_secret
  }
}

global.parseString = function (str) {
  return typeof str === 'string' ? JSON.parse(str) : str
}

global.isNull = function (param) {

  return (param !== '' && param !== null) ? true : false;
}

global.mergeObject = function (target) {
  var sources = [].slice.call(arguments, 1);
  sources.forEach(function (source) {
    for (var prop in source) {
      target[prop] = source[prop];
    }
  });
  return target;
}
resolve(root, options).then(function (results) {
  swaggerTools.initializeMiddleware(results.resolved, function (middleware) {
    // Serves the Swagger UI on /docs
    var routerConfig = {
      controllers: './app/controllers',
      useStubs: false
    };
    app.use(cors());
    /*  app.use(morgan('tiny'))
     app.use(morgan('combined', {
       stream: accessLogStream
     })) */
    app.use(middleware.swaggerMetadata());

    // Provide the security handlers
    app.use(middleware.swaggerSecurity({
      OAuth2: function (req, def, scopes, callback) {
        callback()
      }
    }));

    // Validate Swagger requests
    app.use(middleware.swaggerValidator());
    app.use(middleware.swaggerRouter(routerConfig));
    app.use(middleware.swaggerUi());
    app.use(errorHandler);
    app.use(haltOnTimedout);
    app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

    // MongoDB connection.
    mongoose.Promise = global.Promise;
    mongoose.connect(_mongoDB.url, _mongoDB.credentials, function (err, resp) {
      if (err) {
        return err;
      } else {
        console.log('💡  Connected successfully to MongoDB');
      }
    });
    console.log('📌 ',_mongoDB.url);
    https.createServer(httpsOptions, app).listen(port, () => {
      console.log('🏃‍  Server running at ' + port);
    }).timeout = 300000;
  });
});


console.log('🔥  Magic happens on port ' + port); // shoutout to the user
exports = module.exports = app; // expose app
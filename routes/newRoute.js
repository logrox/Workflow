var express = require('express');
var router = express.Router();
const fs = require('fs');
var app;

/* GET listing all methods */
router.route('/')
    .get(function (req, res, next) {
        res.render('newRoute');
    });

/* Dodawanie funkcji dla restów */

router.get(['/fn/list'], function (req, res, next) {
    var fnRoute = req.app.get('fnRoute');
    res.json(Object.keys(fnRoute));
});

router
    .post("/fn/save", function (req, res, next) {
        var fnRoute = req.app.get('fnRoute');
        fs.writeFile(__dirname + '/functionList.json', JSON.stringify(fnRoute), "utf8", function (err) {
            if (!err) {
                res.send(201);
            } else next(err);
        })
    });

router.route(['/fn', '/fn/:index'])
    .get(function (req, res, next) {
        var fnRoute = req.app.get('fnRoute');
        if (req.params.index) {
            if (fnRoute[req.params.index])
                res.json(fnRoute[req.params.index]);
            else {
                var err = new Error("Nie znaleziono funkcji");
                err.status = 400;
                next(err);
            }
        } else {
            res.json(fnRoute);
        }
    })
    .post(function (req, res, next) {
        var fnRoute = req.app.get('fnRoute');
        if (req.body && req.body.name && req.body.body) {
            var name = req.body.name;
            var body = {
                body: req.body.body,
                description: req.body.description
            };
            fnRoute[name] = body;
            res.send(fnRoute);
        } else {
            var err = new Error("Błąd dodawania zasobu.");
            err.status = 400;
            next(err);
        }
    })
    .put(function (req, res, next) {
        next();
    });


/*Dodawanie restów*/


var route_get = function (req, res, next) {
    "use strict";
    var rest = [];
    app.stack.forEach(function (item, index) {
        rest.push({
            index: index,
            path: item.route.path
        })
    });
    res.json(rest);
};

router.route(['/route', '/route/:index'])
    .get(route_get)
    .delete(function (req, res, next) {
        "use strict";
        try {
            if (req.params.index) {
                app.stack.splice(Number(req.params.index), 1);
                res.send(204);
            } else {
                var err = new Error("Błąd kasowania zasobu.");
                err.status = 400;
                next(err);
            }
        } catch (e) {
            next(e);
        }
    }, route_get)
    .post(function (req, res, next) {
        "use strict";
        //console.log('req.body:',req.body);
        try {
            if (true) {

                /*
                 todo sprawdzić parametrów
                 todo dorobić path typu Array
                 */
                /*
                 req.body.path.forEach(function (path) {
                 pathTab.push(path);
                 });
                 */

                app[(req.body.method ? req.body.method.toLowerCase() : null) || 'get']
                (req.body.path, function ($$fnName) {
                    return function (req, res, next) {
                        "use strict";
                        eval('{' + req.app.get('fnRoute')[$$fnName] + '}');
                    }
                }(req.body.fnName));
                res.send(204);
            } else {
                var err = new Error("Błąd dodawanie zasobu.");
                err.status = 400;
                next(err);
            }
        } catch (e) {
            next(e);
        }
    });

module.exports = function (self) {
    app = self;
    return router;
};

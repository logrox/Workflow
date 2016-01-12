var express = require('express');
var router = express.Router();
var app;
/* GET listing all methods */
router.route('/___')
    .get(function (req, res, next) {
        res.render('newRoute');
    });

/* Dodawanie funkcji dla restów */

router.route(['/fn', '/fn/:index'])
    .all(function (req, res, next) {
        var fnRoute = req.app.get('fnRoute');
        console.log('t:', fnRoute);
        next();
    })
    .get(function (req, res, next) {
        var fnRoute = req.app.get('fnRoute');
        if (req.params.index) {
            if (fnRoute[req.params.index])
                res.json(fnRoute[req.params.index]);
            else next(Error('Nie znaleziono funkcji'))
        } else {
            res.json(Object.keys(fnRoute));
        }
    })
    .post(function (req, res, next) {
        var fnRoute = req.app.get('fnRoute');

        var name = req.body.name;
        var body = req.body.body;
        fnRoute[name] = body;
        res.send(204);
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

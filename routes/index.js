var express = require('express');
var router = express.Router();
/*Miejsce na dane z podłąconych aplikacji*/
router.use(function (req, res, next) {
    next();
});
module.exports = router;

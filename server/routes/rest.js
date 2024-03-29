var express = require("express");
var router = express.Router();
var problemService = require("../services/problemService");
var bodyParser = require("body-parser")
var jsonParser = bodyParser.json();

router.get("/problems", function(req, res) {
    problemService.getProblems()
        .then(problems => res.json(problems));
})

router.get("/problems/:id", function(req, res) {
    let id = req.params.id;
    problemService.getProblem(+id)
        .then(problem => res.json(problem))
})

router.post("/problems", jsonParser, (req, res) => {
    problemService.addProblem(req.body)
        .then(problem => {
            res.json(problem)
        }, error => {
            res.status(400).send("Problem name already exists");
        })
})

module.exports = router;

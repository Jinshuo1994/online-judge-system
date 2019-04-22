var ProblemModel = require("../models/problemModel")

var getProblems = function() {
    return new Promise((res, rej) => {
        ProblemModel.find({}, function(err, problems) {
            if (err) {
                rej(err);
            } else {
                res(problems)
            }
        })
    });
}

var getProblem = function(id) {
    return new Promise((res, rej) => {
        ProblemModel.findOne({id: id}, function(err, problems) {
            if (error) {
                rej(err);
            } else {
                res(problems)
            }
        })
    });
}

var addProblem = function(newProblem) {
    return new Promise((res, rej) => {
        ProblemModel.findOne({name: newProblem.name}, function(err, problem) {
            if (problem) {
                rej("Problem already exists");
            } else {
                ProblemModel.count({}, function (err, num) {
                    newProblem.id = num + 1;

                    var mongoProblem = new ProblemModel(newProblem);
                    mongoProblem.save();
                    res(newProblem);
                });
                res(newProblem)
            }
        })
    })
}

module.exports = {
    getProblems: getProblems,
    getProblem: getProblem,
    addProblem
}

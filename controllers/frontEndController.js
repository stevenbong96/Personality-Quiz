const express = require("express");
const router = express.Router();
const db = require("../models");

// Display Home Page
router.get("/", function (req, res) {
    db.quiz.findAll({}).then(result => {
        let resultJSON = result.map(obj => obj.toJSON());
        let homeObj = {
            // Find All quizzes that match our featured criteria
            featuredQuizzes: resultJSON.slice(resultJSON.length - 4, 3),
            // All Quizzes
            // Maybe future release (exlcude the featured quizzes from All Quizzes)
            allQuizzes: resultJSON
        }
        res.render("home", homeObj)
    }).catch(err => {
        res.status(500).end();
    })
})

// Display a quiz by ID
router.get("/quiz/:id", function (req, res) {
    let quiz = db.quiz.findOne({
        where: {
            id: req.params.id
        }
    }).then(result => {
        if (!result) {
            return res.status(500).send("EEP Doesnt exist");
        }
        let resultJSON = result.toJSON();
        let Quiz = { Quiz: resultJSON.quiz_name }
        res.render("quiz", Quiz)
    }).catch(err => {
        res.status(500).end();
    })
})

// Display the profile page
router.get("/profile/:id", function (req, res) {
    db.user.findOne({
        where: {
            id: req.params.id
        }
    }).then(user=> {

        let userJSON = user.toJSON();

        db.quizTaken.findAll({
            where: {
                userId: req.params.id
            },
            include: {model: db.personality}
        }).then(quizHistory => {
            let quizHistoryJSON = quizHistory.map(obj => obj.toJSON());
                let userObj = {
                    user:userJSON,
                    quizHistory: quizHistoryJSON
                }
            console.log(userObj);
            res.render("profile", userObj);
        }).catch(err => {
            console.log(err)
            res.status(500).end();
        })
    }).catch(err => {
        res.status(500).end();
    })
});

// Display the questions page
// router.get("/question/:id", function(req, res) {
//     db.quiz.findOne({
//         where:{
//             id: req.params.id
//         },
//         include:[db.answer, db.quiz]
//     }).then(result => {
//         const questionJSON = quiz.toJSON();
//         console.log(questionJSON);
//         res.render("quiz", questionJSON);
//     })
// });

module.exports = router;
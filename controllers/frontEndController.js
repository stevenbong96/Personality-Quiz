const express = require("express");
const router = express.Router();
const db = require("../models");

// Display Home Page
router.get("/", function (req, res) {
    db.quiz.findAll({}).then(result => {
        let resultJSON = result.map(obj => obj.toJSON());
        let homeObj = {
            // Find All quizzes that match our featured criteria
            // Current Featured Criteria: 3 Most Recent Quizzes
            // TODO: Develop a better way to show featured quizzes 
            featuredQuizzes: resultJSON.slice(resultJSON.length - 4, -1),
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
    db.quiz.findOne({
        where: {
            id: req.params.id
        }
    }).then(result => {
        if (!result) {
            return res.status(500).send("EEP Doesnt exist");
        }
        let resultJSON = result.toJSON();
        let Quiz = { quiz: resultJSON.quiz_name, quizID: req.params.id }
        res.render("quiz", Quiz)
    }).catch(err => {
        res.status(500).end();
    })
})

// Display the profile page
router.get("/profile/:id", function (req, res) {
    if (req.session.user) {
        db.user.findOne({
            where: {
                id: req.params.id
            }
        }).then(user => {
            let userJSON = user.toJSON();
            userJSON.archetypeSum = userJSON.archetype_1
                + userJSON.archetype_2
                + userJSON.archetype_3
                + userJSON.archetype_4
                + userJSON.archetype_5
                + userJSON.archetype_6
                + userJSON.archetype_7
                + userJSON.archetype_8
                + userJSON.archetype_9
                + userJSON.archetype_10
                + userJSON.archetype_11
                + userJSON.archetype_12;

            db.quizTaken.findAll({
                where: {
                    userId: req.params.id
                },
                include: [{ model: db.personality }, { model: db.quiz }]
            }).then(quizHistory => {
                let quizHistoryJSON = quizHistory.map(obj => obj.toJSON());
                let userObj = {
                    user: userJSON,
                    quizHistory: quizHistoryJSON
                }
                console.log(userObj.quizHistory[0]);
                res.render("profile", userObj);
            }).catch(err => {
                console.log(err)
                res.status(500).end();
            })
        }).catch(err => {
            res.status(500).end();
        })
    } else {
        res.status(401).redirect("/login")
    }
});

router.get("/login", (req, res) => {
    res.render("login", { user: req.session.user })
})

router.get("/signup", (req, res) => {
    res.render("signup", { user: req.session.user })
})

module.exports = router;
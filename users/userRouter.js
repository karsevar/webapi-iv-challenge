const express = require('express');
const userDb = require('./userDb.js');
const postDb = require('../posts/postDb.js')

const router = express.Router();

router.use(express.json());

router.post('/', validateUser, (req, res) => {
    const userObject = req.body;

    userDb.insert(userObject)
        .then(results => {
            res.status(200).json(results)
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
    console.log(req.user);
    const postObject = req.body;
    postObject.user_id = req.user.id;
    postDb.insert(postObject) 
        .then(results => {
            res.status(200).json(results)
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

router.get('/', (req, res) => {
    userDb.get()
        .then(results => {
            res.status(201).json(results)
        })
        .catch(error => {
            res.status(500).json(error) 
        })
});

router.get('/:id', validateUserId, (req, res) => {
    res.status(201).json(req.user)
});

router.get('/:id/posts', validateUserId, (req, res) => {
    userDb.getUserPosts(req.user.id)
        .then(results => {
            res.status(201).json(results) 
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

router.delete('/:id', validateUserId, (req, res) => {
    userDb.remove(req.user.id) 
        .then(results => {
            res.status(200).json({statusCode: results})
        })
        .catch(error => {
            res.status(500).json(results)
        })
});

router.put('/:id', validateUserId, validateUser, (req, res) => {
    userDb.update(req.user.id, req.body)
        .then(results => {
            res.status(200).json({statusCode: results})
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

//custom middleware

function validateUserId(req, res, next) {
    const userId = req.params.id;

    userDb.getById(userId) 
        .then(results => {
            if (results === undefined) {
                res.status(400).json({ message: "invalid user id" })
            } else {
                req.user = results
                next();
            }
        })
};

function validateUser(req, res, next) {
    // console.log('request body from the validateUser function', !Object.keys(req.body).length)
    if (!Object.keys(req.body).length) {
        res.status(400).json({ message: "missing user data" });
    } else {
        if (req.body.name) {
            next();
        } else {
            res.status(400).json({ message: "missing required name field" })
        }
    }
};

function validatePost(req, res, next) {
    if (!Object.keys(req.body).length) {
        res.status(400).json({ message: "missing post data" })
    } else {
        if (req.body.text) {
            next();
        } else {
            res.status(400).json({ message: "missing required text field" })
        }
    }
};

module.exports = router;

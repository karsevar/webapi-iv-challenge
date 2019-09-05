const express = require('express');
const postDb = require('./postDb.js')

const router = express.Router();

router.use(express.json());

router.get('/', (req, res) => {
    postDb.get()
        .then(results => {
            res.status(201).json(results)
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

router.get('/:id', validatePostId, (req, res) => {
    postDb.getById(req.post.id) 
        .then(results => {
            res.status(201).json(results)
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

router.delete('/:id', validatePostId, (req, res) => {
    postDb.remove(req.post.id) 
        .then(results => {
            res.status(200).json({statusCode: results})
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
    postDb.update(req.post.id, req.body)
        .then(results => {
            res.status(200).json(results)
        })
        .catch(error => {
            res.status(500).json(error)
        })
});

// custom middleware

function validatePostId(req, res, next) {
    const postId = req.params.id;

    postDb.getById(postId) 
        .then(results => {
            if (results === undefined) {
                res.status(400).json({ message: "invalid post id" })
            } else {
                req.post = results
                next();
            }
        })
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
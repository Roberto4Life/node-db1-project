const express = require('express');
const { count } = require('../data/dbConfig');
const db = require('../data/dbConfig')


const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const accounts = await db('accounts');
        res.json(accounts);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error retrieving Accounts"});
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const accounts = await db.select('*').from('accounts').where({id});
        if (accounts) {
            res.status(200).json(accounts);
        } else {
            res.status(400).json({message: "Account not found"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error"});
    }
});

router.post('/', async (req, res) => {
    const accountData = req.body;
    try {
        const account = await db.insert(accountData).into('accounts');
        res.status(201).json(account);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Database error"});
    }
});

router.put('/:id', (req, res) => {
    const {id} = req.params
    const changes = req.body;

    db('accounts').where({id}).update(changes)
        .then(count => {
            if (count) {
                res.status(200).json({updated: count});
            } else {
                res.status(500).json({message: "Invalid ID"});
            }
        })
        .catch(err => {
            res.status(500).json({message: "Database error"})
        }) 
});

router.delete('/:id', async (req, res) => {
    const {id} = req.params;
    try {
        const count = await db.del().from('accounts').where({id});
        count ? res.status(200).json({ deleted: count })
        : res.status(404).json({message: 'invalid id'});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Error"});
    }
});

module.exports = router;
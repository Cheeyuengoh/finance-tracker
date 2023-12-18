import express from 'express';
import db from '../db/conn.mjs';
import createUUID from '../middlewares/uuid.mjs';
import { Double } from 'mongodb';

const collection = db.collection('Transactions');
const router = express.Router();

router.post('/create', createUUID, async (req, res) => {
    let transactionObj = {
        uuid: req.body.uuid,
        transaction: req.body.transaction,
        category: req.body.category,
        date: new Date(req.body.date),
        amount: new Double(req.body.amount),
        note: req.body.note
    }
    let result = await collection.insertOne(transactionObj);
    res.status(200).send({ message: 'Successfully created a transaction', insertedId: result.insertedId });
});

router.post('/', async (req, res) => {
    let dateRegex;
    if (req.body.month) {
        dateRegex = new RegExp('^((' + req.body.year + ')-(0?' + req.body.month + ')-(\\d{2}))')
    } else {
        dateRegex = new RegExp('^((' + req.body.year + ')-(\\d{2})-(\\d{2}))')
    }
    let aggregateObj = [{
        $match: {
            transaction: req.body.transaction ? req.body.transaction : { $exists: true },
            $and: [
                {
                    $expr: {
                        $regexMatch: {
                            input: {
                                $dateToString: {
                                    date: "$date",
                                    format: "%Y-%m-%d"
                                }
                            },
                            regex: dateRegex
                        }
                    }
                },
                {
                    $expr: {
                        $cond: {
                            if: {
                                $size: [
                                    req.body.category
                                ]
                            },
                            then: {
                                $in: [
                                    "$category",
                                    req.body.category
                                ]
                            },
                            else: {}
                        }
                    }
                },

            ]
        }
    }, {
        $sort: {
            date: -1
        }
    }, {
        $group: {
            _id: { $month: '$date' },
            transactions: {
                $push: '$$ROOT'
            }
        }
    }, {
        $sort: {
            _id: -1
        }
    }];
    let result = await collection.aggregate(aggregateObj).toArray();
    res.status(200).send(result);
});

router.post('/update', async (req, res) => {
    let updateObj = {
        transaction: req.body.transaction,
        category: req.body.category,
        date: new Date(req.body.date),
        amount: req.body.amount,
        note: req.body.note
    };

    let result = await collection.updateOne({ uuid: req.body.uuid }, { $set: updateObj });
    if (result.modifiedCount === 0) {
        res.status(400).send({ message: 'Fail to update a transaction', result: result })
    } else {
        res.status(200).send({ message: 'Successfully updated a transaction', result: result });
    }
});

router.post('/delete', async (req, res) => {
    let result = await collection.deleteOne({ uuid: req.body.uuid });
    if (result.deletedCount === 0) {
        res.status(400).send({ message: 'Fail to delete a transaction', result: result })
    } else {
        res.status(200).send({ message: 'Successfully deleted a transaction', result: result });
    }
});

export default router;
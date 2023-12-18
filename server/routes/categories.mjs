import express from 'express';
import db from '../db/conn.mjs';

const collection = db.collection('Categories');
const router = express.Router();

router.get('/types', async (req, res) => {
    let result = await collection.distinct("type");
    res.status(200).send(result);
});

router.get('/', async (req, res) => {
    let result = await collection.distinct('items', { type: req.query.q });
    res.status(200).send(result);
});

router.post('/create', async (req, res) => {
    let result = await collection.updateOne({ type: req.body.transaction }, { $push: { items: req.body.category } });
    if (result.modifiedCount === 0) {
        res.status(400).send({ message: 'Fail to create a category', result: result });
    } else {
        res.status(200).send({ message: 'Successfully created a category', result: result });
    }
});

router.post('/update', async (req, res) => {
    let result = await collection.updateOne({ type: req.body.transaction, items: req.body.oldCategory }, { $set: { "items.$": req.body.newCategory } });
    if (result.modifiedCount === 0) {
        res.status(400).send({ message: 'Fail to edit a category', result: result });
    } else {
        res.status(200).send({ message: 'Successfully edited a category', result: result });
    }
});

router.post('/delete', async (req, res) => {
    let result = await collection.updateOne({ type: req.body.transaction }, { $pull: { items: req.body.category } });
    if (result.modifiedCount === 0) {
        res.status(400).send({ message: 'Fail to delete a category', result: result });
    } else {
        res.status(200).send({ message: 'Successfully deleted a category', result: result });
    }
});

export default router;
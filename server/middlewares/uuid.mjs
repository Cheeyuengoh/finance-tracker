import { v4 as uuidv4 } from 'uuid';

export default function createUUID(req, res, next) {
    req.body.uuid = uuidv4();
    next();
}
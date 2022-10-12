import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {feedback} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('feedback').updateOne(new ObjectID(feedback._id), {
        $set : {
            message : feedback.message,
            submitted : feedback.submitted,
            successfullSwap : feedback.successfullSwap
        }
    })
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(500).json({'error' : 'did not update feedback info'})
    }
}

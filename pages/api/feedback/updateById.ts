import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {id, msg, successful} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('feedback').updateOne({_id : new ObjectID(id)}, {
        $set : {
            message : msg,
            submitted :true,
            successfullSwap : successful
        }
    })
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(500).json({'error' : 'did not update feedback info'})
    }
}

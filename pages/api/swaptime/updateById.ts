import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {swaptime} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('swaptime').updateOne(new ObjectID(swaptime._id), {
        $set : {
            time : swaptime.time
        }
    })
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(500).json({'error' : 'did not update swaptime info'})
    }
}

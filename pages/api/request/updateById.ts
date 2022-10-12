import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {match} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('matches').updateOne(new ObjectID(match._id), {
        $set : {
            alive : match.alive
        }
    })
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(500).json({'error' : 'did not update request info'})
    }
}

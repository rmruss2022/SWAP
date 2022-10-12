import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {user} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('user').updateOne(new ObjectID(user._id), {
        $set : {
            name : user.name,
            email : user.email,
            image : user.image
        }
    })
    if (data) {
        res.status(200).json(data)
    } else {
        res.status(500).json({'error' : 'did not update user info'})
    }
}

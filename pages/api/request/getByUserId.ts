import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {userid} = req.query
    console.log('user id: ', userid)
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('request').find({userid : new ObjectID(userid)}).toArray();
    res.status(200).json(data)
}
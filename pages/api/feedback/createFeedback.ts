import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {request, userid, message, submitted, successfullSwap} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('feedback').insertOne({request : new ObjectID(request), userid : new ObjectID(userid), message : message, submitted : submitted, successfullSwap : successfullSwap})
    res.status(200).json(data)
}

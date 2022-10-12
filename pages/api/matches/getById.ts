import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {id} = req.query
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('matches').findOne(new ObjectID(id));
    res.status(200).json(data)
}
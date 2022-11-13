import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {userid, time, matchid, alive} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('swaptime').updateOne({matchid: matchid, userid: new ObjectID(userid)}, { $set : { userid: new ObjectID(userid), time : time, match : matchid, alive : alive} }, {upsert: true})
    // find match
    res.status(200).json(data)
}

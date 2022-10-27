import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {userid, time, matchid, alive} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('swaptime').insertOne({userid: userid, time : time, match : matchid, alive : alive})
    // find match
    res.status(200).json(data)
}

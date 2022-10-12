import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {request1_id, request2_id, userid1, userid2, alive} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('matches').insertOne({request1 : request1_id, request2 : request2_id, userid1 : userid1, userid2 : userid2, alive : alive})
    // find match
    res.status(200).json(data)
}

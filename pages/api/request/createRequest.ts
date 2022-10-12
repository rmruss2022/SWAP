import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {userid, drop_crn, add_crn, alive} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('request').insertOne({userid: userid, drop_crn : drop_crn, add_crn : add_crn, alive : alive})
    // find match
    res.status(200).json(data)
}

import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {name, email, image} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('user').updateOne({email: email}, {$set : {name : name, email : email, image : image, role : 'user'} }, {upsert: true })
    res.status(200).json(data)
}

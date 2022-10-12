import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {name, email, image} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('user').insertOne({name : name, email : email, image : image, role : 'user'})
    res.status(200).json(data)
}

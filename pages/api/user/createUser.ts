import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {name, email, image} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('user').updateOne({email: email}, {$set : {name : name, email : email, image : image, role : 'user'} }, {upsert: true })
    const user = await db.collection('user').findOne({email: email})
    console.log('looking up user in mongo', user)
    res.status(200).json(user)
}

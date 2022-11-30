import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {matchid, user1} = req.body
    console.log('user1 : ', user1)
    console.log('matchid: ', matchid)
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('matches').findOne({_id : new ObjectID(matchid)})
    console.log('data: ', data)
    // if user corresponds to first user check for partners data
    res.status(200).json({partnerConfirmed: user1 ? data!.confirmSwap_user2 : data!.confirmSwap_user1})
    
    
}

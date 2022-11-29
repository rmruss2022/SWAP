import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {userid, time, matchid, alive, date, confirmed, unconfirm} = req.body
    console.log('matchid: ', matchid)
    const client = await clientPromise;
    const db = client.db('SWAP')
    const data = await db.collection('swaptime').updateOne({match: new ObjectID(matchid), userid: new ObjectID(userid)}, { $set : { userid: new ObjectID(userid), time : time, match :  new ObjectID(matchid), alive : alive, date : date, confirmed : confirmed} }, {upsert: true})
    
    // if this is a confirmation, update partners document as confirmed as well
    if (confirmed) {
        const dataConfirmed = await db.collection('swaptime').updateMany({match: new ObjectID(matchid)}, { $set : { confirmed : true} }, {upsert: true})
    }

    // if this is an unconforming action, unconfirm both times
    if (unconfirm) {
        const dataUnconfirmed = await db.collection('swaptime').updateMany({match: new ObjectID(matchid)}, { $set : { confirmed : false} }, {upsert: true})
    }
    res.status(200).json(data)
}

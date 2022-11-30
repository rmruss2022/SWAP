import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {matchid, requestid1, userid1, requestid2, userid2} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')
    var match = await db.collection('matches').findOne({_id : new ObjectID(matchid)})
    // update match swap confirmation
    if (userid1 === match!.userid1) {
        await db.collection('matches').updateOne({_id: new ObjectID(matchid)}, {
            $set : {
                confirmSwap_user1 : true
            }
        })
    } else {
        await db.collection('matches').updateOne({ _id: new ObjectID(matchid)}, {
            $set : {
                confirmSwap_user2 : true
            }
        })
    }
    match = await db.collection('matches').findOne({_id : new ObjectID(matchid)})
    if (match!.confirmSwap_user1 && match!.confirmSwap_user2) {
        await db.collection('feedback').insertOne({request : new ObjectID(requestid1), userid : new ObjectID(userid1), message : '', submitted : false, successfullSwap : false})
        await db.collection('feedback').insertOne({request : new ObjectID(requestid2), userid : new ObjectID(userid2), message : '', submitted : false, successfullSwap : false})
    } 
    
    res.status(200).json({})
}
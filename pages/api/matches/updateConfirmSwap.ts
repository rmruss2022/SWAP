import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { sendMail } from "../../../utils/VTTimetable/email";
const ObjectID = require("mongodb").ObjectID;

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {updatingUser, matchid, requestid1, userid1, requestid2, userid2} = req.body

    console.log('req body: ', req.body)
    const client = await clientPromise;
    const db = client.db('SWAP')

    // look up users
    const user1 = await db.collection('user').findOne({_id :new ObjectID(userid1)})
    const user2= await db.collection('user').findOne({_id :new ObjectID(userid2)})

    var match = await db.collection('matches').findOne({_id : new ObjectID(matchid)})
    // update match swap confirmation
    console.log('updating user: ', updatingUser, 'match.userid1: ', match!.userid1)
    if (updatingUser === match!.userid1.toString()) {
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
    console.log('updated match in update confirm swap: ', match)
    if (match!.confirmSwap_user1 && match!.confirmSwap_user2) {
        await db.collection('matches').updateOne({ _id : new ObjectID(matchid)}, {
            $set : {
                alive : false
            }
        })
        sendMail('Congratulations, you have a successful match!', [user1?.email, user2?.email], 'Congrats you successfully SWAPed!!!')
        await db.collection('feedback').insertOne({request : new ObjectID(requestid1), userid : new ObjectID(userid1), message : '', submitted : false, successfullSwap : false})
        await db.collection('feedback').insertOne({request : new ObjectID(requestid2), userid : new ObjectID(userid2), message : '', submitted : false, successfullSwap : false})
    } 
    
    res.status(200).json({})
}
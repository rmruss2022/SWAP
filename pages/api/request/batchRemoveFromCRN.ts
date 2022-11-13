import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {crn, isAdd, userid} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')

    console.log('deleting crn: ', crn)
    console.log('from userid: ', userid)
    // query course info from api
    
    // if crn is meant to add
    if (isAdd) {
        const resp = await db.collection('request').deleteMany({add_crn : crn, userid: new ObjectID(userid)})
        console.log('mongo resp: ', resp)
        if (resp.deletedCount > 0) {
            res.status(200).json({'deleted: ' : resp.deletedCount})
        }
    } // else crn is meant to drop
    else {
        // delete requests for each added course
        const resp = await db.collection('request').deleteMany({drop_crn : crn, userid: new ObjectID(userid)})
        console.log('mongo resp: ', resp)
        if (resp.deletedCount > 0) {
            res.status(200).json({'deleted: ' : resp.deletedCount})
        }
    }
      
    res.status(500).json('error')
}



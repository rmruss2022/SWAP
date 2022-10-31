import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
const ObjectID = require("mongodb").ObjectID;


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {crn, isAdd, adding, dropping, userid} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')

    console.log(crn, adding, userid)
    // query course info from api
    
    // if crn is meant to add
    if (isAdd) {

    } // else crn is meant to drop
    else {
        // create requests for each added course
        for (let i = 0; i < adding.length; i++) {
            await db.collection('request').insertOne({
                userid: new ObjectID(userid),
                drop_crn : crn,
                add_crn : adding[i].crn,
                alive : true,
                add_classtitle: adding[i].title,
                add_course : adding[i].course,
                drop_classtitle : 'temp title',
                drop_course : 'temp course'
            })
        } 
    }
      
    res.status(200).json('success')
}



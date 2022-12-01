import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { getCRN, getSemesters } from "../../../utils/courses";
const ObjectID = require("mongodb").ObjectID;

interface course {
    crn : string,
    title: string,
    course: string
}

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {crn, isAdd, adding, dropping, userid, semester, year, semeseter} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')

    console.log(crn, adding, userid)

    // query available semesters

    // query course info for each semester
    
    const course : any = await getCRN(year, semester, crn)

    
    // if crn is meant to add
    if (isAdd) {
        // create requests for each added course
        for (let i = 0; i < dropping.length; i++) {
            await db.collection('request').insertOne({
                userid: new ObjectID(userid),
                drop_crn : dropping[i].crn,
                add_crn : course.crn,
                alive : true,
                add_classtitle: course.title,
                add_course : course.course,
                drop_classtitle : dropping[i].title,
                drop_course : dropping[i].course,
            })
            if (dropping.length < 1) {
                await db.collection('request').insertOne({
                    userid: new ObjectID(userid),
                    drop_crn : 'placeholder',
                    add_crn : crn,
                    alive : true,
                    add_classtitle: 'fetch class title',
                    add_course : 'fetch course',
                    drop_classtitle : 'placeholder',
                    drop_course : 'placeholder',
                })
            }
        } 
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
        if (adding.length < 1) {
            await db.collection('request').insertOne({
                userid: new ObjectID(userid),
                drop_crn : crn,
                add_crn : 'placeholder',
                alive : true,
                add_classtitle: 'placeholder',
                add_course : 'placeholder',
                drop_classtitle : 'temp title',
                drop_course : 'temp course'
            })
        }
    }
      
    res.status(200).json('success')
}



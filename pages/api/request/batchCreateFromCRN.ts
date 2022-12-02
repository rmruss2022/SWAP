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
    const {crn, isAdd, adding, dropping, userid, semester, year} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')

    console.log(crn, adding, userid, semester, year)

    // query available semesters

    // query course info for each semester
    
    const resp : any = await getCRN(req.body)
    const course = resp._course_data

    console.log('course returned from vtt: ', course)
    
    // if crn is meant to add
    if (isAdd) {
        // create requests for each course they are dropping
        for (let i = 0; i < dropping.length; i++) {
            await db.collection('request').insertOne({
                userid: new ObjectID(userid),
                drop_crn : dropping[i].crn,
                add_crn : course.crn,
                alive : true,
                add_classtitle: course.name,
                add_course : course.code + course.subject,
                drop_classtitle : dropping[i].title,
                drop_course : dropping[i].course,
            })
        } 
        if (dropping.length < 1) {
            await db.collection('request').insertOne({
                userid: new ObjectID(userid),
                drop_crn : 'null',
                add_crn : course.crn,
                alive : true,
                add_classtitle: course.name,
                add_course : course.code + course.subject,
                drop_classtitle : 'null',
                drop_course : 'null',
            })
        }
    } // else crn is meant to drop
    else {
        // create requests for each added course
        for (let i = 0; i < adding.length; i++) {
            await db.collection('request').insertOne({
                userid: new ObjectID(userid),
                drop_crn : course.crn,
                add_crn : adding[i].crn,
                alive : true,
                add_classtitle: adding[i].title,
                add_course : adding[i].course,
                drop_classtitle : course.name,
                drop_course : course.code + course.subject
            })
        } 
        if (adding.length < 1) {
            await db.collection('request').insertOne({
                userid: new ObjectID(userid),
                drop_crn : course.crn,
                add_crn : 'null',
                alive : true,
                add_classtitle: 'null',
                add_course : 'null',
                drop_classtitle : course.name,
                drop_course : course.code + course.subject
            })
        }
    }
      
    res.status(200).json({crn : course.crn, title: course.name, course : course.code + course.subject})
}



import axios from "axios";
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

    console.log(crn, isAdd, userid, semester, year)

    console.log('req body: ', req.body)

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
                add_course : course.subject + "-" + course.code,
                add_semesterNum : course.semester,
                drop_classtitle : dropping[i].title,
                drop_course : dropping[i].course,
                drop_semesterNum : dropping[i].semesterNum
            })
        } 
        if (dropping.length < 1) {
            await db.collection('request').insertOne({
                userid: new ObjectID(userid),
                drop_crn : 'null',
                add_crn : course.crn,
                alive : true,
                add_classtitle: course.name,
                add_course : course.subject + "-" + course.code,
                add_semesterNum : course.semester,
                drop_classtitle : 'null',
                drop_course : 'null',
                drop_semesterNum : 'null'
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
                add_semesterNum : adding[i].semesterNum,
                drop_classtitle : course.name,
                drop_course :course.subject + "-" + course.code,
                drop_semesterNum : course.semester
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
                add_semesterNum : 'null',
                drop_classtitle : course.name,
                drop_course : course.subject + "-" + course.code,
                drop_semesterNum : course.semester
            })
        }
    }

    // check for match => lookup all requests for class 
    if (isAdd) {
        const possibleMatchingRequests = await db.collection('request').find({drop_SemesterNum: course.semester, drop_crn : course.crn})
    } else {
        const possibleMatchingRequests = await db.collection('request').find({add_semesterNum: course.semester, add_crn : course.crn})
    }

    console.log()
    
      
    res.status(200).json({crn : course.crn, title: course.name, course : course.code + course.subject})
}



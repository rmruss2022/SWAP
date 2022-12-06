import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";
import { getCRN, getSemesters } from "../../../utils/courses";
const ObjectID = require("mongodb").ObjectID;

interface course {
    crn : string,
    title: string,
    course: string,
    semesterNum: string
}

export default async function handler(req : NextApiRequest, res : NextApiResponse) {
    const {crn, isAdd, adding, dropping, userid, semester, year} = req.body
    const client = await clientPromise;
    const db = client.db('SWAP')

    console.log('adding: ', adding)
    
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
                drop_semesterNum : dropping[i].drop_semesterNum
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
                add_semesterNum : adding[i].add_semesterNum,
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

    // check for match => lookup all requests for class that do not match current userid 
    // and contain the course as opposite of what user is trying to add / drop
    console.log('params for match: ', course.semester, course.crn)
    var possibleMatchingRequests = null
    if (isAdd) {
        possibleMatchingRequests = await db.collection('request').find({alive : true, userid: {$ne : userid}, drop_semesterNum: course.semester, drop_crn : course.crn}).toArray()
    } else {
        possibleMatchingRequests = await db.collection('request').find({alive : true, userid: {$ne : userid}, add_semesterNum: course.semester, add_crn : course.crn}).toArray()
    }

    console.log('possible match: ', possibleMatchingRequests)

    // iterate through possible matches and lookup if respective add/drop course matches possible Match
    var confirmMatchUser;
    var confirmMatchPartner;
    if (isAdd) {
        for (let i = 0; i < possibleMatchingRequests.length; i++) {
            // see if user is dropping the course partner is trying to add
            confirmMatchUser = await db.collection('request').findOne({userid: new ObjectID(userid), 
                                                                alive : true,
                                                                add_crn: course.crn, 
                                                                add_semesterNum : course.semester, 
                                                                drop_crn : possibleMatchingRequests[i].add_crn, 
                                                                drop_semesterNum : possibleMatchingRequests[i].add_semesterNum})
                                                                // found a match
            if (confirmMatchUser) {
                console.log('found match!', confirmMatchUser)
                confirmMatchPartner = possibleMatchingRequests[i]
                break
            } 
        }
    } else {
        for (let i = 0; i < possibleMatchingRequests.length; i++) {
            // see if user is dropping the course partner is trying to add
            confirmMatchUser = await db.collection('request').findOne({userid: new ObjectID(userid), 
                                                                alive : true,
                                                                drop_crn: course.crn, 
                                                                drop_semesterNum : course.semester, 
                                                                add_crn : possibleMatchingRequests[i].drop_crn, 
                                                                add_semesterNum : possibleMatchingRequests[i].drop_semesterNum})
                                                                // found a match
            if (confirmMatchUser) {
                console.log('found match!', confirmMatchUser)
                confirmMatchPartner = possibleMatchingRequests[i]
                break
            } 
        }
    }

    console.log('request 1 and 2 user ids: ', confirmMatchUser?.userid , confirmMatchPartner?.userid)
    // create match from confirmMatchUser and confirmMatchPartner
    if (confirmMatchPartner && confirmMatchUser) {
        await db.collection('matches').insertOne({  alive : true, 
                                                    request_1 : confirmMatchUser!._id, 
                                                    request_2 : confirmMatchPartner!._id, 
                                                    userid1 : confirmMatchUser!.userid, 
                                                    userid2 : confirmMatchPartner!.userid, 
                                                    confirmSwap_user1 : false, 
                                                    confirmSwap_user2 : false })
    }

    
    
      
    res.status(200).json({crn : course.crn, title: course.name, course : course.code + course.subject})
}



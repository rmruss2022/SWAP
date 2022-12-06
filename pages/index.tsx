import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Feedback from '../components/Feedback'
import Matches from '../components/Matches'
import AddCRN from '../components/AddCRN'
import DropCRN from '../components/DropCRN'
import { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { BASE_URL } from '../utils/utils'
import { iFeedback, iMatch, iSwapTime, iRequest, iAdding, iDropping, iSemester, iUser } from '../utils/types'
import { request } from 'http'
import { time } from 'console'
import { match } from 'assert'
const ObjectID = require("mongodb").ObjectID;
import { getSession, useSession } from "next-auth/react"
import { AppContext, AuthenticatedContex } from './_app'
import useAuthStore from '../store/authStore'
import { unstable_getServerSession } from 'next-auth/next'
import {authOptions} from '../pages/api/auth/[...nextauth]'
import Profile from '../components/Profile'



export async function getServerSideProps(context : any) {
  
  // console.log('request: ', context.req)
  const session = await unstable_getServerSession(context.req, context.res, authOptions)
  
  if (!session) {
    return {
      props: {
        feedbacks : null,
        matches: null,
        matchTimes : null,
        adding : null,
        dropping: null,
        semesters : null
       },
    }
  }
  const resp = await axios.post(`${BASE_URL}/api/user/createUser`, {name: session!.user?.name, email: session!.user?.email, image: session!.user?.image})
  const user : iUser = resp.data
  console.log('session: ', session)

  const client = await clientPromise;
  const db = client.db("SWAP");

  const semData = await axios.get(`${BASE_URL}/api/getsemesters`)
  const semesters = semData.data
  console.log('semesters: ', semesters)
  // query open feedbacks
  const feedbacks = await db.collection('feedback').aggregate([
    {
      $match: {
        submitted: false,
        userid: new ObjectID(user._id)
      }
    },
    {
      $lookup: {
        from: 'request',
        localField: 'request',
        foreignField: '_id',
        as: 'requestObject'
      }
    }
  ]).toArray()
  console.log('feedbacks: ', feedbacks)
  
  //.find({userid : new ObjectID(userid), submitted: false}).toArray();
  
  // query open matches
  const matches = await db.collection('matches').aggregate([
    {
      $match :
      {
        $and : [
          {
            alive: true
          },
          {
            $or : 
              [
                {
                  userid1: new ObjectID(user._id)
                },
                {
                  userid2: new ObjectID(user._id)
                }
              ]
          }
        ]
      }

    },
    {
      $lookup :
        {
          from: "request",
          localField: "request_1",
          foreignField: "_id",
          as: "request1Object"
        }
    },
    {
      $lookup :
        {
          from: "request",
          localField: "request_2",
          foreignField: "_id",
          as: "request2Object"
        }
    }
  ]).toArray();

  // query times for each match
  const matchTimes : any = {}
  for (let i = 0; i < matches.length; i++) {
    matchTimes[`${matches[i]['_id'].toString()}`] = {}
    const times = await db.collection('swaptime').aggregate([
      {
        $match :{match: matches[i]['_id']}
      },
      {
        $lookup: 
        {
          from: "user",
          localField: "userid",
          foreignField: "_id",
          as: "user"
        }
      }]).toArray()
    
    for (let j = 0; j < times.length; j++) {
      if (times[j]['userid'].toString() !== user._id) {
        matchTimes[`${matches[i]['_id'].toString()}`]['partnerTime'] = times[j]
      } else {
        matchTimes[`${matches[i]['_id'].toString()}`]['userTime'] = times[j]
      }
    }
  }
  // query requests
  const requests = await db.collection('request').find({userid : new ObjectID(user._id)}).toArray();
  // parse into adding CRN's and Dropping CRN's
  const adding : any = {}
  const dropping : any = {}
  for (let i = 0; i < requests.length; i++) {
    // console.log('request at i: ', requests[i])
    if (requests[i]['add_crn'] !== 'null') {
      adding[requests[i]['add_crn']] = {crn : requests[i]['add_crn'], title : requests[i]['add_classtitle'], course : requests[i]['add_course'], add_semesterNum : requests[i].add_semesterNum}
    }
    if (requests[i]['drop_crn'] !== 'null') {
      dropping[requests[i]['drop_crn']] = {crn : requests[i]['drop_crn'], title : requests[i]['drop_classtitle'], course : requests[i]['drop_course'], drop_semesterNum : requests[i].drop_semesterNum}
    }
  }
  const addingArr = Object.keys(adding).map(add => adding[add])
  const droppingArr = Object.keys(dropping).map(drop => dropping[drop])
  // console.log('dropping: ', droppingArr)
  // console.log('dropping repeats: ', dropping)

  // serialize 
  const serialFeedbacks = JSON.parse(JSON.stringify(feedbacks))
  const serialMatches = JSON.parse(JSON.stringify(matches))
  const serialMatchTimes = JSON.parse(JSON.stringify(matchTimes))
    return {
      props: {
        feedbacks : serialFeedbacks,
        matches: serialMatches,
        matchTimes : serialMatchTimes,
        adding : addingArr,
        dropping: droppingArr,
        semesters : semesters
       },
    }
  }

interface IProps {
  feedbacks: [iFeedback],
  matches: [iMatch],
  matchTimes : [iSwapTime],
  adding : [iAdding],
  dropping: [iDropping],
  semesters : [iSemester]
}

const Home = ({feedbacks, matches, matchTimes, adding, dropping, semesters} : IProps) => {

  const appContext = useContext(AppContext);
  
  const authenticatedContext = useContext(AuthenticatedContex)
 
console.log('matche times: ', matchTimes)
  console.log(feedbacks, matches, adding, dropping, matchTimes)
  // hooks
  const [feedbacksState, setFeedbacksState] = useState(feedbacks)
  const [matchesState, setMatchesState] = useState([])
  

  const { data: session } = useSession()


  // use effect
  useEffect(() => {
    appContext.setSemesters(semesters)
    appContext.setDroppingCRNs(dropping)
    appContext.setAddingCRNs(adding)
  },[])


  // when requests are updated, call set requests to update ui with updated list of requests
  const setRequests = async () => {
    const {data} = await axios.get(`${BASE_URL}/api/request/getByUserId?userid=${authenticatedContext.user._id}`)
    const requests = data;
    // parse into adding CRN's and Dropping CRN's
    const adding : any = {}
    const dropping : any = {}
    for (let i = 0; i < requests.length; i++) {
      console.log('requests add_crn', requests[i]['add_crn'])

      if (requests[i]['add_crn'] !== 'null') {
        adding[requests[i]['add_crn']] = {crn : requests[i]['add_crn'], title : requests[i]['add_classtitle'], course : requests[i]['add_course'], add_semesterNum : requests[i]['add_semesterNum']}
      }
      if (requests[i]['drop_crn'] !== 'null') {
      dropping[requests[i]['drop_crn']] = {crn : requests[i]['drop_crn'], title : requests[i]['drop_classtitle'], course : requests[i]['drop_course'], drop_semesterNum : requests[i]['drop_semesterNum']}
      }
    }
    const addingArr : any = Object.keys(adding).map(add => adding[add])
    const droppingArr : any = Object.keys(dropping).map(drop => dropping[drop])
    console.log('droppingarr: ', droppingArr)
    appContext.setDroppingCRNs(droppingArr)
    appContext.setAddingCRNs(addingArr)
  }


  const removeAddedCRN = async (crn : String) => {
    const resp = await axios.post(`${BASE_URL}/api/request/batchRemoveFromCRN`, {userid: authenticatedContext.user._id, isAdd: true, crn: crn})
    console.log('resp adddroppedcrn: ', resp)
    setRequests()
  }
  const addAddedCRN = async (crn : String, semesterNum : String, year : String) => {
    try {
      const resp = await axios.post(`${BASE_URL}/api/request/batchCreateFromCRN`, {userid: authenticatedContext.user._id, isAdd : true, dropping : appContext.dropping , crn: crn, semester : semesterNum, year : year})
      console.log('resp adddroppedcrn: ', resp)
      setRequests()
    } catch(error) {
      return 'Error, incorrect CRN or Semester'
    }
    
  }
  // add a crn to drop, loop through all adding and make new requests
  const addDroppedCRN = async (crn : String, semesterNum : String, year : String) => {
    console.log('trying to drop a class', appContext.adding)
    try {
      const resp = await axios.post(`${BASE_URL}/api/request/batchCreateFromCRN`, {userid: authenticatedContext.user._id, isAdd : false, adding: appContext.adding, crn: crn, semester : semesterNum, year : year})
      console.log('resp adddroppedcrn: ', resp)
      setRequests()
    } catch(error) {
      return 'Error, incorrect CRN or Semester'
      
    }
    
  }
  // remove crn from list of dropping crns
  const removeDroppedCRN = async (crn : String) => {
    const resp = await axios.post(`${BASE_URL}/api/request/batchRemoveFromCRN`, {userid: authenticatedContext.user._id, isAdd: false, crn: crn})
    console.log('resp removedroppedcrn: ', resp)
    setRequests()
  }
  const updateFeedback = () => {
    return 0
  }
  const removeMatch = () => {
    return 0
  }
  const addTime = () => {
    return 0
  }
  const updateTime = () => {
    return 0
  }
  const confirmTime = () => {
    return 0;
  }

  const [pageSelection, setPageSelection] = useState('matches')

  if (session) { 

    return (
      <div className={`md:w-[750px] w-full h-full p-2`}>


        



          <div className='flex jusify-between items-center w-full gap-6 mb-4 mt-2'>
            <button onClick={() => setPageSelection('matches')} className={`p-1.5 ${pageSelection === 'matches' ? 'bg-blue-700 text-white' : 'bg-[white] dark:text-black'} border-2 rounded-md w-[160px]`}>SWAP Matches</button>
            <button onClick={() => setPageSelection('add')} className={`p-1.5 ${pageSelection === 'add' ? 'bg-blue-700 text-white' : 'bg-[white] dark:text-black'} border-2 rounded-md w-[160px]`}>Add CRN</button>
            <button onClick={() => setPageSelection('drop')} className={`p-1.5 ${pageSelection === 'drop' ? 'bg-blue-700 text-white' : 'bg-[white] dark:text-black'} border-2 rounded-md w-[160px]`}>Drop CRN</button>
            <button onClick={() => setPageSelection('profile')} className={`p-1.5 ${pageSelection === 'profile' ? 'bg-blue-700 text-white' : 'bg-[white] dark:text-black'} border-2 rounded-md w-[160px]`}>Profile</button>
          </div>
          {pageSelection === 'matches' && (
            <>
              <Feedback feedbacks={feedbacks} />
              <Matches matches={matches} matchTimes={matchTimes} />
            </>
          )}
          {pageSelection === 'add' && (
            <AddCRN addAddedCRN={addAddedCRN} removeAddedCRN={removeAddedCRN} />
          )}

          {pageSelection === 'drop' && (
            <DropCRN addDroppedCRN={addDroppedCRN} removeDroppedCRN={removeDroppedCRN} />
          )}

          {pageSelection === 'profile' && (
            <Profile />
          )}
      </div>
    )
  } else {
    return(
      <p className='font-mono text-md'>Please sign in with your Virginia Tech Email!</p>
    )
  }
}

export default Home

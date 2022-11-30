<<<<<<< HEAD
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
import { iFeedback, iMatch, iSwapTime, iRequest, iAdding, iDropping } from '../utils/types'
import { request } from 'http'
import { time } from 'console'
import { match } from 'assert'
=======
import clientPromise from "../lib/mongodb";
import { InferGetServerSidePropsType } from "next";
import Image from "next/image";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Feedback from "../components/Feedback";
import Matches from "../components/Matches";
import AddCRN from "../components/AddCRN";
import DropCRN from "../components/DropCRN";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/utils";
import {
  iFeedback,
  iMatch,
  iSwapTime,
  iRequest,
  iAdding,
  iDropping,
} from "../utils/types";
import { request } from "http";
>>>>>>> a51c8e554d9f45c96c5f52b1dce929a2899ce0e1
const ObjectID = require("mongodb").ObjectID;

const userid = "6346d05cd53a982ce15d0601";

export async function getServerSideProps(context: any) {
  const client = await clientPromise;
  const db = client.db("SWAP");

  // query open feedbacks
  const feedbacks = await db
    .collection("feedback")
    .aggregate([
      {
        $match: {
          submitted: false,
          userid: new ObjectID(userid),
        },
      },
      {
        $lookup: {
          from: "request",
          localField: "request",
          foreignField: "_id",
          as: "requestObject",
        },
      },
    ])
    .toArray();
  console.log("feedbacks: ", feedbacks);

  //.find({userid : new ObjectID(userid), submitted: false}).toArray();

  // query open matches
  const matches = await db
    .collection("matches")
    .aggregate([
      {
        $match: {
          $and: [
            {
              alive: true,
            },
            {
              $or: [
                {
                  userid1: new ObjectID(userid),
                },
                {
                  userid2: new ObjectID(userid),
                },
              ],
            },
          ],
        },
      },
      {
        $lookup: {
          from: "request",
          localField: "request_1",
          foreignField: "_id",
          as: "request1Object",
        },
      },
      {
        $lookup: {
          from: "request",
          localField: "request_2",
          foreignField: "_id",
          as: "request2Object",
        },
      },
    ])
    .toArray();

  // query times for each match
  const matchTimes: any = {};
  for (let i = 0; i < matches.length; i++) {
<<<<<<< HEAD
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
      if (times[j]['userid'].toString() !== userid) {
        matchTimes[`${matches[i]['_id'].toString()}`]['partnerTime'] = times[j]
      } else {
        matchTimes[`${matches[i]['_id'].toString()}`]['userTime'] = times[j]
      }
    }
=======
    const times = await db
      .collection("swaptime")
      .find({ match: new ObjectID(matches[i]["_id"]) })
      .toArray();
    matchTimes[`${matches[i]["_id"]}`] = times;
>>>>>>> a51c8e554d9f45c96c5f52b1dce929a2899ce0e1
  }
  // query requests
  const requests = await db
    .collection("request")
    .find({ userid: new ObjectID(userid) })
    .toArray();
  // parse into adding CRN's and Dropping CRN's
  const adding: any = {};
  const dropping: any = {};
  for (let i = 0; i < requests.length; i++) {
<<<<<<< HEAD
    // console.log('request at i: ', requests[i])
    adding[requests[i]['add_crn']] = {crn : requests[i]['add_crn'], title : requests[i]['add_classtitle'], course : requests[i]['add_course']}
    dropping[requests[i]['drop_crn']] = {crn : requests[i]['drop_crn'], title : requests[i]['drop_classtitle'], course : requests[i]['drop_course']}
  }
  const addingArr = Object.keys(adding).map(add => adding[add])
  const droppingArr = Object.keys(dropping).map(drop => dropping[drop])
  // console.log('dropping: ', droppingArr)
  // console.log('dropping repeats: ', dropping)
=======
    console.log("request at i: ", requests[i]);
    adding[requests[i]["add_crn"]] = {
      crn: requests[i]["add_crn"],
      title: requests[i]["add_classtitle"],
      course: requests[i]["add_course"],
    };
    dropping[requests[i]["drop_crn"]] = {
      crn: requests[i]["drop_crn"],
      title: requests[i]["drop_classtitle"],
      course: requests[i]["drop_course"],
    };
  }
  const addingArr = Object.keys(adding).map((add) => adding[add]);
  const droppingArr = Object.keys(dropping).map((drop) => dropping[drop]);
  console.log("dropping: ", droppingArr);
  console.log("dropping repeats: ", dropping);
>>>>>>> a51c8e554d9f45c96c5f52b1dce929a2899ce0e1

  // serialize
  const serialFeedbacks = JSON.parse(JSON.stringify(feedbacks));
  const serialMatches = JSON.parse(JSON.stringify(matches));
  const serialMatchTimes = JSON.parse(JSON.stringify(matchTimes));
  return {
    props: {
      feedbacks: serialFeedbacks,
      matches: serialMatches,
      matchTimes: serialMatchTimes,
      adding: addingArr,
      dropping: droppingArr,
    },
  };
}

interface IProps {
  feedbacks: [iFeedback];
  matches: [iMatch];
  matchTimes: [iSwapTime];
  adding: [iAdding];
  dropping: [iDropping];
}
export var AppContext = createContext<any>(null);

const Home = ({ feedbacks, matches, matchTimes, adding, dropping }: IProps) => {
  const appContext = useContext(AppContext);
<<<<<<< HEAD
console.log('matche times: ', matchTimes)
  console.log(feedbacks, matches, adding, dropping, matchTimes)
=======

  console.log(feedbacks, matches, adding, dropping, matchTimes);
>>>>>>> a51c8e554d9f45c96c5f52b1dce929a2899ce0e1
  // hooks
  const [feedbacksState, setFeedbacksState] = useState(feedbacks);
  const [matchesState, setMatchesState] = useState([]);
  const [addingCRNs, setAddingCRNs] = useState(adding);
  const [droppingCRNs, setDroppingCRNs] = useState(dropping);

  // when requests are updated, call set requests to update ui with updated list of requests
  const setRequests = async () => {
    const { data } = await axios.get(
      `${BASE_URL}/api/request/getByUserId?userid=${userid}`
    );
    const requests = data;
    // parse into adding CRN's and Dropping CRN's
    const adding: any = {};
    const dropping: any = {};
    for (let i = 0; i < requests.length; i++) {
      console.log(requests[i]);
      adding[requests[i]["add_crn"]] = {
        crn: requests[i]["add_crn"],
        title: requests[i]["add_classtitle"],
        course: requests[i]["add_course"],
      };
      dropping[requests[i]["drop_crn"]] = {
        crn: requests[i]["drop_crn"],
        title: requests[i]["drop_classtitle"],
        course: requests[i]["drop_course"],
      };
    }
    const addingArr: any = Object.keys(adding).map((add) => adding[add]);
    const droppingArr: any = Object.keys(dropping).map(
      (drop) => dropping[drop]
    );
    console.log("droppingarr: ", droppingArr);
    setDroppingCRNs(droppingArr);
    setAddingCRNs(addingArr);
  };

  const removeAddedCRN = async (crn: String) => {
    const resp = await axios.post(
      `${BASE_URL}/api/request/batchRemoveFromCRN`,
      { userid: userid, isAdd: true, crn: crn }
    );
    console.log("resp adddroppedcrn: ", resp);
    setRequests();
  };
  const addAddedCRN = async (crn: String) => {
    const resp = await axios.post(
      `${BASE_URL}/api/request/batchCreateFromCRN`,
      { userid: userid, isAdd: true, dropping: droppingCRNs, crn: crn }
    );
    console.log("resp adddroppedcrn: ", resp);
    setRequests();
  };
  // add a crn to drop, loop through all adding and make new requests
  const addDroppedCRN = async (crn: String) => {
    const resp = await axios.post(
      `${BASE_URL}/api/request/batchCreateFromCRN`,
      { userid: userid, isAdd: false, adding: addingCRNs, crn: crn }
    );
    console.log("resp adddroppedcrn: ", resp);
    setRequests();
  };
  // remove crn from list of dropping crns
  const removeDroppedCRN = async (crn: String) => {
    const resp = await axios.post(
      `${BASE_URL}/api/request/batchRemoveFromCRN`,
      { userid: userid, isAdd: false, crn: crn }
    );
    console.log("resp removedroppedcrn: ", resp);
    setRequests();
  };
  const updateFeedback = () => {
    return 0;
  };
  const removeMatch = () => {
    return 0;
  };
  const addTime = () => {
    return 0;
  };
  const updateTime = () => {
    return 0;
  };
  const confirmTime = () => {
    return 0;
  };

  return (
    //  set favicon to favicon.ico in public folder
    <div className={`md:w-[750px] w-full h-full p-2`}>
      <Head>
        <title>Swap</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/images/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
      </Head>

      <AppContext.Provider
        value={{ dropping: droppingCRNs, adding: addingCRNs }}
      >
        <Feedback feedbacks={feedbacks} />
        <Matches matches={matches} matchTimes={matchTimes} />
        <AddCRN addAddedCRN={addAddedCRN} removeAddedCRN={removeAddedCRN} />
        <DropCRN
          addDroppedCRN={addDroppedCRN}
          removeDroppedCRN={removeDroppedCRN}
        />
      </AppContext.Provider>
    </div>
  );
};

export default Home;

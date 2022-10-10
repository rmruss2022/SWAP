import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("sample_airbnb");
  const data =  await db.collection('listingsAndReviews').aggregate([

    {
        $search : {
            search : {
                query: "studio",
                path: ["description", "amenities"]
            }
        }
    },
    {
        $project: {
            description : 1,
            amenities: 1
        }
    },
    {
        $limit : 5
    }
  ]).toArray()
    console.log('data: ', data.length)
    res.json(data)
}
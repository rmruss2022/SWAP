import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("sample_airbnb");
  const data = await db.collection('listingsAndReviews').find().limit(20).toArray();
  res.status(200).json(data)
}
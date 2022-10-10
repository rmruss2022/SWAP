import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("sample_airbnb");
  const data = req.query;
  const ret = await db.collection('bookings').insertOne(data)
  res.json(ret)
}
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../../lib/mongodb";


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
  const client = await clientPromise;
  const db = client.db('SWAP')
  const data = await db.collection('user').find().toArray();
  res.status(200).json(data)
}

import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";


export default async function handler(req : NextApiRequest, res : NextApiResponse) {
  const client = await clientPromise;
  const db = client.db("sample_airbnb");
  const real_db = client.db('SWAP')
  const ret = await real_db.collection('user').insertOne({name : 'Matthew Russell', email : 'russellm22@vt.edu', image : 'https://lh3.googleusercontent.com/a-/AFdZuco-QuKiTO0kt-hGGof4q9XYB7nMVHUsOhrg96wm=s96-c'})
  const data = await db.collection('listingsAndReviews').find().limit(20).toArray();
  res.status(200).json(data)
}



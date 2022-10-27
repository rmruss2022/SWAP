import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import Image from 'next/image'
import { BASE_URL } from '../utils/utils';

export async function getServerSideProps(context: any) {
  const client = await clientPromise;
  const db = client.db("sample_airbnb");
  const data = await db.collection('listingsAndReviews').find().limit(20).toArray();
  const serial = JSON.parse(JSON.stringify(data))
    return {
      props: { 
        data : serial
       },
    }
  }


export default function Home({data} : any) {

  const book = async (property : any) => {
    const resp = await fetch(`${BASE_URL}/api/book?propertyid=${property._id}&guests=ado`)
    const respJson = await resp.json()
    console.log('resp: ', respJson)
  }
  return (
   <div>
      { data.map((property : any, id : number) => (
        <div key={id}>
          <Image src={property.images.picture_url} height={400} width={400} />
          <p>{property.name}</p>
          <button onClick={() => book(property)} className='bg-[blue] p-6 rounded-md my-8 '>Book</button>
        </div>
      )) }
   </div>
  )
}






















// import type { NextPage } from 'next'
// import Head from 'next/head'
// import Image from 'next/image'
// import styles from '../styles/Home.module.css'
// import Feedback from '../components/Feedback'
// import Matches from '../components/Matches'
// import AddCRN from '../components/AddCRN'
// import DropCRN from '../components/DropCRN'
// import { useEffect } from 'react'
// import axios from 'axios'
// import { BASE_URL } from '../utils/utils'
// const Home: NextPage = () => {

//   useEffect(() => {
//     async function getProps() {
//       console.log('loading')
//       const users = await axios.get(`${BASE_URL}/api/users`)
//       console.log('users: ', users)

//     }
//     getProps()
//   }, [])
  

//   return (
//     <div className='md:w-[750px] w-full h-full p-2'>
//       <Feedback />
//       <Matches />
//       <AddCRN />
//       <DropCRN />
//     </div>
//   )
// }

// export default Home

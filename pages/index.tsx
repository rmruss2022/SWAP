import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import Feedback from '../components/Feedback'
import Matches from '../components/Matches'
import AddCRN from '../components/AddCRN'
import DropCRN from '../components/DropCRN'
const Home: NextPage = () => {
  return (
    <div className='md:w-[750px] w-full h-full p-2'>
      <Feedback />
      <Matches />
      <AddCRN />
      <DropCRN />
    </div>
  )
}

export default Home

import React, {useState} from 'react'
import { iMatch } from '../utils/types';
import MatchItem from './MatchItem'

const Matches = ({matches, matchTimes}) => {
    
  console.log('match times: ', matchTimes)
  return (
    <>
    {matches.map((match, idx) => (
        <MatchItem key={idx} match={match} matchTime={matchTimes[match._id]} />
    ))}
    {matches.length === 0 && (
      <div className='flex justify-center items-center text-center mt-4 border-2 p-1 rounded-md'>
        <p className='text-md font-mono'>You do not currently have any matches, add and drop CRNs to SWAP courses with a fellow Hokie 🍗</p>
      </div>
    )

    }
    </>
  )
}

export default Matches
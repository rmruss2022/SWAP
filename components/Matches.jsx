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
    </>
  )
}

export default Matches
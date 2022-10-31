import React, {useState} from 'react'
import { iMatch } from '../utils/types';
import MatchItem from './MatchItem'

const Matches = ({matches, matchTimes}) => {
    

  return (
    <>
    {matches.map((match , idx) => (
        <MatchItem key={idx} match={match} id={idx} matchTime={matchTimes[match]} />
    ))}
    </>
  )
}

export default Matches
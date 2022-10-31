import React, { useState } from 'react'
import {TbArrowsLeftRight} from 'react-icons/tb'
import { iFeedback } from '../utils/types'
import FeedbackItem from './FeedbackItem'

interface IProps {
  feedbacks: [iFeedback]
}
const Feedback = ({feedbacks} : IProps) => {

  return (
    <>
    {feedbacks.map((feedback : iFeedback, idx: number) => (
      <FeedbackItem key={idx} feedback={feedback} id={idx} />
    ))}
    </>
  )
}

export default Feedback
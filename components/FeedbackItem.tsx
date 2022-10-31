import React, { useState } from 'react'
import { TbArrowsLeftRight } from 'react-icons/tb'
import { iFeedback } from '../utils/types'


interface IProps {
    feedback: iFeedback,
    id: number
}

const FeedbackItem = ({feedback, id}: IProps) => {

    const [msg, setMsg] = useState('')

    const submitFeedback = () => {
        console.log('submit feedback: ', msg)
      }

  return (
    <div key={id} className='flex-col mb-3 border-[gray-100] border-2 rounded-xl p-3'>
        {/* title container */}
        <div className='pb-2'>
            <p className='text-2xl font-mono underline'>Report your SWAPs Feedback</p>
        </div>
        <div className='flex gap-6 items-center pb-2'>
            <p className='text-xl font-mono text-[green]'>{feedback.requestObject[0].add_crn}</p>
            <TbArrowsLeftRight />
            <p className='text-xl font-mono text-[red]'>{feedback.requestObject[0].drop_crn}</p>
        </div>
        {/* feedback textbox */}
        <div>
          <textarea id="feedback" rows={4} className="block p-2.5 w-[300px] text-sm text-gray-900 bg-gray-50 rounded-lg resize-none border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
              placeholder="Your Feedback..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
               />
        </div>
        {/* submit button */}
        <button onClick={() => submitFeedback()} className='bg-[orange] p-2 mt-2 rounded-md text-[white] hover-pointer'>Submit Feedback</button>
    </div>
  )
}

export default FeedbackItem
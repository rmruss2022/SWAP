import axios from 'axios'
import React, { useState } from 'react'
import { TbArrowsLeftRight } from 'react-icons/tb'
import { iFeedback } from '../utils/types'
import { BASE_URL } from '../utils/utils'



interface IProps {
    feedback: iFeedback,
    id: number
}

const FeedbackItem = ({feedback, id}: IProps) => {

    const [msg, setMsg] = useState('')
    const [successful, setSuccessful] = useState(true)
    const [submitted, setSubmitted] = useState(false)
    const [alert, setAlert] = useState(false)

    const submitFeedback = async () => {
        if (msg) {
            const resp = axios.post(`${BASE_URL}/api/feedback/updateById`, {msg : msg, id: feedback._id, successful: successful})
            setSubmitted(true)
        } else {
            setAlert(true)
            setInterval(() => 
                setAlert(false)
            , 3000)
        }
        
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
            <label className="inline-flex relative items-center mr-5 cursor-pointer mt-2">
                    <input
                        disabled={submitted}
                        type="checkbox"
                        className="sr-only peer"
                        checked={successful}
                        readOnly
                    />
                    <div
                        onClick={() => {
                            setSuccessful(!successful);
                        }}
                        className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"
                    ></div>
                    <span className="ml-2 text-md font-mono">
                        {successful ? 'Successful SWAP' : 'Unsuccessful SWAP'}
                    </span>
                </label>
        </div>
        {/* submit button */}
        <button disabled={submitted} onClick={() => submitFeedback()} className={`${submitted ? 'bg-[#ffdb9e]' : 'bg-[orange]' } p-2 mt-2 rounded-md text-[white] hover-pointer`}>Submit Feedback</button>
        {submitted && <div className='mt-2 bg-[#ffb8b3] text-[black] rounded-md p-2'>Thank you for Submitting Feedback!</div> }
        {alert && <div className='mt-2 bg-[#ff7070] p-2 rounded-md'>Please enter a full feedback message!</div>}
    </div>
  )
}

export default FeedbackItem
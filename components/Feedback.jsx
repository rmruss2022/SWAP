import React from 'react'
import {TbArrowsLeftRight} from 'react-icons/tb'
const Feedback = () => {
  return (
    // feedbackSwaps.map((feedback : Feedback) => ())
    <div className='flex-col mb-3 border-[gray-100] border-2 rounded-xl p-3'>
        {/* title container */}
        <div className='pb-2'>
            <p className='text-2xl font-mono underline'>Report your SWAP's Feedback</p>
        </div>
        <div className='flex gap-6 items-center pb-2'>
            <p className='text-xl font-mono text-[green]'>CS3704</p>
            <TbArrowsLeftRight />
            <p className='text-xl font-mono text-[red]'>CS3714</p>
        </div>
        {/* feedback textbox */}
        <div>
        <textarea id="feedback" rows="4" className="block p-2.5 w-[300px] text-sm text-gray-900 bg-gray-50 rounded-lg resize-none border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your Feedback..." />
        </div>
    </div>
  )
}

export default Feedback
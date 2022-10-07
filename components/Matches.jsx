import React, {useState} from 'react'
import {TbArrowsLeftRight} from 'react-icons/tb'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker/dist/entry.nostyle';
import "react-time-picker/dist/TimePicker.css"
import "react-clock/dist/Clock.css";

const Matches = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [value, onChange] = useState('10:30');

  return (
    // matches.map((match : Match) => ())
    <div className='flex-col mb-3 border-[gray-100] border-2 rounded-xl p-3'>
        {/* title container */}
        <div className='pb-2'>
            <p className='text-2xl font-mono underline'>Matches</p>
        </div>
        <div className='flex gap-6 items-center pb-2'>
            <p className='text-xl font-mono text-[green]'>MATH2114</p>
            <TbArrowsLeftRight />
            <p className='text-xl font-mono text-[red]'>CS2506</p>
        </div>
        <div className='flex flex-col'>
            <p className='font-mono pb-1'>Set SWAP Date & Time</p>
            <DatePicker selected={startDate} onChange={(date) => {console.log('date: ', date, 'date.now: ', Date.now()-7200); if (date >= Date.now()-7200) {setStartDate(date) }}} className='border-2 rounded-md p-1' />
            <TimePicker className='mt-2 mb-2 w-[185px]' onChange={onChange} value={value} />
            <p className='font-mono mt-2 mb-1'>Suggested Time from russellm22@vt.edu</p>
            <DatePicker selected={startDate} onChange={(date) => {console.log('date: ', date, 'date.now: ', Date.now()-7200); if (date >= Date.now()-7200) {setStartDate(date) }}} className='border-2 rounded-md p-1' />
            <TimePicker className='mt-2 mb-2 w-[185px]' onChange={onChange} value={value} />
            <button className='w-[185px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Confirm Partner Suggested Time</button>
        </div>
    </div>
  )
}

export default Matches
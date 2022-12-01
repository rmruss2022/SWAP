import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { AiFillQuestionCircle } from 'react-icons/ai'
import {FaTrash} from 'react-icons/fa'
import { AppContext } from '../pages'
import { iAdding, iDropping } from '../utils/types'
import { BASE_URL } from '../utils/utils'

const userid = '6346d05cd53a982ce15d0601'

interface IProps {
    removeDroppedCRN: any,
    addDroppedCRN : any
}


const DropCRN = ({removeDroppedCRN, addDroppedCRN} : IProps) => {

    // const [droppingState, setDroppingState] = useState(dropping);

    const [dropCRN, setDropCRN] = useState('')
    const [semesterYear, setSemesterYear] = useState({year : 2023, semester: 12})
    const appContext = useContext(AppContext);


    
  return (
    <div className='flex-col mb-14 border-[gray-100] border-2 rounded-xl p-3'>
        {/* title */}
        <div className='pb-3 flex flex-wrap justify-between gap-2 cursor-pointer'>
            <p className='text-2xl font-mono underline'>CRNs to Drop</p>
            <a target="_blank" href='https://apps.es.vt.edu/ssb/HZSKVTSC.P_DispRequest' rel="noopener noreferrer">
                <AiFillQuestionCircle size={27} />
            </a>
        </div>
        {/* semesterYears.map(semYr => )                  select year and semester */}
        <div className='flex flex-wrap gap-6'>
            <button className='w-[185px] h-[45px] border-2 rounded-md mt-0 mb-3 jusitfy-center items-center border-[#3661e3] bg-[#3661e3]'>
                <p>Winter 2023</p>
            </button>
            <button className='w-[185px] h-[45px] border-2 rounded-md mt-0 mb-3 jusitfy-center items-center border-[#3661e3]'>
                <p>Spring 2023</p>
            </button>
        </div>
        {/* form drop by crn */}
        <div className='flex gap-6 items-center pb-4'>
            <input type="text" placeholder='...11856' value={dropCRN} onChange={(e) => setDropCRN(e.target.value)} className={`w-[185px] font-mono p-2 border-1 bg-gray-50 rounded-md text-[black]`} />
            <button onClick={() => addDroppedCRN(dropCRN)} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Drop</button>
        </div>
        {/* crn's already dropping */}
        {appContext.dropping.map((drop : iDropping, idx : number) => (
            <div key={idx} className='flex gap-2 justify-between mb-3 p-3 border border-indigo-600 rounded-xl md:w-[500px] w-full'>
                <div className='flex'>
                    <p className='text-md font-mono text-[red]'>CRN:</p>
                    <p className='text-md font-mono'>{drop.crn}, {drop.course}, {drop.title}</p>
                </div>
                <div>
                    <FaTrash onClick={() => removeDroppedCRN(drop.crn)} className='text-xl text-[red] cursor-pointer' />
                </div>
            </div>
        ))}

    </div>
  )
}

export default DropCRN
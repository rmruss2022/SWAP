import React, { useContext, useState } from 'react'
import {FaTrash} from 'react-icons/fa'
import { AppContext } from '../pages'
import { iAdding } from '../utils/types'
import {AiFillQuestionCircle} from 'react-icons/ai'
import Link from 'next/link'
import { motion } from "framer-motion"

interface IProps {
    addAddedCRN: any,
    removeAddedCRN: any
}
const AddCRN = ({addAddedCRN, removeAddedCRN} :  IProps) => {

    const appContext = useContext(AppContext);
    const [addInput, setAddInput] = useState('')

  return (
    <div className='flex-col mb-3 border-[gray-100] border-2 rounded-xl p-3'>
        {/* title */}
        <div className='pb-3 flex flex-wrap justify-between gap-2 cursor-pointer'>
            <p className='text-2xl font-mono underline'>CRNs to Add</p>
            <a target="_blank" href='https://apps.es.vt.edu/ssb/HZSKVTSC.P_DispRequest' rel="noopener noreferrer">
                <AiFillQuestionCircle size={27} />
            </a>
        </div>
        {/* semesterYears.map(semYr => )                  select year and semester */}
        <div className='flex flex-wrap gap-6'>
            <button className='w-[185px] h-[45px] border-2 rounded-md mt-0 mb-3 jusitfy-center items-center border-[#3661e3] bg-[#3661e3]'>
                <p>Winter 2023</p>
            </button>
            <motion.button className='w-[185px] h-[45px] border-2 rounded-md mt-0 mb-3 jusitfy-center items-center border-[#3661e3]'>
                <p>Spring 2023</p>
            </motion.button>
        </div>
        {/* form: add by crn */}
        <div className='flex gap-6 items-center pb-4'>
            <input type="text" placeholder='...22856' value={addInput} onChange={(e) => setAddInput(e.target.value)} className='w-[185px] font-mono p-2 border-1 bg-gray-50 text-[black] rounded-md' />
            <button onClick={() => addAddedCRN(addInput)} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Add</button>
        </div>
        {/* map crn's already added */}
        {appContext.adding.map((add : iAdding, idx: number) => (
            <div key={idx} className='flex gap-2 justify-between mb-3 p-3 border border-indigo-600 rounded-xl md:w-[500px] w-full'>
                <div className='flex'>
                    <p className='text-md font-mono text-[green]'>CRN:</p>
                    <p className='text-md font-mono'>{add.crn}, {add.course}, {add.title}</p>
                </div>
                <div>
                    <FaTrash onClick={() => removeAddedCRN(add.crn)} className='text-xl text-[red] cursor-pointer' />
                </div>
            </div>
        ))}

    </div>
  )
}

export default AddCRN
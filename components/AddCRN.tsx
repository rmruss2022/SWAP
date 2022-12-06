import React, { Context, useContext, useState } from 'react'
import {FaTrash} from 'react-icons/fa'
import { AppContext } from '../pages/_app'
import { iAdding, iAppContext, iSemester } from '../utils/types'
import {TbCalendarTime} from 'react-icons/tb'
import {AiOutlineQuestionCircle} from 'react-icons/ai'
import {IoRemoveCircleSharp} from 'react-icons/io5'
import Link from 'next/link'
import { motion } from "framer-motion"

interface IProps {
    addAddedCRN: any,
    removeAddedCRN: any
}
const AddCRN = ({addAddedCRN, removeAddedCRN} :  IProps) => {

    const appContext : iAppContext = useContext(AppContext);
    const [addInput, setAddInput] = useState('')
    const [selectedSemester, setSelectedSemester] = useState(appContext.semesters[0])
    const [alert, setAlert] = useState('')
    const [displayAcronymModal, setDisplayAcronymModal] = useState(false)

  return (
    <div className=' flex-col mb-3 border-[gray-100] border-2 rounded-xl p-3'>

        {/* modal to Course Request Number */}
        {displayAcronymModal &&
            <div onClick={() => setDisplayAcronymModal(false)} className='border-2 border-grey cursor-pointer relative mb-2 flex flex-col justify-center sm:w-[700px] w-[100%]  rounded-xl h-[100px] items-center bg-white'>
                <div className='absolute pb-[50px] pr-[7px] w-[100%] '>
                    <IoRemoveCircleSharp color='black' size={30} className=' t-0 float-right'/>
                </div>
                <p className='pl-2 text-black font-mono text-xl'>CRN : Course Request Number</p>
            </div>
        }
        

        {/* title */}
        <div className='pb-3 flex flex-wrap justify-between gap-2 cursor-pointer'>
            <div onClick={() => setDisplayAcronymModal(true)} className='flex'>
                <p className='text-2xl font-mono underline'>CRNs to Add</p>
                <AiOutlineQuestionCircle size={25} className='p-1' />
            </div>
            <a target="_blank" href='https://apps.es.vt.edu/ssb/HZSKVTSC.P_DispRequest' rel="noopener noreferrer">
                <TbCalendarTime className='border-2 rounded-full p-1' size={40} />
            </a>
        </div>
        <div className='flex flex-wrap gap-6'>
        {/* semesterYears.map(semYr => )                  select year and semester */}
        { appContext.semesters.map((semester : iSemester, idx: number) => (
            <button key={idx} onClick={() => setSelectedSemester(semester)} className={`w-[185px] h-[40px] border-2 rounded-md mt-0 mb-3 jusitfy-center items-center border-[#3661e3] ${selectedSemester.semesterNum === semester.semesterNum ? 'bg-blue-700 text-white' : 'bg-[white] dark:text-black'}`}>
                <p className={`text-[${selectedSemester.semesterNum === semester.semesterNum ? 'white' : 'dark:white'}]`}>{semester.semester} {semester.year} </p>
            </button>
        )) }
        </div>
        
        {/* form: add by crn */}
        <div className='flex gap-6 items-center pb-4'>
            <input type="text" placeholder='...22856' value={addInput} onChange={(e) => setAddInput(e.target.value)} className='w-[185px] border-2 border-[grey] font-mono p-2 border-1 bg-gray-50 text-[black] rounded-md' />
            <button onClick={() => {
                async function clicked() {
                    if (addInput.length !== 5) {
                        setAlert('Error invalid CRN Length, CRNs are 5 digits');
                        setInterval(() => 
                            setAlert('')
                        , 3000)
                        return
                    }
                    const resp = await addAddedCRN(addInput, selectedSemester.semesterNum, selectedSemester.year);
                    console.log('resp: ', resp)
                    if (resp) {
                        setAlert('Error invalid CRN or Semester');
                        setInterval(() => 
                            setAlert('')
                        , 3000)
                    }
                }
                clicked()
            }} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Add</button>
        </div>
        {/* map crn's already added */}
        {appContext.adding.map((add : iAdding, idx: number) => (
            <div key={idx} className='flex gap-2 justify-between mb-3 p-3 border-2 border-indigo-600 rounded-xl w-full'>
                <div className='flex justify-between w-full pr-3'>
                    {/* <p className='text-md font-mono text-[green]'>Course:</p> */}
                    <p className='text-md font-mono ml-1 text-[green]'>{add.title}</p>
                    <p className='text-md font-mono ml-1'>CRN: {add.crn}</p>
                    <p className='text-md font-mono ml-1'>{add.course}</p>
                </div>
                <div>
                    <FaTrash onClick={() => removeAddedCRN(add.crn)} className='text-xl text-[red] cursor-pointer' />
                </div>
            </div>
        ))}

        {alert !== '' && 
        <div className='mt-2 bg-[#ff7070] p-2 rounded-md'>
            <p>{alert}</p>
        </div> }

    </div>
  )
}

export default AddCRN
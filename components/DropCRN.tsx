import axios from 'axios'
import { interpolateAs } from 'next/dist/shared/lib/router/router'
import React, { useContext, useEffect, useState } from 'react'
import { AiFillQuestionCircle } from 'react-icons/ai'
import {FaTrash} from 'react-icons/fa'
import { sortAndDeduplicateDiagnostics } from 'typescript'
import { AppContext } from '../pages'
import { iAdding, iDropping, iSemester } from '../utils/types'
import { BASE_URL } from '../utils/utils'



interface IProps {
    removeDroppedCRN: any,
    addDroppedCRN : any
}


const DropCRN = ({removeDroppedCRN, addDroppedCRN} : IProps) => {

    // const [droppingState, setDroppingState] = useState(dropping);

    const [dropCRN, setDropCRN] = useState('')
    const [semesterYear, setSemesterYear] = useState({year : 2023, semester: 12})
    const appContext = useContext(AppContext);
    const [alert, setAlert] = useState('')
    const [selectedSemester, setSelectedSemester] = useState(appContext.semesters[0])


    
  return (
    <div className='flex-col mb-14 border-[gray-100] border-2 rounded-xl p-3 w-full'>

        <div className='pb-3 flex flex-wrap justify-between gap-2 cursor-pointer w-full'>
            <p className='text-2xl font-mono underline'>CRNs to Drop</p>
            <a target="_blank" href='https://apps.es.vt.edu/ssb/HZSKVTSC.P_DispRequest' rel="noopener noreferrer">
                <AiFillQuestionCircle size={27} />
            </a>
        </div>
        <div className='flex flex-wrap gap-6'>
        { appContext.semesters.map((semester : iSemester, idx : number) => (
            <button key={idx} onClick={() => setSelectedSemester(semester)} className={`w-[185px] h-[40px] border-2 rounded-md mt-0 mb-3 jusitfy-center items-center border-[#3661e3] ${selectedSemester.semesterNum === semester.semesterNum  ? 'bg-blue-700 text-white' : 'bg-[white] dark:text-black'}`}>
                <p className={`text-[${selectedSemester.semesterNum === semester.semesterNum ? 'bg-blue-700 text-white' : 'bg-[white]'}`}>{semester.year} {semester.semester} </p>
            </button>
        )) }
        </div>

        <div className='flex gap-6 items-center pb-4'>
            <input type="text" placeholder='...11856' value={dropCRN} onChange={(e) => setDropCRN(e.target.value)} className={`w-[185px] font-mono p-2 border-1 bg-gray-50 rounded-md text-[black]`} />
            <button onClick={() =>  {  
                    async function clicked() {
                        const resp = await addDroppedCRN(dropCRN, selectedSemester.semesterNum, selectedSemester.year)
                        console.log('resp: ', resp)
                        if (resp) {
                            setAlert('Error invalid CRN or Semester');
                            setInterval(() => 
                                setAlert('')
                            , 3000)
                        }
                    }
                    clicked()
                }}
                className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>
                Drop
            </button>
        </div>
        <div className='w-full'>
            {appContext.dropping.map((drop : iDropping, idx : number) => (
                <div key={idx} className='flex gap-2 justify-between mb-3 p-3 border-2 border-indigo-600 rounded-xl w-full'>
                    <div className='flex w-full'>
                        <p className='text-md font-mono text-[red]'>CRN:</p>
                        <p className='text-md font-mono'>{drop.crn}, {drop.course}, {drop.title}</p>
                    </div>
                    <div>
                        <FaTrash onClick={() => removeDroppedCRN(drop.crn, selectedSemester.semesterNum, selectedSemester.year)} className='text-xl text-[red] cursor-pointer' />
                    </div>
                </div>
            ))}
        </div>
        
        {alert !== '' && 
        <div className='mt-2 bg-[#ff7070] p-2 rounded-md'>
            <p>{alert}</p>
        </div> }

    </div>
  )
}

export default DropCRN



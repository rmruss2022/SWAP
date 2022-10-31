import React, { useState } from 'react'
import {FaTrash} from 'react-icons/fa'
import { iDropping } from '../utils/types'


interface IProps {
    dropping : [iDropping],
    removeDroppedCRN: any,
    addDroppedCRN: any
}

const DropCRN = ({dropping, removeDroppedCRN, addDroppedCRN} : IProps) => {

    const [droppingState, setDroppingState] = useState(dropping);
    const [dropCRN, setDropCRN] = useState('')
    
  return (
    <div className='flex-col mb-14 border-[gray-100] border-2 rounded-xl p-3'>
        {/* title */}
        <div className='pb-3'>
            <p className='text-2xl font-mono underline'>CRNs to Drop</p>
        </div>
        {/* form drop by crn */}
        <div className='flex gap-6 items-center pb-4'>
            <input type="text" placeholder='...11856' value={dropCRN} onChange={(e) => setDropCRN(e.target.value)} className='w-[185px] font-mono p-2 border-1 bg-gray-50 rounded-md' />
            <button onClick={() => addDroppedCRN(dropCRN)} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Add</button>
        </div>
        {/* crn's already dropping */}
        {dropping.map((drop : iDropping, idx : number) => (
            <div key={idx} className='flex gap-2 justify-between mb-3 p-3 border border-indigo-600 rounded-xl md:w-[500px] w-full'>
                <div className='flex'>
                    <p className='text-md font-mono text-[red]'>CRN:</p>
                    <p className='text-md font-mono'>{drop.crn}, {drop.course}, {drop.title}</p>
                </div>
                <div>
                    <FaTrash className='text-xl text-[red] cursor-pointer' />
                </div>
            </div>
        ))}

    </div>
  )
}

export default DropCRN
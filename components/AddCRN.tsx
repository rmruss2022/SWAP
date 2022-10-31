import React, { useState } from 'react'
import {FaTrash} from 'react-icons/fa'
import { iAdding } from '../utils/types'

interface IProps {
    adding: [iAdding],
    addAddedCRN: any,
    removeAddedCRN: any
}
const AddCRN = ({adding, addAddedCRN, removeAddedCRN} :  IProps) => {

    const [addingState, setAddingState] = useState(adding)

  return (
    <div className='flex-col mb-3 border-[gray-100] border-2 rounded-xl p-3'>
        {/* title */}
        <div className='pb-3'>
            <p className='text-2xl font-mono underline'>CRNs to Add</p>
        </div>
        {/* form: add by crn */}
        <div className='flex gap-6 items-center pb-4'>
            <input type="text" placeholder='...22856' className='w-[185px] font-mono p-2 border-1 bg-gray-50 rounded-md' />
            <button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Add</button>
        </div>
        {/* map crn's already added */}
        {addingState.map((add : iAdding, idx: number) => (
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
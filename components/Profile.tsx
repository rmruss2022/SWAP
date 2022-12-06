import React, { useContext } from 'react'
import { AuthenticatedContex } from '../pages/_app'
import Image from 'next/image'
import Torg from '../public/torg-03.png'

const Profile = () => {
    const authenticatedContext = useContext(AuthenticatedContex)
  return (
    <div className='w-full border-[gray-100] border-2 rounded-xl p-3'>
        <div className='flex h-[120px] gap-9 mb-5 mt-2'>
            <Image src={authenticatedContext.user.image} className='rounded-full' alt={''} width={120} height={120}  />
            
            <Image src={Torg} alt={''} className='w-full h-full' draggable={false}   />

        </div>


        

        <div className='flex flex-col'>
                
                <p className='font-mono text-2xl  '>{authenticatedContext.user.name}</p>
                {/* <div> */}
                    <p className='font-mono text-sm float-right'>{authenticatedContext.user.email}</p>
                    
                {/* </div> */}
                {/* <div> */}
                    <p className='float-right font-mono text-sm'>role: {authenticatedContext.user.role}</p>
                {/* </div> */}
               
                
            </div>
    </div>
  )
}

export default Profile
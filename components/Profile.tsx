import React, { useContext } from 'react'
import { AuthenticatedContex } from '../pages/_app'
import Image from 'next/image'
import Torg from '../public/images/torg-op-03.png'

const Profile = () => {
    const authenticatedContext = useContext(AuthenticatedContex)
  return (
    <div className='w-full border-[gray-100] border-2 rounded-xl p-3'>
        <div className='flex h-[120px] gap-9 mb-5 mt-2'>
            <div className='w-[125px]'>
                <Image src={authenticatedContext.user.image} className='rounded-full' alt={''} width={120} height={120}  />
            </div>
            
            <Image src={Torg} alt={''} className='w-full h-full' draggable={false}   />

        </div>


        

        <div className='flex flex-col'>
                
                <p className='font-mono text-2xl  '>{authenticatedContext.user.name}</p>
            
                <p className='font-mono text-sm float-right'>{authenticatedContext.user.email}</p>
               
                <p className='float-right font-mono text-sm'>role: {authenticatedContext.user.role}</p>
    
               
                
            </div>
    </div>
  )
}

export default Profile
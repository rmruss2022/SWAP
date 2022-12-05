import React, { useContext } from 'react'
import { AuthenticatedContex } from '../pages/_app'
import Image from 'next/image'

const Profile = () => {
    const authenticatedContext = useContext(AuthenticatedContex)
  return (
    <div className='w-full'>
        <div className='flex justify-between'>
            <Image src={authenticatedContext.user.image} className='rounded-full' alt={''} width={120} height={120}  />
            <div className='flex flex-col'>
                
                <p className='font-mono text-2xl  '>{authenticatedContext.user.name}</p>
                <div>
                    <p className='font-mono text-sm float-right'>{authenticatedContext.user.email}</p>
                    
                </div>
                <div>
                    <p className='float-right font-mono text-sm'>role: {authenticatedContext.user.role}</p>
                </div>
                
                
            </div>
            
        </div>

        
    </div>
  )
}

export default Profile
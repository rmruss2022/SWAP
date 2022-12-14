import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link'
import Router, { useRouter } from 'next/router';
import useAuthStore from '../store/authStore';
import {AiOutlineLogout} from 'react-icons/ai'
import Logo from '../public/Swap-navbar-logo-01.png'
import { useSession, signIn, signOut } from "next-auth/react"

const Navbar = () => {

    const {userProfile, addUser} = useAuthStore();
    const { data: session } = useSession()

    console.log('profile: ', userProfile)
    return (
        <div className='w-full flex justify-between items-center border-b-2 border-gray-200 py-2 px-4'>
            <Link href='/'>
                <div className='w-[100px] md:w-[130px]'>
                    <Image draggable='false' className='cursor-pointer' src={Logo} layout='responsive' />
                </div>
            </Link>
            <div className='relative'>
                {/* <p className='semi-bold text-3xl font-mono text-[rgb(97,48,62)] hidden md:block'></p>
                <p className='semi-bold text-3xl font-mono text-[rgb(97,48,62)] md:hidden sm:block'></p> */}
            </div>
            <div>
            {session &&
                <div className='flex gap-6 justify-center items-center '>
                    {session!.user!.name}
                    <Image src={session!.user!.image!} width={45} height={45} className='rounded-full' />
                    <button onClick={() => signOut()} className='bg-[#454893] p-1.5 rounded-md'>Sign out</button>
                </div>
            }
            {!session && 
                <>
                <button onClick={() => signIn('google')} className='bg-[#454893] p-1.5 rounded-md w-[120px]'>Sign in</button>
                </>
            }
                {/* { userProfile ? (
                    <div className='flex gap-5 md:gap-10'>
                        {userProfile?.image && (
                            <a href={`/profile/${userProfile._id}`}>
                                <div>
                                <Image width={40} height={40} className='rounded-full cursor-pointer' src={userProfile.image} alt='profile shoot' />
                                </div>
                            </a>
                        )}
                        {/* <button type='button' onClick={() => { googleLogout(); removeUser() }}>
                            <AiOutlineLogout color='red' fontSize={21} />
                        </button> */}
                    {/* </div> */}
                {/* ) : (
                    <p>hi</p>
                    // <button onClick={() => signIn('google')}>Login</button>
                    // <GoogleLogin onSuccess={(response) => createOrGetUser(response, addUser)} onError={() => console.log('error')} /> */} 
                {/* )} */}
            </div>
        </div>
    )
}

export default Navbar;
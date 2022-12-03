import React, {useState, useEffect, useContext} from 'react';
import Image from 'next/image';
import Link from 'next/link'
import Router, { useRouter } from 'next/router';
import useAuthStore from '../store/authStore';
import {AiOutlineLogout} from 'react-icons/ai'
import Logo from '../public/Swap-navbar-logo-01.png'
import { useSession, signIn, signOut } from "next-auth/react"
import { BASE_URL } from '../utils/utils';
import axios from 'axios';
import { AuthenticatedContex } from '../pages/_app';
import {IoMdLogOut} from 'react-icons/io'

const Navbar = () => {

    const {userProfile, addUser, removeUser} = useAuthStore();
    const { data: session } = useSession()
    const authenticatedContex = useContext(AuthenticatedContex)

    async function addUserToStore() {
        console.log('adding user to store')
        const resp = await axios.post(`${BASE_URL}/api/user/createUser`, {name: session!.user?.name, email: session!.user?.email, image: session!.user?.image})
        addUser(resp.data)
        authenticatedContex.setUser(resp.data)
    }
    React.useEffect(() => {
        console.log('session: ',session)
        console.log('user profile: ', userProfile)
        console.log('user profile auth: ', authenticatedContex.user)
        if (session == null) {
            removeUser();
            return
        }
        if (session && userProfile == null) {
            addUserToStore()
        }
        
    }, [session, userProfile, authenticatedContex.user])

    return (
        <div className='w-full flex justify-between items-center border-b-2 border-gray-200 py-1 px-4'>
            <Link href='/'>
                <div className='w-[100px] md:w-[130px]'>
                    <Image draggable='false' className='cursor-pointer' src={Logo} layout='responsive' />
                </div>
            </Link>
            
            <div className='flex justify-center items-center'>
                {session &&
                    <div className='flex gap-2 justify-center items-center md:gap-4 '>
                        <div className='flex justify-center items-center gap-5 md:border-2 rounded-md p-1 px-2'>
                            <p className='invisible sm:visible'>{session!.user!.name}</p>
                            <Image draggable={false} src={session!.user!.image!} width={40} height={40} className='rounded-full' />
                        </div>
                        <IoMdLogOut size={25} onClick={() => signOut()} className='cursor-pointer' />
                    </div>
                }
                {!session && 
                    <>
                    <button onClick={() => {
                        const user = signIn('google')
                        console.log('next auth sign in callback: ', user)
                        addUser(user)
                    }} className='bg-[#454893] p-1.5 text-[white] rounded-md w-[120px]'>Sign in</button>
                    </>
                }
            </div>
        </div>
    )
}

export default Navbar;
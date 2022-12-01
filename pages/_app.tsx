import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import { useState, useEffect, createContext } from 'react';
import {SessionProvider, useSession} from 'next-auth/react'
import { userAgent } from 'next/server';

export var AuthenticatedContex = createContext<any>(null);

function MyApp({ Component, pageProps, session }: any) { //session
  const [isSSR, setSSR] = useState(true);
  const [user, setUser] = useState('101')


  useEffect(()=> {
    setSSR(false);
  }, [])



  if (isSSR) return null;
  return (

    <SessionProvider session={session}>

      <AuthenticatedContex.Provider value={{user: user, setUser: setUser}} >

        <div className='xl:w-[1200] m-auto overflow-hidden h-[100vh]'>
          <Navbar />
          <div className='mt-4 flex-col gap-10 overflow-auto h-[88vh] videos flex-1 flex justify-center items-center'>
            <Component {...pageProps} />
          </div>
        </div>

      </AuthenticatedContex.Provider>

    </SessionProvider>

  )
}

export default MyApp

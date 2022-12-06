import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Navbar from '../components/Navbar'
import { useState, useEffect, createContext, useContext } from 'react';
import {SessionProvider, useSession} from 'next-auth/react'
import { userAgent } from 'next/server';
import { iUser } from '../utils/types';
import Head from 'next/head';

export var AuthenticatedContex = createContext<any>(null);
export var AppContext = createContext<any>(null);

function MyApp({ Component, pageProps, session }: any) { //session
  const [isSSR, setSSR] = useState(true);
  const [user, setUser] = useState<iUser>({_id : '', name : '', email : '', image : '', role : ''})
  const [addingCRNs, setAddingCRNs] = useState([])
  const [droppingCRNs, setDroppingCRNs] = useState([])
  const [semesters , setSemesters] = useState([])

  const authenticatedContext = useContext(AuthenticatedContex)
  pageProps['authenticatedContext'] = authenticatedContext

  useEffect(()=> {
    setSSR(false);
  }, [])



  if (isSSR) return null;
  return (

  <>

<Head>
          <title>Swap</title>
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          <link rel="shortcut icon" href="/favicon/favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/images/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/images/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/images/favicon-16x16.png"
          />
        </Head>

    <SessionProvider session={session}>

      

      <AuthenticatedContex.Provider value={{user: user, setUser: setUser}} >

      <AppContext.Provider value={{dropping : droppingCRNs, setDroppingCRNs : setDroppingCRNs, adding: addingCRNs, setAddingCRNs: setAddingCRNs, semesters : semesters, setSemesters}}>

        <div className='xl:w-[1200] m-auto overflow-hidden h-[100vh]'>
          <Navbar />
          <div className='mt-0 flex-col gap-10 overflow-auto h-[88vh] videos flex-1 flex justify-center items-center'>
            <Component {...pageProps} />
          </div>
        </div>
        </AppContext.Provider>

      </AuthenticatedContex.Provider>

    </SessionProvider>
  </>
  )
}

export default MyApp

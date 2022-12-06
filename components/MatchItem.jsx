import React, {useEffect, useState, useContext} from 'react'
import {TbArrowsLeftRight} from 'react-icons/tb'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimePicker from 'react-time-picker/dist/entry.nostyle';
import "react-time-picker/dist/TimePicker.css"
import "react-clock/dist/Clock.css";
import { iMatch, iSwapTime } from '../utils/types';
import { BASE_URL } from '../utils/utils';
import axios from 'axios'
import { AuthenticatedContex } from '../pages/_app';


const MatchItem = ({match, id, matchTime, fin}) => {


    console.log('match: ', match)
    console.log('match time:', matchTime)
    const [startDateUser, setStartDateUser] = useState( Object.keys(matchTime).includes('userTime') ? new Date(matchTime['userTime'].date) : new Date(new Date() - 18000000));
    const [startDatePartner, setStartDatePartner] = useState( Object.keys(matchTime).includes('partnerTime') ? new Date(matchTime['partnerTime'].date) : new Date(new Date() - 18000000));
    const [timeUser, setTimeUser] = useState(Object.keys(matchTime).includes('userTime') ? matchTime['userTime'].time : '10:00');
    const [timePartner, setTimePartner] = useState(Object.keys(matchTime).includes('partnerTime') ? matchTime['partnerTime'].time : '10:00');
    const [alert, setAlert] = useState('')
    const [showSwap, setShowSwap] = useState(false)
    const [userSwapConfirmed, setUserSwapConfirmed] = useState(false)
    const [partnerSwapConfirmed, setPartnerSwapConfirmed] = useState(false)
    const authenticatedContext = useContext(AuthenticatedContex)

    const submitSuggestedTime = async () => {
        const resp = await axios.post(`${BASE_URL}/api/swaptime/createTime`, {matchid : match._id, alive : true, userid: authenticatedContext.user._id, time : timeUser, date: startDateUser, confirmed: false, unconfirm : true})
        setAlert('Updated SWAP Time')
        setInterval(() => setAlert(''), 3000)
    }

    const confirmPartnerTime = async () => {
        const resp = await axios.post(`${BASE_URL}/api/swaptime/createTime`, {matchid : match._id, alive : true, userid: authenticatedContext.user._id, time : timePartner, date: startDatePartner, confirmed: true})
        setTimeUser(timePartner)
        setStartDateUser(startDatePartner)
        setAlert(`Confirmed Partner's Time`)
        setInterval(() => setAlert(''), 3000)
    }

    const isSwapTime = () => {
        if (Object.keys(matchTime).includes('partnerTime') && matchTime.partnerTime.confirmed === true && 
            startDatePartner.getFullYear() === startDateUser.getFullYear() &&
            startDatePartner.getMonth() === startDateUser.getMonth() &&
            startDatePartner.getDate() === startDateUser.getDate() &&
            Math.abs(Date.parse(`${startDatePartner.getDate()} ${startDatePartner.toLocaleString('default', { month: 'short' })} ${startDatePartner.getFullYear()} ${timePartner} GMT`) - (new Date() - 18000000)) < 600000) {
                
                setShowSwap(true)
        }
        
    }

    const userSwapConfirm = async () => {
        setUserSwapConfirmed(true)
        console.log('confirmed swap : ', authenticatedContext.user._id)
        await axios.post(`${BASE_URL}/api/matches/updateConfirmSwap`, {matchid : match._id,  updatingUser : authenticatedContext.user._id, userid1: match.userid1, userid2: match.userid2 , requestid1: authenticatedContext.user._id === match.userid1 ? match.request_1 : match.request_2, requestid2: authenticatedContext.user._id !== match.userid1 ? match.request_2 : match.request_1}) 
    }

    var interval;

    useEffect(() => {
        // query other users suggested swap time
        async function partnerSwapTime() {
            const resp = axios.post(`${BASE_URL}/api/swaptime/getByMatchId`)
        }
        isSwapTime()
        interval = setInterval(async() => {
            if (showSwap && !partnerSwapConfirmed && authenticatedContext.user._id) {
                console.log('user1 auth: ', authenticatedContext)
                console.log('user1 match: ', match.userid1.toString())
                const resp = await axios.post(`${BASE_URL}/api/matches/checkPartnerConfirmedSwap`, {matchid : match._id, user1 : authenticatedContext.user._id === match.userid1.toString()})
                // const resp = {data : {partnerConfirmed : false}}
                if (resp.data.partnerConfirmed) {
                    setPartnerSwapConfirmed(true)
                    clearInterval(interval)
                    
                }
            }
          }, 2000);
        
        return () => clearInterval(interval);
    }, [showSwap, authenticatedContext.user])

    

  return (
    <div key={id} className='flex-col mb-3 border-[gray-100] border-2 rounded-xl p-3'>
        {/* title container */}
        <div className='pb-2'>
            <p className='text-2xl font-mono underline'>Matches</p>
        </div>
        <div className='flex gap-6 items-center pb-2'>
            <p className='text-xl font-mono text-[green]'>{authenticatedContext.user._id === match.userid1 ? match.request1Object[0].add_course : match.request2Object[0].add_course}</p>
            <TbArrowsLeftRight />
            <p className='text-xl font-mono text-[red]'>{authenticatedContext.user._id === match.userid1 ? match.request1Object[0].drop_course : match.request2Object[0].drop_course}</p>
        </div>
        
        <div className='flex flex-col'>
            <p className='font-mono pb-1'>Set SWAP Date & Time (EST)</p>
            <DatePicker selected={startDateUser} onChange={(date) => {console.log('date: ', date, 'date.now: ', new Date(new Date() - 32400000)); if (date >= new Date(new Date() - 32400000)) {setStartDateUser(date) }}} className='border-2 rounded-md p-1 ml-0' />
              
            <TimePicker className='mt-2 mb-2 w-[185px]' onChange={setTimeUser} value={timeUser} />
            <button onClick={() => submitSuggestedTime()} className='w-[185px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Suggest SWAP Time</button>

            {Object.keys(matchTime).includes('partnerTime') && (
                <>
                    <p className='font-mono mt-2 mb-1'>Suggested Time from {matchTime['partnerTime'].user[0].email}</p>
                    <DatePicker selected={startDatePartner} onChange={(date) => {console.log('date: ', date, 'date.now: ', Date.now()-7200); if (date >= Date.now()-7200) {setStartDatePartner(date) }}} className='border-2 rounded-md p-1' />
                    <TimePicker className='mt-2 mb-2 w-[185px]' onChange={setTimePartner} value={timePartner} />
                    <button onClick={() => confirmPartnerTime()} className='w-[185px] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800'>Confirm Partner Suggested Time</button>
                </>
            )}

            {Object.keys(matchTime).includes('partnerTime') && matchTime['partnerTime'].confirmed === true && showSwap &&
                <div className='flex gap-3 flex-wrap'>
                    <button onClick={ userSwapConfirm} className={`w-[180px] h-[70px] ${userSwapConfirmed ? 'bg-[green]' : 'bg-[orange]'} rounded-md text-white`}>
                        SWAP Now!
                    </button>
                    <button disabled className={`w-[180px] h-[70px] ${partnerSwapConfirmed ? 'bg-[green]' : 'bg-[orange]'} rounded-md text-white`}>
                        Partner Confirmed SWAP
                    </button>
                </div>
            }
            
        </div>
        {alert != '' && <div className='mt-2 bg-[#ff7070] p-2 rounded-md'>{alert}</div>}
    </div>
  )
}

export default MatchItem
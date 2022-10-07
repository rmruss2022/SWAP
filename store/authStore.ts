import create from 'zustand'
import { persist } from 'zustand/middleware'
import { BASE_URL } from '../utils/utils'
import Image from 'next/image'
import axios from 'axios'

interface StoreUser {
    username: string,
    image: string,
    role: string,
    _id: string,
    _type: string,
    email: string,
    _createdAt: string,
    contributedprojects : string[],
    token : string
}


export const authStore = (set : any) => ({
    userProfile : <StoreUser>{},
    allUsers: [],
    addUser : (user : any) => set({userProfile : user}),
    removeUser : () =>  set({userProfile : null}),
    fetchAllUsers : async() => {
        const response = await axios.get(`${BASE_URL}/api/users`)
        console.log('storeuser response: ', response)
        set({allUsers: response.data})
    }

})

const useAuthStore = create(
    persist(authStore, {name : 'auth'})
)

export default useAuthStore;


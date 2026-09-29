import { createContext, useContext, useEffect, useState } from "react"
import axios from 'axios'


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"

const AppContext = createContext(undefined)

export const AppProvider = ({children}) =>{
 
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)

const api = axios.create({
    baseURL: BACKEND_URL,
    withCredentials: true
})

const loadUser = async () => {
  try {
    const response = await api.get('/api/v1/users/current-user'); 
    if (response.data.success) {
      setUser(response.data.data);
    }
  } catch (error) {
    setUser(null);
    if (error.response?.status !== 401) {
        console.log("Failed to load User:", error)
    }
  } finally {
    setLoading(false);
  }
};

useEffect(()=>{
loadUser()
},[])


const login = async (email, password) => {
  try {
    const response = await api.post('/api/v1/users/login', { email, password });    
    if (response.data.success) {
      setUser(response.data.data.user);
    }
  } catch (error) {
    console.error("Login failed:", error.response?.data?.message || error.message);
    throw error; 
  }
};


const register = async (name, email, password) => {
  try {
    const response = await api.post('/api/v1/users/register', { name, email, password });
    if (response.data.success) {
      setUser(response.data.data);
    }
  } catch (error) {
    console.error("Registration failed:", error.response?.data?.message || error.message);
    throw error; 
  }
};


const logout = async () => {
  try {
    const response = await api.post('/api/v1/users/logout');   
    if (response.data.success) {
      setUser(null);
    }
  } catch (error) {
    console.error("Logout failed:", error.response?.data?.message || error.message);
    setUser(null);
  }
};
 


   return  <AppContext.Provider value={{user, loading, api, login, register, logout}}>
            
            {children}

           </AppContext.Provider>
}

export const useApp = () => {
    const context = useContext(AppContext)
    if(context === undefined){
        throw new error('useApp must be used within an AuthProvider')
    }
    return context;
}
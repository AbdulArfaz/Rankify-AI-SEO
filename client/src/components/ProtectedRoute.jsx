import { Navigate, Outlet } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function ProtectedRoute() {

const {user, loading} = useApp()

if(loading){
    return (
        <div  className="min-h-screen flex items-center justify-center bg-dark-900">
            <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"/>
        </div>
    )
}

if(!user){
    return <Navigate to="/login" replace/>
}

    return <Outlet />;
}

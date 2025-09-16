"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import useRoleGuard from '../../Guards/useRoleGuard';
import Additems from '@/components/Additems';
import ViewItems from '@/components/Viewitems';
const AdminDashboard = () => {
  const router = useRouter();
  const { loading, authorized } = useRoleGuard("admin");
  const [activePage,setActivePage]=useState("dashboard");
  if (loading) return <div>Loading...</div>;
  if (!authorized) return <div>Not authorized</div>;
  
  const handleLogout = async () => {
    await signOut(auth);
    router.push('/Authentication/Login');
  };

  return (
    <div className='admin-container'>
      <div className='header bg-[#Eff2c0] text-black p-1 flex flex-row justify-between items-center'>
        <div className='logo text-4xl font-extrabold'>ADMIN PANNEL</div>
          <div onClick={handleLogout} className="cursor-pointer bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-block">Logout</div>
      </div>
      <div className='nav and content flex flex-row'>
        <div className='sidebar w-1/6 bg-[#3a4241] h-screen p-4'>
          <ul className='space-y-4'>
            <li onClick={() => setActivePage("addItems")}>Add items</li>
            <li onClick={() => setActivePage("viewItems")}>View items</li>
          </ul>
        </div>
        <div className='content w-5/6 p-4'>
          {activePage === "addItems" && <Additems />}
          {activePage === "viewItems" && <ViewItems />}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

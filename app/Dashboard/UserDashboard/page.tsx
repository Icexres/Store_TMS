"use client"
import React, { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import useRoleGuard from '@/app/Guards/useRoleGuard';
import Profile from '@/components/profile';
import ViewItems from '@/components/Viewitems';
import Transaction from '@/components/Transaction';
import TransactionHistory from '@/components/TransactionHistory';

const UserDashboard = () => {
    const router = useRouter();
    const { loading, authorized } = useRoleGuard("user");
    const [activePage,setActivePage]=useState("dashboard")
    if (loading) return <div>Loading...</div>;
    if (!authorized) return <div>Not authorized</div>;

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/Authentication/Login');
    };
  return (
    <div className='admin-container'>
      <div className='header bg-[#Eff2c0] text-black p-1 flex flex-row justify-between items-center'>
        <div className='logo text-4xl font-extrabold'>User Panel</div>
          <div onClick={handleLogout} className="cursor-pointer bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded inline-block">Logout</div>
      </div>
      <div className='nav and content flex flex-row'>
        <div className='sidebar w-1/6 bg-[#3a4241] h-screen p-4'>
          <ul className='space-y-4 mt-2'>
            <li onClick={() => setActivePage("profile")} className="cursor-pointer hover:text-[#Eff2c0] transition">Profile</li>
            <li onClick={() => setActivePage("viewItems")} className="cursor-pointer hover:text-[#Eff2c0] transition">View items</li>
            <li onClick={() => setActivePage("transaction")} className="cursor-pointer hover:text-[#Eff2c0] transition">Transaction</li>
            <li onClick={() => setActivePage("transactionHistory")} className="cursor-pointer hover:text-[#Eff2c0] transition">Transaction History</li>
          </ul>
        </div>
        <div className='content w-5/6 p-4'>
          {activePage === "viewItems" && <ViewItems role={'user'} />}
          {activePage === "profile" && <Profile />}
          {activePage === "transaction" && <Transaction />}
          {activePage === "transactionHistory" && <TransactionHistory role={'user'} />}
        </div>
      </div>
    </div>
  )
}

export default UserDashboard

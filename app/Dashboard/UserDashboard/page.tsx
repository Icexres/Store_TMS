"use client"
import React, { use } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth';
import { auth } from '../../../lib/firebase';
import useRoleGuard from '@/app/Guards/useRoleGuard';

const UserDashboard = () => {
    const router = useRouter();
    const { loading, authorized } = useRoleGuard("user");
    if (loading) return <div>Loading...</div>;
    if (!authorized) return <div>Not authorized</div>;

    const handleLogout = async () => {
        await signOut(auth);
        router.push('/Authentication/Login');
    };
  return (
    <div className='admin-container'>
      <div className='header bg-[#Eff2c0] text-black p-1'>
        <div className='logo text-4xl font-extrabold'>USER PANNEL</div>
      </div>
    </div>
  )
}

export default UserDashboard

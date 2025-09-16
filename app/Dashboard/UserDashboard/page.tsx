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
    <div>
      <h1>User Dashboard</h1>
      <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">
        Logout
      </button>
    </div>
  )
}

export default UserDashboard

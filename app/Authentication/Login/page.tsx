'use client'
import React from 'react'
import Link from 'next/link'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, db } from '../../../lib/firebase'; // Adjust path as needed
import { signInWithEmailAndPassword } from "firebase/auth";
import {doc,getDoc} from 'firebase/firestore';
const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const uid= userCredential.user.uid;
            //fetch role
            const userDoc= await getDoc(doc(db,"users",uid));
            const role= userDoc.exists()? userDoc.data().role : null;
            if(role=== "admin"){
            router.push("/Dashboard/AdminDashboard");
        } else if(role=== "user"){
            router.push("/Dashboard/UserDashboard");
        } else {
            setError("No role assigned. Contact admin.");
        }
    } catch (err:any) {
        setError("Failed to log in: " + err.message);
    }
}
  return (<>
    <div className='Login-container'>
      <div className='header bg-[#Eff2c0] text-black p-1'>
        <Link href="/"> <div className='logo text-4xl font-extrabold'>BMS</div></Link>
      </div>
        {/* end of header */}
    <div className='form'>
        <form onSubmit={handleLogin} className="items-center bg-[#A4BAB7] shadow-lg rounded-lg p-8 w-full max-w-md mx-auto mt-28">
            <div className="self-auto text-3xl font-extrabold mb-4 text-gray-800">Log in</div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email:</label>
            <input
            type="text"
            placeholder="Enter your email"
            className=" text-black p-3 mb-4 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0070f3] transition"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            />
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password:</label>
            <input
            type="password"
            placeholder="Password"
            className=" text-black p-3 mb-4 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0070f3] transition"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            />
            {error && <div className="text-red-500 mb-4">{error}</div>}
            <div className="flex justify-center">
                <button type="submit" className="bg-[#0070f3] hover:bg-[#005bb5] text-white font-semibold py-3 px-6 rounded transition">Login</button>
            </div>
        </form>
        </div>
    </div>
    <div className='footer bg-[#Eff2c0] text-black p-4 mt-60 text-center'>
            <small>&copy; 2025 BMS. All rights reserved.</small>
        </div>
  </>
  )
}

export default Login

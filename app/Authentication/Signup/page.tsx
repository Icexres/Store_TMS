"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, db} from '../../../lib/firebase'; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Signup = () => {
    const[username,setUsername]= useState("");
    const[email,setEmail]= useState("");
    const[password,setPassword]= useState("");
    const[error,setError]= useState("");
    const[success, setSuccess] = useState("");
    const router = useRouter();


    async function handleSignup(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setSuccess("");
        try{
            //user creation in firebase authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const uid = userCredential.user.uid;

            //store user info in Firestore with dfault role user;
            await setDoc(doc(db,"users",uid),{
                username,
                email,
                role:"user"
            });
            setSuccess("Account created successfully! Redirecting to login...");
            //redirect to login page after successful signup
            setTimeout(() => {
                router.push("/Authentication/Login");
            }, 2000); // Show message for 2 seconds before redirect
        } catch (error:any) {
            setError("Failed to create an account: " + error.message);
        }
    }

  return (
    <> 
    <div className='Login-container'>
      <div className='header bg-[#Eff2c0] text-black p-1'>
        <Link href="/"> <div className='logo text-4xl font-extrabold'>BIMS</div></Link>
      </div>
        {/* end of header */}
    <div className='form'>
        <form onSubmit={handleSignup} className="items-center bg-[#A4BAB7] shadow-lg rounded-lg p-8 w-full max-w-md mx-auto mt-28">
            <div className="self-auto text-3xl font-extrabold mb-4 text-gray-800">Sign Up</div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="username">Username:</label>
            <input
            type="text"
            placeholder="Enter your Username"
            className=" text-black p-3 mb-4 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0070f3] transition"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            />  
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email:</label>
            <input
            type="email"
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
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className=" text-black p-3 mb-4 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0070f3] transition"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {success && <p className="text-green-600 mb-4">{success}</p>}
            <div className="flex justify-center">
                <button type="submit" className="bg-[#0070f3] hover:bg-[#005bb5] text-white font-semibold py-3 px-6 rounded transition">Sign Up</button>
            </div>
        </form>
        </div>
    </div>
    <div className='footer bg-[#Eff2c0] text-black p-4 mt-60 text-center'>
            <small>&copy; 2025 BIMS. All rights reserved.</small>
        </div>
  </>
  )
}

export default Signup

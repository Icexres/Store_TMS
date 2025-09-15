import React from 'react'
import Link from 'next/link'

const Signup = () => {
  return (
    <>
    <div className='Login-container'>
      <div className='header bg-[#Eff2c0] text-black p-1'>
        <Link href="/"> <div className='logo text-4xl font-extrabold'>TMS</div></Link>
      </div>
        {/* end of header */}
    <div className='form'>
        <form className="items-center bg-[#A4BAB7] shadow-lg rounded-lg p-8 w-full max-w-md mx-auto mt-28">
            <div className="self-auto text-3xl font-extrabold mb-4 text-gray-800">Sign Up</div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Username:</label>
            <input
            type="text"
            placeholder="Enter your Username"
            className=" text-black p-3 mb-4 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0070f3] transition"
            />
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email:</label>
            <input
            type="text"
            placeholder="Enter your email"
            className=" text-black p-3 mb-4 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0070f3] transition"
            />
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">Password:</label>
            <input
            type="password"
            placeholder="Password"
            className=" text-black p-3 mb-4 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0070f3] transition"
            />
            <div className="flex justify-center">
                <button type="submit" className="bg-[#0070f3] hover:bg-[#005bb5] text-white font-semibold py-3 px-6 rounded transition">Login</button>
            </div>
        </form>
        </div>
    </div>
    <div className='footer bg-[#Eff2c0] text-black p-4 mt-60 text-center'>
            <small>&copy; 2025 TMS. All rights reserved.</small>
        </div>
  </>
  )
}

export default Signup

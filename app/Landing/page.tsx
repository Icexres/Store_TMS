import React from 'react'
import Link from 'next/link'

const Landing = () => {
  return ( <>
    <div className='landiing-container'>
      <div className='header bg-[#Eff2c0] text-black p-1'>
        <div className='logo text-4xl font-extrabold'>TMS</div>
      </div>
      {/* end of header */}
        <div className='content text-center mt-40 flex flex-col gap-8'>
            <div className='text-4xl font-serif font-extrabold'>Get Started With TMS</div>
            <div className='button-container flex flex-row justify-center gap-20 font-semibold'>
                <Link href="/Authentication/Login">
                    <div className='bg-[#Eff2c0] border-2 border-black text-2xl px-4 py-2 rounded-full text-black hover:bg-black hover:border-2 hover:border-[#Eff2c0] hover:text-[#eff2c0] transition-colors duration-300 cursor-pointer'>Login</div>
                </Link>
                <Link href="/Authentication/Signup">
                    <div className='bg-[#Eff2c0] border-2 border-black text-2xl px-4 py-2 rounded-full text-black hover:bg-black hover:border-2 hover:border-[#Eff2c0] hover:text-[#eff2c0] transition-colors duration-300 cursor-pointer'>Signup</div>
                </Link>
            </div>
        </div>
    {/* end of content */}
    </div>
        <div className='footer bg-[#Eff2c0] text-black p-4 mt-60 text-center'>
            <small>&copy; 2025 TMS. All rights reserved.</small>
        </div>
 
</>  )
}

export default Landing

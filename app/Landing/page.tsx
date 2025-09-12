import React from 'react'

const Landing = () => {
  return (
    <div className='landiing-container'>
      <div className='header bg-[#Eff2c0] text-black p-1'>
        <div className='logo text-4xl font-extrabold'>TMS</div>
      </div>
      {/* end of header */}
        <div className='content text-center mt-40 flex flex-col gap-8'>
            <div className='text-4xl font-serif font-extrabold'>Get Started With TMS</div>
            <div className='button-container flex flex-row justify-center gap-20 font-semibold'>
                <div className='bg-[#Eff2c0] border-2 border-black text-2xl px-4 py-2 rounded-full text-black hover:bg-black hover:border-2 hover:border-[#Eff2c0] hover:text-[#eff2c0] transition-colors duration-300 cursor-pointer'>Login</div>
                <div className='bg-[#Eff2c0] border-2 border-black text-2xl px-4 py-2 rounded-full text-black hover:bg-black hover:border-2 hover:border-[#Eff2c0] hover:text-[#eff2c0] transition-colors duration-300 cursor-pointer'>Signup</div>
            </div>
        </div>
    {/* <div className='form'>
        <form className=" items-center bg-[#A4BAB7] shadow-lg rounded-lg p-8 w-full max-w-md mx-auto mt-28">
            <label className=" self-auto text-3xl font-extrabold mb-6 text-gray-800">Sign Up for TMS</label>
            <input
            type="text"
            placeholder="Enter your email"
            className="p-3 mb-4 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0070f3] transition"
            />
            <button
            type="submit"
            className="bg-[#0070f3] hover:bg-[#005bb5] text-white font-semibold py-3 px-6 rounded w-full transition"
            >
            Get Started
            </button>
        </form>
        </div> */}
    </div>
  )
}

export default Landing

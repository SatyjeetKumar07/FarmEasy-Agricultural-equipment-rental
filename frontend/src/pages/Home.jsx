import React from 'react'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='w-full h-screen bg-[#f7f7f8]' style={{ fontFamily: "'Exo 2', sans-serif" }}>
      {/* navbar------------------------ */}
      <nav className='navbar p-2 px-8 w-full h-16 flex items-center bg-[#f7f7f8b8] fixed top-0 z-10'>
        <div className='flex align-center items-center justify-start gap-2 w-1/3'>
          <img src="../src/assets/s logo.jpeg" alt="" className='rounded-full' width={"70px"} />
          <h2 className='text-2xl text-zinc-800 font-bold'>FarmEasy</h2>
        </div>
        <div className='flex items-end justify-center gap-4 w-1/3'>
          <h1 className='hover:bg-[#b2d8b4] p-1 rounded-md'><Link to="/About">Home</Link></h1>
          <h1 className='hover:bg-[#b2d8b4] p-1 rounded-md'><Link to="/contact">Contact us</Link></h1>
          <h1 className='hover:bg-[#b2d8b4] p-1 rounded-md'><Link to="/about">About us</Link></h1>
        </div>
        <div className='flex items-end justify-end gap-3 w-1/3'>
          {/* Login button */}
          <Link
            to="/login"
            className="bg-[#2a7f62] hover:bg-[#2f6b57] text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
        </div>
      </nav>

      {/* Video Section------------------ */}
      <div style={{ marginTop: '64px' }}>
        <video
          src="../src/assets/MajorVideo.mp4"
          autoPlay
          loop
          muted
          style={{ width: '100%', height: '85vh', objectFit: 'cover' }}
        />
      </div>

      {/* Hero Section------------------ */}
      <div className='w-full h-screen bg-[#f7f7f8] flex items-center'>
        <div className='w-1/2 px-2 ml-20 items-center justify-center'>
          <h1 className='text-9xl text-[#2a7f62] text-bold mb-3'>FarmEasy</h1>
          <h2 className='text-3xl text-[#41676a]'>Your Partner in Prosperous Farming</h2>
          <h2 className='text-xl text-zinc-600 mt-4'>
            🌱 FarmEasy is committed to empowering farmers with the right tools at the right time.
            Through our easy-to-use rental platform, we provide affordable access to essential equipment,
            helping farmers boost productivity and maximize profitability.
            Together, we strive to nurture a future where sustainable farming thrives, ensuring growth,
            prosperity, and a better tomorrow for every farmer. 🌾
          </h2>
          <button className="bg-[#2a7f62] hover:bg-[#2f6b57] text-white font-bold py-2 px-4 mt-11 rounded">
            <Link to="/register">Register Here</Link>
          </button>
        </div>
        <div className='w-1/2 ml-60'>
          <img src="../src/assets/s logo.jpeg" alt="" className='rounded-full' width={"500px"} />
        </div>
      </div>

      {/* Footer ------------*/}
      <Footer />
    </div>
  )
}

export default Home

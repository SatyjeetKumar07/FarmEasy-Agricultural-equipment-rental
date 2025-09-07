import React from 'react'

function Footer() {
    return (
        <div className=' p-2 px-8 w-full border-t border-zinc-500  flex items-center bg-[#f7f7f8b8]  bottom-0 z-10'>
            <div className='flex align-center items-center justify-start gap-2 w-1/3'>
                <img src="../src/assets/Logo2.png" alt="" className='rounded-full ' width={"50px"} />
                <h2 className='text-3xl text-zinc-800 font-bold'>farmEasy</h2>
            </div>

            <div className='flex  gap-4 justify-between w-1/2'>
                <div className='flex flex-col items-start justify-start  w-1/3'>
                    <h1 >Project</h1>
                    <h1 className='hover:bg-[#b2d8b4] p-1 rounded-md'><a href="#contact">How it works</a></h1>
                    <h1 className='hover:bg-[#b2d8b4] p-1 rounded-md'><a href="#contact">Who we Help</a></h1>
                    
                </div>
                <div className='flex flex-col items-start justify-start  w-1/3'>
                    <h1 >About us</h1>
                    
                    <h1 className='hover:bg-[#b2d8b4] p-1 rounded-md'><a href="#contact">FAQs</a></h1>
                    <h1 className='hover:bg-[#b2d8b4] p-1 rounded-md'><a href="#contact">Contact</a></h1>
                </div>
                <div className='flex flex-col items-start justify-start  w-1/3'>
                    <h1 >Privacy</h1>
                    <h1 className='hover:bg-[#b2d8b4] p-1 rounded-md'><a href="#contact">Policies</a></h1>
                    <h1 > © 2025 Brand. Inc</h1>
                </div>
            </div>

           <div className='flex flex-col items-end justify-end w-1/3'>
                
                <div className='flex gap-2'>
                    <i class="ri-instagram-line" style={{ fontSize: '22px', color: '#302a7fff' }}></i>
                    <i class="ri-twitter-x-line" style={{ fontSize: '22px', color: '#461cbaff' }} ></i>
                    <i class="ri-facebook-box-fill" style={{ fontSize: '22px', color: '#342a7fff' }}></i>
                    <i class="ri-linkedin-box-fill" style={{ fontSize: '23px', color: '#2a2b7fff' }}></i>
                </div>
            </div>
        </div>
    )
}

export default Footer

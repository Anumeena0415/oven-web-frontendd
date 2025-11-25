import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Services from '../components/Services'
import Footer from '../components/Footer'
import GetStarted from '../components/GetStarted'
import CustomerStories from '../components/CustomerStories'

import Blogcard from "./Blogcard";
import axios from 'axios'

const Blog = () => {
    useEffect(() => {
        getData()
    }, []);
    const [services, setSevices] = useState([])
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://ovevents.onrender.com";
    const getData = async () => {
        await axios.get(`${BASE_URL}/blog`)
            .then((res) => {
                setSevices(res.data)
            })
    }


    return (
        <div>
            <Navbar />

            <section className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-8 sm:mb-12 lg:mb-16">

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mt-4 sm:mt-6 lg:mt-8">
                            Event Planning Blog
                        </h2>
                        <p className="text-gray-500 mt-2 sm:mt-3 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4">
                            Expert tips, guides, and inspiration for planning your perfect event
                        </p>
                    </div>



                    {/* Cards */}
                    {services.length > 0 ?
                        <h2 className='pb-2 text-2xl font-bold text-zinc-800'>All Articals</h2> : <h2 className='pb-2 text-2xl font-bold text-zinc-800'>No Blogs Available</h2>}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                        {services?.map((service, index) => (
                            <Blogcard key={index} {...service} />
                        ))}
                    </div>
                </div>
            </section>

            <GetStarted text="Explore Services" />
            <Footer />
        </div>

    )
}

export default Blog

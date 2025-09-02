import React from 'react';
import Navbar from '@/components/Navbar'
import Footer from "@/components/Footer";
import HeroForHim from '@/components/Him/Hero';

const page = () => {
    return (
        <>
            <Navbar />
            <HeroForHim />
            <Footer />   
        </>
    )
}

export default page

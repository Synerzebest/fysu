import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import HeroForHer from '@/components/Her/Hero';
import CoatsJackets from '@/components/Her/CoatsJackets';

const page = () => {
    return (
        <>
            <Navbar />
            <HeroForHer />
            <CoatsJackets />
            <Footer />   
        </>
    )
}

export default page

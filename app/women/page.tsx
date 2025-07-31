import React from 'react';
import { Navbar, Footer } from "@/components";
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

import React from 'react';
import HeroChapter1 from '@/components/Prelude/chapter1/Hero';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const page = () => {
    return (
        <>
            <Navbar />
            <HeroChapter1 />
            <Footer />
        </>
    )
}

export default page

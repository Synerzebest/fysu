import React from 'react';
import { Navbar, Footer } from "@/components";
import HeroForHim from '@/components/Him/Hero';
import CollectionGrid from '@/components/Prelude/chapter1/CollectionGrid';

const page = () => {
    return (
        <>
            <Navbar />
            <HeroForHim />
            <CollectionGrid />
            <Footer />   
        </>
    )
}

export default page

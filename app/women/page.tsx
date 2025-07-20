import React from 'react';
import { Navbar, Footer } from "@/components";
import HeroForHer from '@/components/Her/Hero';
import CollectionGrid from '@/components/Prelude/chapter1/CollectionGrid';

const page = () => {
    return (
        <>
            <Navbar />
            <HeroForHer />
            <CollectionGrid />
            <Footer />   
        </>
    )
}

export default page

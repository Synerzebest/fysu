import React from 'react';
import { Navbar, Footer } from "@/components";
import CollectionGrid from '@/components/Prelude/chapter1/CollectionGrid';
import HeroEastwind from '@/components/Eastwind/Hero';

const page = () => {
    return (
        <>
            <Navbar />
            <HeroEastwind />
            <CollectionGrid />
            <Footer />   
        </>
    )
}

export default page

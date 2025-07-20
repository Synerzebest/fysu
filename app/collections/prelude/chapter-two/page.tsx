import React from 'react';
import { Navbar, Footer } from '@/components';
import HeroChapter2 from '@/components/Prelude/chapter2/Hero';
import CollectionGrid from '@/components/Prelude/chapter1/CollectionGrid';

const page = () => {
    return (
        <>
            <Navbar />
            <HeroChapter2 />
            <CollectionGrid />
            <Footer />
        </>
    )
}

export default page

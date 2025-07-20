import React from 'react';
import { Navbar, Footer } from '@/components';
import HeroChapter1 from '@/components/Prelude/chapter1/Hero';
import CollectionGrid from '@/components/Prelude/chapter1/CollectionGrid';

const page = () => {
    return (
        <>
            <Navbar />
            <HeroChapter1 />
            <CollectionGrid />
            <Footer />
        </>
    )
}

export default page

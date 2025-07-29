'use client'

import ProductForm from '@/components/admin/ProductForm';
import { Navbar, Footer } from '@/components';
import HeroSliderDashboard from '@/components/admin/HeroSliderDashboard';

const AdminPage = () => {
  return (
    <>
      <Navbar />
      <ProductForm />
      <HeroSliderDashboard />
      <Footer />
    </>
  )
}

export default AdminPage

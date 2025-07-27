'use client'

import ProductForm from '@/components/admin/ProductForm'
import { Navbar, Footer } from '@/components'

const AdminPage = () => {
  return (
    <>
      <Navbar />
      <ProductForm />
      <Footer />
    </>
  )
}

export default AdminPage

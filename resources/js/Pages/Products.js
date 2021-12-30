import React from 'react'
import Authenticated from '@/Layouts/Authenticated'
import { Head } from '@inertiajs/inertia-react'

export default function Products(props) {
  return (
    <Authenticated
      auth={props.auth}
      errors={props.errors}
      header={
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
              Barang
          </h2>
      }
    >
      <Head title="Products" />
      <div className="py-12">
        <div className="flex flex-col sm:px-6 lg:px-8 space-x-4">
          
        </div>
      </div>
    </Authenticated>
  )
}
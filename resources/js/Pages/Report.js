import React from 'react'
import Authenticated from '@/Layouts/Authenticated'
import { Head } from '@inertiajs/inertia-react'

export default function Report(props) {
  return (
    <Authenticated
      auth={props.auth}
      errors={props.errors}
      header={
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">
              Laporan
          </h2>
      }
    >
      <Head title="Report" />
      <div className="py-12">
        <div className="flex flex-row w-full sm:px-6 lg:px-8 space-x-4">
          
        </div>
      </div>
    </Authenticated>
  )
}
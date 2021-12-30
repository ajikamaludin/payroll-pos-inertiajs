import React from 'react';
import Authenticated from '@/Layouts/Authenticated';
import { Head } from '@inertiajs/inertia-react';

export default function Dashboard(props) {
    const { employee, product } = props
    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="flex flex-row sm:px-6 lg:px-8 space-x-4">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg w-full">
                        <div className="py-4 px-4 font-bold text-xl">
                            <div className="text-4xl">{product}</div>
                            Barang
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg w-full">
                        <div className="py-4 px-4 font-bold text-xl">
                            <div className="text-4xl">{employee}</div>
                            Karyawan
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}

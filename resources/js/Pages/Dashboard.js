import React, { useState, useEffect } from 'react'
import { usePrevious } from 'react-use'
import { Inertia } from '@inertiajs/inertia'
import DatePicker from 'react-datepicker'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip)

import Authenticated from '@/Layouts/Authenticated'
import { Head } from '@inertiajs/inertia-react'
import { formatIDR } from '@/utils'

export default function Dashboard(props) {
    const {
        employee,
        product,
        totalAmount,
        totalItem,
        employees,
        products,
        charts,
        _startDate,
        _endDate,
    } = props

    const [startDate, setStartDate] = useState(
        _startDate ? new Date(_startDate) : new Date()
    )
    const [endDate, setEndDate] = useState(
        _endDate ? new Date(_endDate) : new Date()
    )
    const preValue = usePrevious(`${startDate}-${endDate}`)

    const options = {
        responsive: true,
    };

    const data = {
        labels: charts.map((item) => item.date),
        datasets: [
            {
                label: 'Sales',
                data: charts.map((item) => item.amount),
                backgroundColor: 'rgb(87, 13, 248, 0.5)', //rgb(87, 13, 248, 0.5) //rgba(255, 99, 132, 0.5)
            },
        ],
    }

    useEffect(() => {
        if (preValue) {
            Inertia.get(route(route().current()), {startDate, endDate}, {
                replace: true,
                preserveState: true,
            })
        }
    }, [startDate, endDate])

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
                <div className="flex flex-col md:flex-row sm:px-6 lg:px-8 space-x-0 md:space-x-4 space-y-2 md:space-y-0">
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
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg w-full">
                        <div className="py-4 px-4 font-bold text-xl">
                            <div className="text-4xl">
                                Rp. {formatIDR(totalAmount)}
                            </div>
                            Minggu ini
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg w-full">
                        <div className="py-4 px-4 font-bold text-xl">
                            <div className="text-4xl">
                                {formatIDR(totalItem)}
                            </div>
                            Minggu ini
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row sm:px-6 lg:px-8 space-x-0 md:space-x-4 space-y-2 md:space-y-0 mt-4">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg w-full">
                        <div className="flex flex-col md:flex-row justify-between pt-4 px-4 font-bold text-xl">
                            <div className="my-auto">Gajian Minggu ini</div>
                            <div>
                                <div className="flex flex-row md:space-x-4">
                                    <div>
                                        <label className="label">
                                            <span className="label-text">
                                                Tanggal Awal
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <DatePicker
                                                selected={startDate}
                                                onChange={(date) => {
                                                    setStartDate(date)
                                                }}
                                                format="dd/mm/yyyy"
                                                className="input input-bordered"
                                                nextMonthButtonLabel=">"
                                                previousMonthButtonLabel="<"
                                            />
                                            <div className="absolute right-2.5 rounded-l-none y-0 flex items-center top-2.5">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="label">
                                            <span className="label-text">
                                                Tanggal Akhir
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <DatePicker
                                                selected={endDate}
                                                onChange={(date) => {
                                                    setEndDate(date)
                                                }}
                                                format="dd/mm/yyyy"
                                                className="input input-bordered"
                                                nextMonthButtonLabel=">"
                                                previousMonthButtonLabel="<"
                                            />
                                            <div className="absolute right-2.5 rounded-l-none y-0 flex items-center top-2.5">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-6 w-6"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 pb-4">
                            <Bar options={options} data={data} className='max-h-96' />;
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row sm:px-6 lg:px-8 space-x-0 md:space-x-4 space-y-2 md:space-y-0 mt-4">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg w-full">
                        <div className="py-4 px-4 font-bold text-xl border-b-2 border-b-gray-400">
                            Kerjaan karyawan minggu ini
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table w-full table-compact">
                                <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Quantity</th>
                                        <th>Grand Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {employees.map((item) => (
                                        <tr
                                            key={`employee-${item.employee_id}`}
                                        >
                                            <td>{item.employee.name}</td>
                                            <td>{formatIDR(item.count)}</td>
                                            <td>{formatIDR(item.amount)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg w-full">
                        <div className="py-4 px-4 font-bold text-xl border-b-2 border-b-gray-400">
                            Produk Masuk minggu ini
                        </div>
                        <div className="overflow-x-auto">
                            <table className="table w-full table-compact">
                                <thead>
                                    <tr>
                                        <th>Nama</th>
                                        <th>Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((item) => (
                                        <tr key={`product-${item.product_id}`}>
                                            <td>{item.product.name}</td>
                                            <td>{formatIDR(item.count)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </Authenticated>
    )
}

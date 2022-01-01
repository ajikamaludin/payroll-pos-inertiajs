import React, { useState, useEffect } from 'react'
import DatePicker from 'react-datepicker'
import moment from 'moment'
import { Head, Link } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import { usePrevious } from 'react-use'
import { toast } from 'react-toastify'

import { useModalState } from '@/Hooks'
import Authenticated from '@/Layouts/Authenticated'
import Pagination from '@/Components/Pagination'
import ModalConfirm from '@/Components/ModalConfirm'
import { formatIDR, formatDate } from '@/utils'

export default function Payrolls(props) {
    const { data: payrolls, links } = props.payrolls
    const { _startDate, _endDate } = props

    const [startDate, setStartDate] = useState(_startDate ?  new Date(_startDate) : new Date())
    const [endDate, setEndDate] = useState(_endDate ? new Date(_endDate) : new Date())
    const preValue = usePrevious(`${startDate}-${endDate}`)

    const confirmModal = useModalState(false)
    const handleDelete = (payroll) => {
        confirmModal.setData(payroll)
        confirmModal.toggle()
    }

    const onDelete = () => {
        const payroll = confirmModal.data
        if (payroll != null) {
            Inertia.delete(route('payrolls.destroy', payroll), {
                onSuccess: () => toast.success('The Data has been deleted'),
            })
        }
    }

    const params = {
        startDate: moment(startDate).format('yyyy-MM-DD'),
        endDate: moment(endDate).format('yyyy-MM-DD'),
    }

    useEffect(() => {
        if (preValue) {
            Inertia.get(
                route(route().current()),
                params,
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [startDate, endDate])

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Gaji
                </h2>
            }
        >
            <Head title="Payroll" />
            <div className="py-12">
                <div className="flex flex-col w-full sm:px-6 lg:px-8 space-y-2">
                    <div
                        className="card bg-white w-full"
                        style={{ minHeight: '400px' }}
                    >
                        <div className="card-body">
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 items-start md:items-stretch w-full mb-4 justify-between">
                                <Link
                                    className="btn btn-neutral my-auto"
                                    href={route('payrolls.create')}
                                >
                                    Tambah
                                </Link>
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
                            <div className="overflow-x-auto">
                                <table className="table w-full table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Tanggal</th>
                                            <th>Nama Karyawan</th>
                                            <th>Potongan</th>
                                            <th>Bonus</th>
                                            <th>Total</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payrolls.map((payroll) => (
                                            <tr key={payroll.id}>
                                                <th>
                                                    {formatDate(payroll.date)}
                                                </th>
                                                <td>{payroll.employee.name}</td>
                                                <td>
                                                    {formatIDR(payroll.cuts)}
                                                </td>
                                                <td>
                                                    {formatIDR(payroll.bonus)}
                                                </td>
                                                <td>
                                                    {formatIDR(payroll.recived)}
                                                </td>
                                                <td className="text-right">
                                                    <a
                                                        className="btn btn-outline mx-1"
                                                        href={route(
                                                            'payrolls.pdf',
                                                            payroll
                                                        )}
                                                        download={`${payroll.employee.name}-${payroll.date}.pdf`}
                                                    >
                                                        PDF
                                                    </a>
                                                    <Link
                                                        className="btn btn-primary mx-1"
                                                        href={route(
                                                            'payrolls.edit',
                                                            payroll
                                                        )}
                                                    >
                                                        Edit
                                                    </Link>
                                                    <div
                                                        className="btn btn-secondary mx-1"
                                                        onClick={() =>
                                                            handleDelete(
                                                                payroll
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <Pagination links={links} params={params} />
                        </div>
                    </div>
                </div>
            </div>
            <ModalConfirm
                isOpen={confirmModal.isOpen}
                toggle={confirmModal.toggle}
                onConfirm={onDelete}
            />
        </Authenticated>
    )
}

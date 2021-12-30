import React, { useState } from 'react'
import { Head } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import { toast } from 'react-toastify'

import { useModalState } from '@/Hooks'
import Authenticated from '@/Layouts/Authenticated'
import Pagination from '@/Components/Pagination'
import ModalConfirm from '@/Components/ModalConfirm'
import FormPayrollModal from '@/Modals/FormPayrollModal'
import { formatIDR, formatDate } from '@/utils'

export default function Payrolls(props) {
    const { data: payrolls, links } = props.payrolls

    const [payroll, setPayroll] = useState(null)
    const formModal = useModalState(false)
    const toggle = (payroll = null) => {
        setPayroll(payroll)
        formModal.toggle()
    }

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
                    <div className="card bg-white w-full">
                        <div className="card-body">
                            <div className="flex w-full mb-4 justify-between">
                                <div
                                    className="btn btn-neutral"
                                    onClick={() => toggle()}
                                >
                                    Tambah
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table w-full table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Tanggal</th>
                                            <th>Nama Karyawan</th>
                                            <th>Gaji</th>
                                            <th>Potongan</th>
                                            <th>Bonus</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payrolls.map((payroll) => (
                                            <tr key={payroll.id}>
                                                <th>{formatDate(payroll.date)}</th>
                                                <td>{payroll.employee.name}</td>
                                                <td>
                                                    {formatIDR(payroll.amount)}
                                                </td>
                                                <td>
                                                    {formatIDR(payroll.cuts)}
                                                </td>
                                                <td>
                                                    {formatIDR(payroll.bonus)}
                                                </td>
                                                <td className="text-right">
                                                    <div
                                                        className="btn btn-primary mx-1"
                                                        onClick={() =>
                                                            toggle(payroll)
                                                        }
                                                    >
                                                        Edit
                                                    </div>
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
                            <Pagination links={links} />
                        </div>
                    </div>
                </div>
            </div>
            <FormPayrollModal
                isOpen={formModal.isOpen}
                toggle={toggle}
                payroll={payroll}
            />
            <ModalConfirm
                isOpen={confirmModal.isOpen}
                toggle={confirmModal.toggle}
                onConfirm={onDelete}
            />
        </Authenticated>
    )
}

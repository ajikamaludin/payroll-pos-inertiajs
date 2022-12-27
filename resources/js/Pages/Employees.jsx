import React, { useState, useEffect } from 'react'
import { Head } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import { usePrevious } from 'react-use'
import { toast } from 'react-toastify'

import { useModalState } from '@/Hooks'
import Authenticated from '@/Layouts/Authenticated'
import Pagination from '@/Components/Pagination'
import ModalConfirm from '@/Components/ModalConfirm'
import FormEmployeeModal from '@/Modals/FormEmployeeModal'

export default function Employees(props) {
    const { data: employees, links } = props.employees

    const [search, setSearch] = useState('')
    const preValue = usePrevious(search)

    const [employee, setEmployee] = useState(null)
    const formModal = useModalState(false)
    const toggle = (employee = null) => {
        setEmployee(employee)
        formModal.toggle()
    }

    const confirmModal = useModalState(false)
    const handleDelete = (employee) => {
        confirmModal.setData(employee)
        confirmModal.toggle()
    }

    const onDelete = () => {
        const employee = confirmModal.data
        if (employee != null) {
            Inertia.delete(route('employees.destroy', employee), {
                onSuccess: () => toast.success('The Data has been deleted'),
            })
        }
    }

    useEffect(() => {
        if (preValue) {
            Inertia.get(
                route(route().current()),
                { q: search },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [search])

    return (
        <Authenticated
            auth={props.auth}
            errors={props.errors}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Keryawan
                </h2>
            }
        >
            <Head title="Employees" />
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
                                <div className="form-control">
                                    <input
                                        type="text"
                                        className="input input-bordered"
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                        placeholder="Search"
                                    />
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="table w-full table-zebra">
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Nama</th>
                                            <th>Whatsapp</th>
                                            <th>Foto</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {employees?.map((employee) => (
                                            <tr key={employee.id}>
                                                <th>{employee.id}</th>
                                                <td>{employee.name}</td>
                                                <td>{employee.whatsapp}</td>
                                                <td>
                                                    {employee.photo_url !==
                                                        null && (
                                                        <img
                                                            width="100px"
                                                            src={
                                                                employee.photo_url
                                                            }
                                                        />
                                                    )}
                                                </td>
                                                <td className="text-right">
                                                    <div
                                                        className="btn btn-primary mx-1"
                                                        onClick={() =>
                                                            toggle(employee)
                                                        }
                                                    >
                                                        Edit
                                                    </div>
                                                    <div
                                                        className="btn btn-secondary mx-1"
                                                        onClick={() =>
                                                            handleDelete(
                                                                employee
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
                            <Pagination links={links} params={{ q: search }} />
                        </div>
                    </div>
                </div>
            </div>
            <FormEmployeeModal
                isOpen={formModal.isOpen}
                toggle={toggle}
                employee={employee}
            />
            <ModalConfirm
                isOpen={confirmModal.isOpen}
                toggle={confirmModal.toggle}
                onConfirm={onDelete}
            />
        </Authenticated>
    )
}

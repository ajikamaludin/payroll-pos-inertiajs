import React, { useState, useEffect } from 'react'
import { Head } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import { usePrevious } from 'react-use'
import { toast } from 'react-toastify'

import { useModalState } from '@/Hooks'
import { formatIDR } from '@/utils'
import Authenticated from '@/Layouts/Authenticated'
import Pagination from '@/Components/Pagination'
import ModalConfirm from '@/Components/ModalConfirm'
import FormProductModal from '@/Modals/FormProductModal'

export default function Products(props) {
    const { data: products, links } = props.products

    const [search, setSearch] = useState(props._search)
    const preValue = usePrevious(search)

    const [product, setProduct] = useState(null)
    const formModal = useModalState(false)
    const toggle = (product = null) => {
        setProduct(product)
        formModal.toggle()
    }

    const confirmModal = useModalState(false)
    const handleDelete = (product) => {
        confirmModal.setData(product)
        confirmModal.toggle()
    }

    const onDelete = () => {
        const product = confirmModal.data
        if (product != null) {
            Inertia.delete(route('products.destroy', product), {
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
                    Barang
                </h2>
            }
        >
            <Head title="Products" />
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
                                            <th>Nama</th>
                                            <th>Harga</th>
                                            <th>Deskripsi</th>
                                            <th>Foto</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products?.map((product) => (
                                            <tr key={product.id}>
                                                <td>{product.name}</td>
                                                <td>
                                                    {formatIDR(product.price)}
                                                </td>
                                                <td>{product.description}</td>
                                                <td>
                                                    {product.photo_url !==
                                                        null && (
                                                        <img
                                                            width="100px"
                                                            src={
                                                                product.photo_url
                                                            }
                                                        />
                                                    )}
                                                </td>
                                                <td className="text-right">
                                                    <div
                                                        className="btn btn-primary mx-1"
                                                        onClick={() =>
                                                            toggle(product)
                                                        }
                                                    >
                                                        Edit
                                                    </div>
                                                    <div
                                                        className="btn btn-secondary mx-1"
                                                        onClick={() =>
                                                            handleDelete(
                                                                product
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
            <FormProductModal
                isOpen={formModal.isOpen}
                toggle={toggle}
                product={product}
            />
            <ModalConfirm
                isOpen={confirmModal.isOpen}
                toggle={confirmModal.toggle}
                onConfirm={onDelete}
            />
        </Authenticated>
    )
}

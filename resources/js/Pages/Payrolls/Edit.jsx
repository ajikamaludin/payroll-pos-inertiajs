import React, { useState, useEffect, useRef } from 'react'
import DatePicker from 'react-datepicker'
import NumberFormat from 'react-number-format'
import ReactToPrint from 'react-to-print'
import { Inertia } from '@inertiajs/inertia'
import { usePrevious } from 'react-use'
import { toast } from 'react-toastify'
import { Head, useForm } from '@inertiajs/inertia-react'

import Authenticated from '@/Layouts/Authenticated'
import Pagination from '@/Components/Pagination'
import CloseIcon from '@/Components/CloseIcon'
import EmployeeSelectInput from '@/Selects/EmployeeSelectInput'
import { formatIDR } from '@/utils'
import Print from '@/Pages/Payrolls/Print'

export default function Edit(props) {
    const { data: products, links } = props.products
    const { payroll, _search, _page } = props
    const { data, setData, put, errors, processing } = useForm({
        date: new Date(payroll.date),
        employee_id: payroll.employee_id,
        employee_name: `${payroll.employee.name} - ${payroll.employee.whatsapp}`,
        employee: payroll.employee,
        cuts: payroll.cuts,
        bonus: payroll.bonus,
        items: payroll.items.map((item) => {
            return {
                product_id: item.product_id,
                quantity: item.quantity,
                ...item.product,
            }
        }),
    })

    const [loading, setLoading] = useState(false)

    const [search, setSearch] = useState(_search)
    const preValue = usePrevious(search)

  const componentToPrint = useRef()

    const handleSelectedEmployee = (employee) => {
        setData({
            ...data,
            employee_id: employee.id,
            employee_name: `${employee.name} - ${employee.whatsapp}`,
            employee: employee
        })
    }

    const addItem = (product) => {
        const itemExist = data.items.find((item) => item.id === product.id)
        if (itemExist) {
            setData(
                'items',
                data.items.map((item) => {
                    if (item.id === product.id) {
                        return {
                            ...item,
                            quantity: +item.quantity + 1,
                        }
                    } else {
                        return item
                    }
                })
            )
            return
        }
        setData(
            'items',
            data.items.concat({
                ...product,
                product_id: product.id,
                quantity: 1,
            })
        )
    }

    const setQuantity = (product, value) => {
        setData(
            'items',
            data.items.map((item) => {
                if (item.id === product.id) {
                    return {
                        ...item,
                        quantity: +value,
                    }
                } else {
                    return item
                }
            })
        )
    }

    const remoteItem = (product) => {
        setData(
            'items',
            data.items.filter((item) => item.id !== product.id)
        )
    }

    const handleReset = () => {
        setData({
            employee_id: null,
            employee_name: '',
            cuts: 0,
            bonus: 0,
            items: [],
        })
    }

    const handleSubmit = () => {
        if (data.items.length <= 0) {
            alert('barang belum di pilih')
            return
        }
        put(route('payrolls.update', payroll), {
            onSuccess: () =>
                Promise.all([
                    handleReset(),
                    toast.success('The Data has been saved'),
                ]),
        })
    }

    const itemAmount = data.items.reduce(
        (amt, item) => amt + +item.quantity * +item.price,
        0
    )
    const totalAmount = itemAmount - +data.cuts + +data.bonus

    useEffect(() => {
        if (preValue) {
            setLoading(true)
            Inertia.get(
                route(route().current(), payroll),
                { q: search, page: _page },
                {
                    replace: true,
                    preserveState: true,
                    onSuccess: () => {
                        setLoading(false)
                    },
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
                    Gaji
                </h2>
            }
        >
            <Head title="Payrolls" />
            <div className="py-12">
                <div className="flex flex-col md:flex-row w-full sm:px-6 lg:px-8 space-y-4 md:space-x-4 md:space-y-0">
                    <div className="card bg-white w-full md:w-7/12">
                        <div className="p-4">
                            <div className="flex flex-row justify-end mb-2">
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
                            <div
                                className={`grid grid-cols-4 gap-4 ${
                                    loading && 'opacity-70'
                                }`}
                            >
                                {products.map((product) => (
                                    <div
                                        className="rounded bg-white shadow-md"
                                        key={product.id}
                                        onClick={() => addItem(product)}
                                    >
                                        <img
                                            src={product.photo_url}
                                            style={{
                                                height: '100px',
                                                objectFit: 'cover',
                                                width: '100%',
                                            }}
                                        />
                                        <div className="p-4 flex flex-col justify-items-center items-center space-y-4">
                                            <div className="font-bold text-center">
                                                {product.name}
                                            </div>
                                            <div className="badge">
                                                {formatIDR(product.price)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col items-center">
                                <div>
                                    <Pagination
                                        links={links}
                                        params={{ q: search }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card bg-white w-full md:w-5/12">
                        <div className="flex flex-col p-2 mb-4">
                            <div>
                                <DatePicker
                                    selected={data.date}
                                    onChange={(date) => setData('date', date)}
                                    format="dd/mm/yyyy"
                                    className={`input input-bordered ${
                                        errors.date ? 'input-error' : ''
                                    }`}
                                    nextMonthButtonLabel=">"
                                    previousMonthButtonLabel="<"
                                />
                                {errors.date && (
                                    <label className="label">
                                        <span className="label-text-alt">
                                            {errors.date}
                                        </span>
                                    </label>
                                )}
                            </div>
                            <div className="w-full">
                                <EmployeeSelectInput
                                    value={data.employee_name}
                                    onItemSelected={handleSelectedEmployee}
                                    invalid={errors.employee_id ? true : false}
                                />
                                <label className="label">
                                    <span className="label-text-alt">
                                        {errors.employee_id}
                                    </span>
                                </label>
                            </div>
                            <div
                                className="overflow-x-auto"
                                style={{ minHeight: '280px' }}
                            >
                                <table className="table w-full">
                                    <thead>
                                        <tr>
                                            <th>Barang</th>
                                            <th>Qty</th>
                                            <th>Subtotal</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {data.items.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.name}</td>
                                                <td className="p-0">
                                                    <NumberFormat
                                                        thousandSeparator={true}
                                                        className="input input-bordered w-14 py-0 px-3 text-right"
                                                        value={formatIDR(
                                                            item.quantity
                                                        )}
                                                        thousandSeparator="."
                                                        decimalSeparator=","
                                                        onValueChange={({
                                                            value,
                                                        }) =>
                                                            setQuantity(
                                                                item,
                                                                value
                                                            )
                                                        }
                                                        placeholder="qty"
                                                    />
                                                </td>
                                                <td>
                                                    {formatIDR(
                                                        item.quantity *
                                                            item.price
                                                    )}
                                                </td>
                                                <td>
                                                    <CloseIcon
                                                        className="btn btn-outline btn-sm px-0.5"
                                                        onClick={() =>
                                                            remoteItem(item)
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="card-actions">
                                <div className="form-control w-full">
                                    <label className="input-group w-full">
                                        <span>Potongan</span>
                                        <NumberFormat
                                            thousandSeparator={true}
                                            className={`input input-bordered w-full text-right ${
                                                errors.cuts ? 'input-error' : ''
                                            }`}
                                            value={formatIDR(data.cuts)}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            onValueChange={({ value }) =>
                                                setData('cuts', value)
                                            }
                                            placeholder="potongan"
                                        />
                                    </label>
                                    {errors.cuts && (
                                        <label className="label">
                                            <span className="label-text-alt">
                                                {errors.cuts}
                                            </span>
                                        </label>
                                    )}
                                </div>
                                <div className="form-control w-full">
                                    <label className="input-group w-full">
                                        <span>Bonus</span>
                                        <NumberFormat
                                            thousandSeparator={true}
                                            className={`input input-bordered w-full text-right ${
                                                errors.bonus
                                                    ? 'input-error'
                                                    : ''
                                            }`}
                                            value={formatIDR(data.bonus)}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            onValueChange={({ value }) =>
                                                setData('bonus', value)
                                            }
                                            placeholder="bonus"
                                        />
                                    </label>
                                    {errors.bonus && (
                                        <label className="label">
                                            <span className="label-text-alt">
                                                {errors.bonus}
                                            </span>
                                        </label>
                                    )}
                                </div>
                                <div className="form-control w-full mt-2">
                                    <label className="input-group w-full">
                                        <span>Total</span>
                                        <NumberFormat
                                            thousandSeparator={true}
                                            className="input input-bordered w-full text-right"
                                            value={totalAmount}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            readOnly={true}
                                            placeholder="total"
                                        />
                                    </label>
                                </div>
                                <div className="grid grid-cols-2 gap-2 w-full">
                                    <div
                                        className="btn btn-primary"
                                        disabled={processing}
                                        onClick={handleSubmit}
                                    >
                                        Simpan
                                    </div>
                                    <ReactToPrint
                                        trigger={() => (
                                            <div
                                                className="btn btn-primary"
                                                disabled={processing}
                                            >
                                                Cetak
                                            </div>
                                        )}
                                        content={() => componentToPrint.current}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="hidden">
                    <Print
                        user={props.auth.user}
                        date={data.date}
                        employee={data.employee}
                        items={data.items}
                        amount={itemAmount}
                        cuts={data.cuts}
                        bonus={data.bonus}
                        total={totalAmount}
                        ref={componentToPrint}
                    />
                </div>
            </div>
        </Authenticated>
    )
}

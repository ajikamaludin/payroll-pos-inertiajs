import React, { useEffect } from 'react'
import NumberFormat from 'react-number-format'
import DatePicker from 'react-datepicker'
import { useForm } from '@inertiajs/inertia-react'
import { toast } from 'react-toastify'
import EmployeeSelectInput from '@/Selects/EmployeeSelectInput'
import { formatIDR } from '@/utils'

export default function FormPayrollModal(props) {
    const { isOpen, toggle = () => {}, payroll = null } = props

    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            employee_id: null,
            employee_name: '',
            date: new Date(),
            amount: 0,
            cuts: 0,
            bonus: 0,
            item_count: 0,
        })

    const recived = +data.amount + +data.bonus - +data.cuts

    const handleSelectedEmployee = (employee) => {
        setData({
            ...data,
            employee_id: employee.id,
            employee_name: employee.name,
            amount: employee.basic_salary
        })
    }

    const handleReset = () => {
        setData({
            employee_id: null,
            employee_name: '',
            date: new Date(),
            amount: 0,
            cuts: 0,
            bonus: 0,
            item_count: 0,
        })
        clearErrors()
    }

    const handleCancel = () => {
        handleReset()
        toggle()
    }

    const handleSubmit = () => {
        if (payroll !== null) {
            put(route('payrolls.update', payroll), {
                onSuccess: () =>
                    Promise.all([
                        handleReset(),
                        toggle(),
                        toast.success('The Data has been changed'),
                    ]),
            })
            return
        }
        post(route('payrolls.store'), {
            onSuccess: () =>
                Promise.all([
                    handleReset(),
                    toggle(),
                    toast.success('The Data has been saved'),
                ]),
        })
    }

    useEffect(() => {
        setData({
            employee_id: payroll?.employee?.id,
            employee_name: payroll?.employee?.name,
            date: payroll?.date ? new Date(payroll.date) : new Date(),
            amount: payroll?.amount ? payroll.amount : 0,
            cuts: payroll?.cuts ? payroll.cuts : 0,
            bonus: payroll?.bonus ? payroll.bonus : 0,
            item_count: payroll?.item_count ? (payroll.item_count) : 0,
        })
    }, [payroll])

    return (
        <div
            className="modal"
            style={
                isOpen
                    ? {
                          opacity: 1,
                          pointerEvents: 'auto',
                          visibility: 'visible',
                          overflowY: 'initial',
                      }
                    : {}
            }
        >
            <div className="modal-box overflow-y-auto max-h-screen">
                <h1 className="font-bold text-2xl pb-8">Gaji</h1>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Tanggal</span>
                    </label>
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
                    <label className="label">
                        <span className="label-text-alt">{errors.date}</span>
                    </label>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Keryawan</span>
                    </label>
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
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Gaji Pokok</span>
                    </label>
                    <NumberFormat
                        className={`input input-bordered ${
                            errors.amount ? 'input-error' : ''
                        }`}
                        value={formatIDR(data.amount)}
                        thousandSeparator="."
                        decimalSeparator=","
                        onValueChange={({ value }) => setData('amount', value)}
                        placeholder="gaji pokok"
                    />
                    <label className="label">
                        <span className="label-text-alt">{errors.amount}</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Potongan</span>
                    </label>
                    <NumberFormat
                        className={`input input-bordered ${
                            errors.cuts ? 'input-error' : ''
                        }`}
                        value={formatIDR(data.cuts)}
                        thousandSeparator="."
                        decimalSeparator=","
                        onValueChange={({ value }) => setData('cuts', value)}
                        placeholder="potongan"
                    />
                    <label className="label">
                        <span className="label-text-alt">{errors.cuts}</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Bonus</span>
                    </label>
                    <NumberFormat
                        className={`input input-bordered ${
                            errors.bonus ? 'input-error' : ''
                        }`}
                        value={formatIDR(data.bonus)}
                        thousandSeparator="."
                        decimalSeparator=","
                        onValueChange={({ value }) => setData('bonus', value)}
                        placeholder="bonus"
                    />
                    <label className="label">
                        <span className="label-text-alt">{errors.bonus}</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Total</span>
                    </label>
                    <input
                        value={formatIDR(recived)}
                        className="input input-bordered"
                        readOnly={true}
                    />
                    <label className="label">
                        <span className="label-text-alt">{errors.recived}</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Jumlah Item</span>
                    </label>
                    <NumberFormat
                        className={`input input-bordered ${
                            errors.item_count ? 'input-error' : ''
                        }`}
                        value={data.item_count}
                        thousandSeparator="."
                        decimalSeparator=","
                        onValueChange={({ value }) =>
                            setData('item_count', value)
                        }
                        placeholder="jumlah item"
                    />
                    <label className="label">
                        <span className="label-text-alt">
                            {errors.item_count}
                        </span>
                    </label>
                </div>
                <div className="modal-action">
                    <div
                        onClick={handleSubmit}
                        className="btn btn-primary"
                        disabled={processing}
                    >
                        Simpan
                    </div>
                    <div
                        onClick={handleCancel}
                        className="btn btn-secondary"
                        disabled={processing}
                    >
                        Batal
                    </div>
                </div>
            </div>
        </div>
    )
}

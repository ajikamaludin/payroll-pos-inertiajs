import React, { useEffect, useRef } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import { toast } from 'react-toastify'
import { formatIDR } from '@/utils'

export default function FormEmployeeModal(props) {
    const { isOpen, toggle = () => {}, employee = null } = props

    const { data, setData, post, processing, errors, clearErrors } =
        useForm({
            name: '',
            whatsapp: '',
            basic_salary: 0,
            photo: null,
            img_alt: null,
        })

    const inputPhoto = useRef()

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.value)
    }

    const handleReset = () => {
        setData({
            name: '',
            whatsapp: '',
            basic_salary: 0,
            photo: null,
            img_alt: null,
        })
        clearErrors()
    }

    const handleCancel = () => {
        handleReset()
        toggle()
    }

    const handleSubmit = () => {
        if (employee !== null) {
            post(route('employees.update', employee), {
                forceFormData: true,
                onSuccess: () =>
                    Promise.all([
                        handleReset(),
                        toggle(),
                        toast.success('The Data has been changed'),
                    ]),
            })
            return
        }
        post(route('employees.store'), {
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
            name: employee?.name ? employee.name : '',
            whatsapp: employee?.whatsapp ? employee.whatsapp : '',
            basic_salary: employee?.basic_salary ? formatIDR(employee.basic_salary) : 0,
            img_alt: employee?.photo_url ? employee.photo_url : null,
        })
    }, [employee])

    return (
        <div
            className="modal"
            style={
                isOpen
                    ? {
                          opacity: 1,
                          pointerEvents: 'auto',
                          visibility: 'visible',
                      }
                    : {}
            }
        >
            <div className="modal-box">
                <h1 className="font-bold text-2xl pb-8">Karyawan</h1>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Nama</span>
                    </label>
                    <input
                        type="text"
                        placeholder="nama"
                        className={`input input-bordered ${
                            errors.name && 'input-error'
                        }`}
                        name="name"
                        value={data.name}
                        onChange={handleOnChange}
                    />
                    <label className="label">
                        <span className="label-text-alt">{errors.name}</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Whatsapp</span>
                    </label>
                    <input
                        type="text"
                        placeholder="whatsapp"
                        className={`input input-bordered ${
                            errors.whatsapp && 'input-error'
                        }`}
                        name="whatsapp"
                        value={data.whatsapp}
                        onChange={handleOnChange}
                    />
                    <label className="label">
                        <span className="label-text-alt">
                            {errors.whatsapp}
                        </span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Foto</span>
                    </label>
                    <div
                        className={`input input-bordered ${
                            errors.photo && 'input-error'
                        }`}
                        onClick={() => {
                            console.log(inputPhoto.current.click())
                        }}
                    >
                        {data.photo ? data.photo.name : ''}
                    </div>
                    <input
                        ref={inputPhoto}
                        type="file"
                        className="hidden"
                        name="photo"
                        onChange={(e) => setData('photo', e.target.files[0])}
                        accept="image/png, image/jpeg, image/jpg"
                    />
                    <label className="label">
                        <span className="label-text-alt">{errors.photo}</span>
                    </label>
                </div>
                <div className="form-control">
                    {data.img_alt !== null && <img src={data.img_alt} />}
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

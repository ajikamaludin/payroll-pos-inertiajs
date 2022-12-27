import React, { useEffect } from 'react'
import { useForm } from '@inertiajs/inertia-react'
import { toast } from 'react-toastify'

export default function FormUserModal(props) {
    const { isOpen, toggle = () => {} , user = null } = props

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        email: '',
        password: '',
    })

    const handleOnChange = (event) => {
        setData(event.target.name, event.target.value)
    }

    const handleReset = () => {
        reset()
        clearErrors()
    }

    const handleCancel = () => {
        handleReset()
        toggle()
    }

    const handleSubmit = () => {
        if(user !== null) {
            put(route('users.update', user), {
                onSuccess: () =>
                    Promise.all([
                        handleReset(),
                        toggle(),
                        toast.success('The Data has been changed'),
                    ]),
            })
            return
        }
        post(route('users.store'), {
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
            name: user?.name,
            email: user?.email,
        })
    }, [user])

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
                <h1 className="font-bold text-2xl pb-8">User</h1>
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
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        type="text"
                        placeholder="email"
                        className={`input input-bordered ${
                            errors.email && 'input-error'
                        }`}
                        name="email"
                        value={data.email}
                        onChange={handleOnChange}
                    />
                    <label className="label">
                        <span className="label-text-alt">{errors.email}</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input
                        type="password"
                        placeholder="password"
                        className={`input input-bordered ${
                            errors.password && 'input-error'
                        }`}
                        name="password"
                        value={data.password}
                        onChange={handleOnChange}
                    />
                    <label className="label">
                        <span className="label-text-alt">
                            {errors.password}
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

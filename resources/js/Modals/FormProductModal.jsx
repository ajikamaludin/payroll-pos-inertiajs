import React, { useEffect, useRef } from 'react'
import NumberFormat from 'react-number-format'
import { useForm } from '@inertiajs/inertia-react'
import { toast } from 'react-toastify'
import { formatIDR } from '@/utils'

export default function FormProductModal(props) {
    const { isOpen, toggle = () => {}, product = null } = props

    const { data, setData, post, processing, errors, clearErrors } =
        useForm({
            name: '',
            price: 0,
            description: '',
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
            price: 0,
            description: '',
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
        if (product !== null) {
            post(route('products.update', product), {
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
        post(route('products.store'), {
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
            name: product?.name ? product.name : '',
            price: formatIDR(product?.price ? product.price : 0),
            description: product?.description ? product.description : '',
            img_alt: product?.photo_url ? product.photo_url : null,
        })
    }, [product])

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
                <h1 className="font-bold text-2xl pb-8">Barang</h1>
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
                        <span className="label-text">Harga</span>
                    </label>
                    <NumberFormat
                        thousandSeparator={true}
                        className={`input input-bordered ${
                            errors.price ? 'input-error' : ''
                        }`}
                        value={data.price}
                        thousandSeparator="."
                        decimalSeparator=","
                        onValueChange={({ value }) => setData('price', value)}
                        placeholder="harga"
                    />
                    <label className="label">
                        <span className="label-text-alt">{errors.price}</span>
                    </label>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Deskripsi</span>
                    </label>
                    <textarea
                        className={`textarea h-24 textarea-bordered ${
                            errors.description && 'input-error'
                        }`}
                        name="description"
                        placeholder="Deskripsi"
                        value={data.description}
                        onChange={handleOnChange}
                    />
                    <label className="label">
                        <span className="label-text-alt">
                            {errors.description}
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

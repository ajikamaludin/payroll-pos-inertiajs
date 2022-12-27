import React, { useEffect } from 'react';
import Button from '@/Components/Button';
import Guest from '@/Layouts/Guest';
import { Head, useForm } from '@inertiajs/inertia-react';

export default function Login({ status }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const onHandleChange = (event) => {
        setData(event.target.name, event.target.value);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <Guest>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        type="text"
                        name="email"
                        className={`input input-bordered ${
                            errors.email && 'input-error'
                        }`}
                        value={data.email}
                        autoComplete="username"
                        autoFocus={true}
                        onChange={onHandleChange}
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
                        name="password"
                        className={`input input-bordered ${
                            errors.password && 'input-error'
                        }`}
                        value={data.password}
                        autoComplete="current-password"
                        onChange={onHandleChange}
                    />
                    <label className="label">
                        <span className="label-text-alt">
                            {errors.password}
                        </span>
                    </label>
                </div>

                <div className="flex items-center justify-end mt-4">
                    <Button className="ml-4" processing={processing}>
                        Log in
                    </Button>
                </div>
            </form>
        </Guest>
    )
}

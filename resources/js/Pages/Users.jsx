import React, { useState, useEffect } from 'react'
import { Head } from '@inertiajs/inertia-react'
import { Inertia } from '@inertiajs/inertia'
import { usePrevious } from 'react-use'
import { toast } from 'react-toastify'

import { useModalState } from '@/Hooks'
import Authenticated from '@/Layouts/Authenticated'
import Pagination from '@/Components/Pagination'
import ModalConfirm from '@/Components/ModalConfirm'
import FormUserModal from '@/Modals/FormUserModal'

export default function Users(props) {
  const { data: users, links } = props.users

  const [search, setSearch] = useState('')
  const preValue = usePrevious(search)

  const [user, setUser] = useState(null)
  const formModal = useModalState(false)
  const toggle = (user = null) => {
    setUser(user)
    formModal.toggle()
  }

  const confirmModal = useModalState(false)
  const handleDelete = (user) => {
    confirmModal.setData(user)
    confirmModal.toggle()
  }

  const onDelete = () => {
    const user = confirmModal.data
    if(user != null) {
      Inertia.delete(route('users.destroy', user), {
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
                  Users
              </h2>
          }
      >
          <Head title="Users" />
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
                                          <th>Email</th>
                                          <th></th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      {users?.map((user) => (
                                          <tr key={user.id}>
                                              <th>{user.id}</th>
                                              <td>{user.name}</td>
                                              <td>{user.email}</td>
                                              <td className="text-right">
                                                  <div
                                                      className="btn btn-primary mx-1"
                                                      onClick={() =>
                                                          toggle(user)
                                                      }
                                                  >
                                                      Edit
                                                  </div>
                                                  {props.auth.user.id !==
                                                      user.id && (
                                                      <div
                                                          className="btn btn-secondary mx-1"
                                                          onClick={() =>
                                                              handleDelete(user)
                                                          }
                                                      >
                                                          Delete
                                                      </div>
                                                  )}
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
          <FormUserModal
              isOpen={formModal.isOpen}
              toggle={toggle}
              user={user}
          />
          <ModalConfirm
              isOpen={confirmModal.isOpen}
              toggle={confirmModal.toggle}
              onConfirm={onDelete}
          />
      </Authenticated>
  )
}
import React from 'react'
import { formatDate, formatIDR } from '@/utils'

const Td = ({ children, colSpan, className }) => {
  return (
      <td className={`border p-2 ${className}`} colSpan={colSpan}>
          {children}
      </td>
  )
}

const Print = React.forwardRef((props, ref) => {
    const {user, date, employee, items, amount, cuts, bonus, total} = props
    return (
        <>
            <div ref={ref} className="p-4">
                <table className="border-collapse border border-gray-400 w-full">
                    <thead>
                        <tr className="text-center border">
                            <th colSpan={4}>
                                <div className="flex text-md justify-center items-center font-bold text-4xl py-4">
                                    GAJIAN KONVEKSI
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="border">
                            <Td>Nama Tukang</Td>
                            <Td>{employee?.name}</Td>
                            <Td>Nomer Telpon</Td>
                            <Td>{employee?.whatsapp}</Td>
                        </tr>
                        <tr className="border">
                            <Td>Tanggal Pembuatan</Td>
                            <Td>{formatDate(date)}</Td>
                            <Td>Dibuat Oleh</Td>
                            <Td>{user?.name}</Td>
                        </tr>
                        <tr className="border text-center">
                            <th colSpan={4}>
                                <div className="flex text-md justify-center items-center font-bold text-3xl py-4">
                                    Detail Gajian
                                </div>
                            </th>
                        </tr>
                        <tr className="border">
                            <Td className="max-w-sm">#</Td>
                            <Td>Nama Barang</Td>
                            <Td>Harga</Td>
                            <Td>Jumlah</Td>
                        </tr>
                        {items?.map((item, index) => (
                            <tr className="border" key={index}>
                                <Td className="max-w-sm">{index + 1}</Td>
                                <Td>{item?.name}</Td>
                                <Td>{formatIDR(item?.price)}</Td>
                                <Td>{formatIDR(item?.quantity)}</Td>
                            </tr>
                        ))}
                        <tr className="border">
                            <Td colSpan={3} className="text-right">
                                Total
                            </Td>
                            <Td>{formatIDR(amount)}</Td>
                        </tr>
                        <tr className="border">
                            <Td colSpan={3} className="text-right">
                                Potongan/Pinjaman
                            </Td>
                            <Td>{formatIDR(cuts)}</Td>
                        </tr>
                        <tr className="border">
                            <Td colSpan={3} className="text-right">
                                Bonus
                            </Td>
                            <Td>{formatIDR(bonus)}</Td>
                        </tr>
                        <tr className="border">
                            <Td colSpan={3} className="text-right">
                                Total Diterima
                            </Td>
                            <Td className="font-bold">{formatIDR(total)}</Td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    )
})

export default Print

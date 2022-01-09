<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        body {
            font-family: Nunito, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        }
        .border-collapse {
            border-collapse: collapse;
        }
        .border-gray-400 {
            border-color: black;
        }

        .border {
            border-width: 1px;
            border-top-width: 1px;
            border-right-width: 1px;
            border-bottom-width: 1px;
            border-left-width: 1px;
        }
        .w-full {
            width: 100%;
        }
        .text-center {
            text-align: center;
        }
        .font-bold {
            font-weight: 700;
        }
        .text-4xl {
            font-size: 2.25rem;
            line-height: 2.5rem;
        }
        .text-3xl {
            font-size: 1.875rem;
            line-height: 2.25rem;
        }
        .py-4 {
            padding-top: 1rem;
            padding-bottom: 1rem;
        }
        .justify-center {
            justify-content: center;
        }

        .items-center {
            align-items: center;
        }
        .flex {
            display: flex;
        }
        .p-2 {
            padding: 0.5rem;
        }
        .max-w-sm {
            max-width: 24rem;
        }
        .text-right {
            text-align: right;
        }

    </style>
</head>
@php
function formatIDR($output) {
    return number_format($output, 0, ',', '.');
}
@endphp
<body>
    <table class="border-collapse border border-gray-400 w-full" border="1">
        <thead>
            <tr class="text-center border">
                <th colspan="5">
                    <div class="flex text-md justify-center items-center font-bold text-4xl py-4">
                        GAJIAN KONVEKSI
                    </div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr class="border">
                <td class="border p-2">
                    Nama Tukang
                </td>
                <td class="border p-2">
                    {{ $payroll->employee->name }}
                </td>
                <td class="border p-2">
                    Nomer Telpon
                </td>
                <td class="border p-2" colspan="2">
                    {{ $payroll->employee->whatsapp }}
                </td>
            </tr>
            <tr class="border">
                <td class="border p-2">
                    Tanggal Pembuatan
                </td>
                <td class="border p-2">
                    {{ $payroll->date }}
                </td>
                <td class="border p-2">
                    Dibuat Oleh
                </td>
                <td class="border p-2" colspan="2">
                    {{ $user->name }}
                </td>
            </tr>
            <tr class="border text-center">
                <th colspan="5">
                    <div class="flex text-md justify-center items-center font-bold text-3xl py-4">
                        Detail Gajian
                    </div>
                </th>
            </tr>
            <tr class="border">
                <td class="border p-2 max-w-sm">
                    #
                </td>
                <td class="border p-2">
                    Nama Barang
                </td>
                <td class="border p-2">
                    Harga
                </td>
                <td class="border p-2">
                    Jumlah
                </td>
                <td class="border p-2">
                    Subtotal
                </td>
            </tr>
            @foreach($payroll->items as $item)
            <tr class="border">
                <td class="border p-2 max-w-sm">
                    {{ $loop->iteration }}
                </td>
                <td class="border p-2">
                    {{ $item->product->name }}
                </td>
                <td class="border p-2">
                    {{ formatIDR($item->price) }}
                </td>
                <td class="border p-2">
                    {{ formatIDR($item->quantity) }}
                </td>
                <td class="border p-2">
                    {{ formatIDR($item->price * $item->quantity) }}
                </td>
            </tr>
            @endforeach
            <tr class="border">
                <td class="border p-2 text-right" colspan="4">
                    Total
                </td>
                <td class="border p-2">
                    {{ formatIDR($payroll->amount) }}
                </td>
            </tr>
            <tr class="border">
                <td class="border p-2 text-right" colspan="4">
                    Potongan/Pinjaman
                </td>
                <td class="border p-2">
                    {{ formatIDR($payroll->cuts) }}
                </td>
            </tr>
            <tr class="border">
                <td class="border p-2 text-right" colspan="4">
                    Bonus
                </td>
                <td class="border p-2">
                    {{ formatIDR($payroll->bonus) }}
                </td>
            </tr>
            <tr class="border">
                <td class="border p-2 text-right" colspan="4">
                    Total Diterima
                </td>
                <td class="border p-2 font-bold">
                    {{ formatIDR($payroll->recived) }}
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
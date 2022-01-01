<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>
<body>
    <table style="text-align: center;">
        <thead>
            <tr>
                <th>
                    Laporan
                </th>
                <th>
                    {{$startDate}}
                </th>
                <th>
                    {{$endDate}}
                </th>
            </tr>
        </thead>
        <thead>
            <tr>
                <th colSpan="5" style="padding: 3em;"></th>
            </tr>
            <tr style="font-weight: bold;">
                <th>
                    Nama karyawan
                </th>
                <th>
                    Kontak
                </th>
                <th>
                    Jumlah Item
                </th>
                <th>
                    Total Gajian
                </th>
                <th>
                    Tanggal
                </th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $item)
            <tr>
                <td style="width: 200px">{{$item->employee->name}}</td>
                <td style="width: 100px">{{$item->employee->whatsapp}}</td>
                <td style="width: 100px">{{$item->item_count}}</td>
                <td style="width: 100px">{{$item->recived}}</td>
                <td style="width: 100px">{{$item->date}}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
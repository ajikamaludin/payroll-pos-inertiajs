<?php

namespace App\Exports;

use App\Models\Payroll;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\Exportable;

class PayrollExport implements FromCollection
{
    use Exportable;

    private $startDate;
    private $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    /**
    * @return \Illuminate\Support\Collection
    */
    public function collection()
    {
        $data = [];
        $data[] = ['Laporan', $this->startDate, $this->endDate];
        $data[] = [''];
        $data[] = ['tanggal', 'nama karyawan', 'kontak', 'total gaji', 'jumlah item'];
        $items = Payroll::with('employee')->whereBetween('date', [$this->startDate, $this->endDate])->get();
        foreach ($items as $item) {
            $data[] = [
                $item->date,
                $item->employee->name,
                $item->employee->whatsapp,
                $item->recived,
                $item->item_count,
            ];
        }

        return collect($data);
    }
}

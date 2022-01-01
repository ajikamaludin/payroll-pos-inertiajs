<?php

namespace App\Exports;

use App\Models\Payroll;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\Exportable;

class PayrollExportFromView implements FromView
{
    use Exportable;

    private $startDate;
    private $endDate;

    public function __construct($startDate, $endDate)
    {
        $this->startDate = $startDate;
        $this->endDate = $endDate;
    }

    public function view(): View
    {
        $items = Payroll::with('employee')->whereBetween('date', [$this->startDate, $this->endDate])->get();

        return view('report', [
            'data' => $items,
            'startDate' => $this->startDate,
            'endDate' => $this->endDate
        ]);
    }
}

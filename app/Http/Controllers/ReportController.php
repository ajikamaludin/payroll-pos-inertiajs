<?php

namespace App\Http\Controllers;

use App\Exports\PayrollExport;
use App\Exports\PayrollExportFromView;
use App\Models\Payroll;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function index(Request $request)
    {
        $query = Payroll::with('employee');

        $startDate = now()->startOfMonth()->toDateString();
        $endDate = now()->endOfMonth()->toDateString();

        if ($request->startDate != null && $request->endDate != null) {
            $query->whereBetween('date', [$request->startDate, $request->endDate]);
            $startDate = $request->startDate;
            $endDate = $request->endDate;
        } else {
            $query->whereBetween('date', [$startDate, $endDate]);
        }

        return inertia('Report', [
            'payrolls' => $query->orderBy('date', 'desc')->paginate(10),
            '_startDate' => $startDate,
            '_endDate' => $endDate
        ]);
    }

    public function export(Request $request)
    {
        return (new PayrollExport($request->startDate, $request->endDate))->download('reports.xlsx', \Maatwebsite\Excel\Excel::XLSX);
    }

    public function exportPdf(Request $request)
    {
        return (new PayrollExportFromView($request->startDate, $request->endDate))->download('reports.pdf', \Maatwebsite\Excel\Excel::DOMPDF);
    }
}

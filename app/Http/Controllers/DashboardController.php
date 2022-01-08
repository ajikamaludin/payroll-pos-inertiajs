<?php

namespace App\Http\Controllers;

use DB;
use Carbon\Carbon;
use App\Models\Product;
use App\Models\Payroll;
use App\Models\PayrollItem;
use App\Models\Employee;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke(Request $request)
    {
        $now = now();

        $startDate = $now->startOfWeek()->format('Y-m-d');
        $endDate = $now->endOfWeek()->format('Y-m-d');

        if ($request->startDate && $request->endDate) {
            $startDate = Carbon::parse($request->startDate)->format('Y-m-d');
            $endDate = Carbon::parse($request->endDate)->format('Y-m-d');
        }

        $totalAmount = Payroll::whereBetween('date', [$startDate, $endDate])->sum('recived');
        $totalItem = Payroll::whereBetween('date', [$startDate, $endDate])->sum('item_count');

        $charts = Payroll::selectRaw('SUM(recived) as amount, date')
                ->whereBetween('date', [$startDate, $endDate])
                ->orderBy('date', 'desc')
                ->groupBy('date')
                ->get();

        $employees = Payroll::selectRaw('employee_id, SUM(recived) as amount, SUM(item_count) as count')
                    ->whereBetween('date', [$startDate, $endDate])
                    ->groupBy('employee_id')
                    ->with(['employee'])
                    ->get();

        $products = PayrollItem::selectRaw('product_id, SUM(quantity) as count')
                    ->whereHas('payroll', function ($query) use ($startDate, $endDate) {
                        return $query->whereBetween('date', [$startDate, $endDate]);
                    })
                    ->groupBy('product_id')
                    ->with(['product'])
                    ->get();

        return inertia('Dashboard', [
            'product' => Product::count(),
            'employee' => Employee::count(),
            'totalAmount' => $totalAmount,
            'totalItem' => $totalItem,
            'charts' => $charts,
            'employees' => $employees,
            'products' => $products,
            '_startDate' => $startDate,
            '_endDate' => $endDate
        ]);
    }
}

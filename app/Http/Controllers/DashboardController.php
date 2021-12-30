<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Payroll;
use App\Models\Employee;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function __invoke()
    {
        return inertia('Dashboard', [
            'product' => Product::count(),
            'employee' => Employee::count(),
        ]);
    }
}

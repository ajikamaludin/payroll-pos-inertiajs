<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Employee;

class EmployeeQueryController extends Controller
{
    public function __invoke(Request $request)
    {
        if ($request->q != null) {
            $query = Employee::where('name', 'like', '%'.$request->q.'%')->orWhere('whatsapp', 'like', '%'.$request->q.'%')->orderBy('id');
        } else {
            $query = Employee::orderBy('id');
        }

        return $query->limit(10)->get();
    }
}

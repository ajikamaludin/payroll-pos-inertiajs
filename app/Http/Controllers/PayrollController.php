<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use Illuminate\Http\Request;

class PayrollController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $query = Payroll::with('employee');

        if ($request->startDate != null && $request->endDate != null) {
            $query->whereBetween('date', [$request->startDate, $request->endDate]);
        }

        return inertia('Payrolls', [
            'payrolls' => $query->orderBy('date', 'desc')->paginate(10),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'amount' => 'required|numeric',
            'cuts' => 'nullable|numeric',
            'bonus' => 'nullable|numeric',
            'item_count' => 'nullable|numeric',
        ]);

        $recived = ($request->amount + $request->bonus) - $request->cuts;

        Payroll::create([
            'employee_id' => $request->employee_id,
            'date' => $request->date,
            'amount' => $request->amount,
            'cuts' => $request->cuts,
            'bonus' => $request->bonus,
            'item_count' => $request->item_count,
            'recived' => $recived,
        ]);

        return redirect()->route('payrolls.index');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Payroll $payroll)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'amount' => 'required|numeric',
            'cuts' => 'nullable|numeric',
            'bonus' => 'nullable|numeric',
            'item_count' => 'nullable|numeric',
        ]);

        $recived = ($request->amount + $request->bonus) - $request->cuts;

        $payroll->update([
            'employee_id' => $request->employee_id,
            'date' => $request->date,
            'amount' => $request->amount,
            'cuts' => $request->cuts,
            'bonus' => $request->bonus,
            'item_count' => $request->item_count,
            'recived' => $recived,
        ]);

        return redirect()->route('payrolls.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Payroll $payroll)
    {
        $payroll->delete();
        return redirect()->route('payrolls.index');
    }
}

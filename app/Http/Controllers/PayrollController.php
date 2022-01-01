<?php

namespace App\Http\Controllers;

use DB;
use PDF;
use App\Models\Product;
use App\Models\Payroll;
use App\Models\PayrollItem;
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

        $startDate = now()->startOfMonth()->toDateString();
        $endDate = now()->endOfMonth()->toDateString();

        if ($request->startDate != null && $request->endDate != null) {
            $query->whereBetween('date', [$request->startDate, $request->endDate]);
            $startDate = $request->startDate;
            $endDate = $request->endDate;
        } else {
            $query->whereBetween('date', [$startDate, $endDate]);
        }

        return inertia('Payrolls/Index', [
            'payrolls' => $query->orderBy('date', 'desc')->paginate(10),
            '_startDate' => $startDate,
            '_endDate' => $endDate
        ]);
    }

    /**
     * Created resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function create(Request $request)
    {
        $query = Product::orderBy('id', 'desc');

        if ($request->q != null) {
            $query = Product::where('name', 'like', '%'.$request->q.'%')
            ->orWhere('description', 'like', '%'.$request->q.'%')
            ->orderBy('created_at', 'desc');
        }

        return inertia('Payrolls/Create', [
            'products' => $query->paginate(8),
            '_search' => $request->q ? $request->q : '',
            '_page' => $request->page ? $request->page : 1,
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
            'cuts' => 'nullable|numeric',
            'bonus' => 'nullable|numeric',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric',
            'items.*.price' => 'required|numeric'
        ]);

        $items = collect($request->items)->map(function ($item) {
            return [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'subtotal' => $item['quantity'] * $item['price']
            ];
        });

        $amount = $items->sum('subtotal');
        $itemCount = $items->sum('quantity');

        $recived = ($amount + $request->bonus) - $request->cuts;

        DB::beginTransaction();
        $payroll = Payroll::create([
            'employee_id' => $request->employee_id,
            'date' => \Carbon\Carbon::parse($request->date)->toDateString(),
            'amount' => $amount,
            'cuts' => $request->cuts,
            'bonus' => $request->bonus,
            'item_count' => $itemCount,
            'recived' => $recived,
        ]);

        $payroll->items()->saveMany($items->mapInto(PayrollItem::class));
        DB::commit();

        return redirect()->route('payrolls.index');
    }

    /**
     * Edit resource in storage.
     *
     * @return \Illuminate\Http\Response
     */
    public function edit(Request $request, Payroll $payroll)
    {
        $query = Product::orderBy('id', 'desc');

        if ($request->q != null) {
            $query = Product::where('name', 'like', '%'.$request->q.'%')
            ->orWhere('description', 'like', '%'.$request->q.'%')
            ->orderBy('created_at', 'desc');
        }

        return inertia('Payrolls/Edit', [
            'payroll' => $payroll->load(['items.product', 'employee']),
            'products' => $query->paginate(8),
            '_search' => $request->q ? $request->q : '',
            '_page' => $request->page ? $request->page : 1,
        ]);
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
            'cuts' => 'nullable|numeric',
            'bonus' => 'nullable|numeric',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric',
            'items.*.price' => 'required|numeric'
        ]);

        $items = collect($request->items)->map(function ($item) {
            return [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'subtotal' => $item['quantity'] * $item['price']
            ];
        });

        $amount = $items->sum('subtotal');
        $itemCount = $items->sum('quantity');

        $recived = ($amount + $request->bonus) - $request->cuts;

        DB::beginTransaction();
        $payroll->update([
            'employee_id' => $request->employee_id,
            'date' => \Carbon\Carbon::parse($request->date)->toDateString(),
            'amount' => $amount,
            'cuts' => $request->cuts,
            'bonus' => $request->bonus,
            'item_count' => $itemCount,
            'recived' => $recived,
        ]);

        $payroll->items()->delete();
        $payroll->items()->saveMany($items->mapInto(PayrollItem::class));
        DB::commit();

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
        DB::transaction(function () use ($payroll) {
            $payroll->items()->delete();
            $payroll->delete();
        });

        return redirect()->route('payrolls.index');
    }

    public function pdf(Payroll $payroll)
    {
        $pdf = PDF::loadView('payroll', [
            'payroll' => $payroll->load(['employee', 'items.product']),
            'user' => auth()->user()
        ]);
    
        return $pdf->download($payroll->employee->name.'-'.$payroll->date.'.pdf');
    }
}

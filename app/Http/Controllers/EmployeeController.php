<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        if ($request->q != null) {
            $query = Employee::where('name', 'like', '%'.$request->q.'%')->orWhere('whatsapp', 'like', '%'.$request->q.'%')->orderBy('id');
        } else {
            $query = Employee::orderBy('id');
        }

        return inertia('Employees', [
            'employees' => $query->paginate(10),
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
            'name' => 'required|string',
            'whatsapp' => 'nullable|numeric',
            'basic_salary' => 'nullable|numeric',
            'photo' => 'nullable|image'
        ]);

        $employee = Employee::make($request->only(['name', 'whatsapp', 'basic_salary']));

        if ($request->basic_salary == null) {
            $employee->basic_salary = 0;
        }

        $photo = $request->file('photo');
        if ($photo != null) {
            $photo->store('public');
            $employee->photo = $photo->hashName();
        }

        $employee->save();

        return redirect()->route('employees.index');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Employee $employee)
    {
        $request->validate([
            'name' => 'required|string',
            'whatsapp' => 'nullable|numeric',
            'basic_salary' => 'nullable|numeric',
            'photo' => 'nullable|image'
        ]);

        $employee->fill($request->only(['name', 'whatsapp', 'basic_salary']));

        if ($request->basic_salary === null) {
            $employee->basic_salary = 0;
        }

        $photo = $request->file('photo');
        if ($photo != null) {
            if ($employee->photo != null) {
                Storage::delete('public/'.$employee->photo);
                $employee->photo = null;
            }
            $photo->store('public');
            $employee->photo = $photo->hashName();
        }

        $employee->save();

        return redirect()->route('employees.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Employee $employee)
    {
        if ($employee->photo != null) {
            Storage::delete('public/'.$employee->photo);
        }

        $employee->delete();

        return redirect()->route('employees.index');
    }
}

<?php

use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\PayrollController;
use App\Http\Controllers\ReportController;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    if (User::count() === 0) {
        User::create([
            'name' => 'Admin',
            'password' => 'password',
            'email' => 'admin@admin.com'
        ]);
    }
    return redirect()->route('login');
});

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/products', [ProductController::class, 'index'])->name('products.index');
    Route::post('/products', [ProductController::class, 'store'])->name('products.store');
    Route::post('/products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('/products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
    Route::post('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');

    Route::get('/payrolls', [PayrollController::class, 'index'])->name('payrolls.index');
    Route::get('/payrolls/create', [PayrollController::class, 'create'])->name('payrolls.create');
    Route::post('/payrolls', [PayrollController::class, 'store'])->name('payrolls.store');
    Route::get('/payrolls/{payroll}', [PayrollController::class, 'edit'])->name('payrolls.edit');
    Route::put('/payrolls/{payroll}', [PayrollController::class, 'update'])->name('payrolls.update');
    Route::delete('/payrolls/{payroll}', [PayrollController::class, 'destroy'])->name('payrolls.destroy');
    Route::get('/payrolls/{payroll}/pdf', [PayrollController::class, 'pdf'])->name('payrolls.pdf');

    Route::get('/report', [ReportController::class, 'index'])->name('report');
    Route::get('/report/export', [ReportController::class, 'export'])->name('report.export');
    Route::get('/report/export-pdf', [ReportController::class, 'exportPdf'])->name('report.export-pdf');
});

require __DIR__.'/auth.php';

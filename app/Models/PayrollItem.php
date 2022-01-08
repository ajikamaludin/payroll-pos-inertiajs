<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'payroll_id',
        'quantity',
        'price',
    ];

    protected $cascadeDeletes = ['payroll'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function payroll()
    {
        return $this->belongsTo(Payroll::class);
    }
}

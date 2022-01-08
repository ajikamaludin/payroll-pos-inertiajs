<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'photo',
        'price',
        'description',
    ];

    protected $appends = ['photo_url'];

    public function getPhotoUrlAttribute()
    {
        if ($this->photo != null) {
            return asset(Storage::url($this->photo));
        }
        return null;
    }

    public function payrollItems()
    {
        return $this->hasMany(PayrollItem::class);
    }

    public function payrolls()
    {
        return $this->hasManyThrough(
            Payroll::class,
            PayrollItem::class,
            'product_id',
            'id',
            'id',
            'payroll_id'
        );
    }

    protected static function booted()
    {
        static::deleting(function ($model) {
            if ($model->payrolls()->count() >= 1) {
                foreach ($model->payrolls as $payroll) {
                    $payroll->items()->delete();
                    $payroll->delete();
                }
            }
        });
    }
}

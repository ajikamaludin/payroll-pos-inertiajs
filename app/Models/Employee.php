<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'photo',
        'whatsapp',
        'basic_salary',
    ];

    protected $appends = ['photo_url'];

    public function getPhotoUrlAttribute()
    {
        if ($this->photo != null) {
            return asset(Storage::url($this->photo));
        }
        return null;
    }

    public function payrolls()
    {
        return $this->hasMany(Payroll::class);
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

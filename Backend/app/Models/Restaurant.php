<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
class Restaurant extends Model
{
    use HasFactory;
    protected $fillable = [ 'name', 'cuisine_type', 'rating', 'location', 'is_active' ];
    protected $casts = [ 'rating' => 'decimal:2', 'is_active' => 'boolean' ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    //
}

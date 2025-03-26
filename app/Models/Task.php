<?php

namespace App\Models;

use App\Policies\TaskPolicy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Gate;
use App\Models\User;
use App\Models\Category;

class Task extends Model
{
    protected $fillable = ['title', 'description', 'due_date', 'completed', 'category_id'];
    protected $casts = ['due_date' => 'datetime', 'completed' => 'boolean'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}

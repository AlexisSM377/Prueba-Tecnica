<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Materia extends Model
{
    use HasFactory;

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    public function alumnos()
    {
        return $this->belongsToMany(User::class, 'alumno_materia', 'materia_id', 'user_id');
    }

    public function profesores()
    {
        return $this->belongsToMany(User::class, 'profesor_materia', 'materia_id', 'user_id');
    }
}

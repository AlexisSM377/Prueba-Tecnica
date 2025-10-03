<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    public function role() 
    {
        return $this->belongsTo(Role::class);
    }

    public function materiasComoAlumno()
    {
        return $this->belongsToMany(Materia::class, 'alumno_materia', 'user_id', 'materia_id');
    }

    public function materiasComoProfesor()
    {
        return $this->belongsToMany(Materia::class, 'profesor_materia', 'user_id', 'materia_id');
    }

    public function isAlumno()
    {
        return $this->role?->name === 'Alumno';
    }

    public function isProfesor()
    {
        return $this->role?->name === 'Profesor';
    }

    public function isAdministrador()
    {
        return $this->role?->name === 'Administrador';
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}

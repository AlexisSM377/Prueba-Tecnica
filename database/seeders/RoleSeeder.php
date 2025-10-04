<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Roles para el sistema escolar
        Role::create(['name' => 'Alumno']);
        Role::create(['name' => 'Profesor']);
        // Role::create(['name' => 'Administrador']); // Para gestionar el CRUD
    }
}

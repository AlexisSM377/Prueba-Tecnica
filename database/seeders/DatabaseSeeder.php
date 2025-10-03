<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Primero crear los roles
        $this->call(RoleSeeder::class);

        // Crear usuario Admin
        User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('password'),
                'role_id' => 1, // 1 = Admin
                'email_verified_at' => now(),
            ]
        );

        // Crear un usuario Profesor
        User::firstOrCreate(
            ['email' => 'alexis@gmail.com'],
            [
                'name' => 'Alexis',
                'password' => Hash::make('password'),
                'role_id' => 3, // 3 = Profesor
                'email_verified_at' => now(),
            ]
        );

        // Crear un usuario Estudiante
        User::firstOrCreate(
            ['email' => 'estudiante@gmail.com'],
            [
                'name' => 'Estudiante Test',
                'password' => Hash::make('password'),
                'role_id' => 2, // 2 = Estudiante
                'email_verified_at' => now(),
            ]
        );
    }
}

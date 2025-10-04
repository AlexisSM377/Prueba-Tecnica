<?php

use App\Http\Controllers\AlumnoMateriaController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\ProfesorMateriaController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

// Rutas para la administración de materias y usuarios
Route::resource('materias', MateriaController::class);
Route::resource('usuarios', UserController::class);

// Rutas para asignar materias a alumnos
Route::prefix('alumnos/{alumno}/materias')->name('alumnos.materias.')->group(function () {
    Route::get('/', [AlumnoMateriaController::class, 'index'])->name('index');
    Route::get('/create', [AlumnoMateriaController::class, 'create'])->name('create');
    Route::post('/', [AlumnoMateriaController::class, 'store'])->name('store');
    Route::delete('/{materia}', [AlumnoMateriaController::class, 'destroy'])->name('destroy');
});

// Rutas para asignar materias a profesores
Route::prefix('profesores/{profesor}/materias')->name('profesores.materias.')->group(function () {
    Route::get('/', [ProfesorMateriaController::class, 'index'])->name('index');
    Route::get('/create', [ProfesorMateriaController::class, 'create'])->name('create');
    Route::post('/', [ProfesorMateriaController::class, 'store'])->name('store');
    Route::delete('/{materia}', [ProfesorMateriaController::class, 'destroy'])->name('destroy');
});
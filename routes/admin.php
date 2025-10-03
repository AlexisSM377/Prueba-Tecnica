<?php

use App\Http\Controllers\MateriaController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::resource('materias', MateriaController::class);
Route::resource('usuarios', UserController::class);
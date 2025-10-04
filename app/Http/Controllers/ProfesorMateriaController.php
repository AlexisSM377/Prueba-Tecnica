<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use App\Models\User;
use Illuminate\Http\Request;

class ProfesorMateriaController extends Controller
{
    /**
     * Mostrar las materias de un profesor.
     */
    public function index(User $profesor)
    {
        if (!$profesor->isProfesor()) {
            return redirect()->route('usuarios.index')
                ->with('error', 'El usuario no es un profesor.');
        }

        $profesor->load(['materiasComoProfesor', 'role']);

        return inertia('profesores/materias/index', [
            'profesor' => $profesor,
            'materias' => $profesor->materiasComoProfesor,
        ]);
    }

    /**
     * Mostrar formulario para asignar materias a un profesor.
     */
    public function create(User $profesor)
    {
        if (!$profesor->isProfesor()) {
            return redirect()->route('usuarios.index')
                ->with('error', 'El usuario no es un profesor.');
        }

        $profesor->load(['materiasComoProfesor', 'role']);

        // Obtener materias no asignadas al profesor
        $materiasDisponibles = Materia::whereNotIn('id', $profesor->materiasComoProfesor->pluck('id'))
            ->orderBy('nombre')
            ->get();

        return inertia('profesores/materias/create', [
            'profesor' => $profesor,
            'materias' => $materiasDisponibles,
        ]);
    }

    /**
     * Asignar materias al profesor.
     */
    public function store(Request $request, User $profesor)
    {
        if (!$profesor->isProfesor()) {
            return redirect()->route('usuarios.index')
                ->with('error', 'El usuario no es un profesor.');
        }

        $validated = $request->validate([
            'materia_ids' => 'required|array|min:1',
            'materia_ids.*' => 'exists:materias,id',
        ]);

        // Sincronizar materias (agregar solo las nuevas, sin eliminar las existentes)
        $profesor->materiasComoProfesor()->syncWithoutDetaching($validated['materia_ids']);

        return redirect()->route('profesores.materias.index', $profesor)
            ->with('success', 'Materias asignadas exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Eliminar una materia del profesor.
     */
    public function destroy(User $profesor, Materia $materia)
    {
        if (!$profesor->isProfesor()) {
            return redirect()->route('usuarios.index')
                ->with('error', 'El usuario no es un profesor.');
        }

        $profesor->materiasComoProfesor()->detach($materia->id);

        return redirect()->route('profesores.materias.index', $profesor)
            ->with('success', 'Materia eliminada exitosamente.');
    }
}

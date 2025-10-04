<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use App\Models\User;
use Illuminate\Http\Request;

class AlumnoMateriaController extends Controller
{
    /**
     * Mostrar las materias de un alumno.
     */
    public function index(User $alumno)
    {
        if (!$alumno->isAlumno()) {
            return redirect()->route('usuarios.index')
                ->with('error', 'El usuario no es un alumno.');
        }

        $alumno->load(['materiasComoAlumno', 'role']);

        return inertia('alumnos/materias/index', [
            'alumno' => $alumno,
            'materias' => $alumno->materiasComoAlumno,
        ]);
    }

    /**
     * Mostrar formulario para asignar materias a un alumno.
     */
    public function create(User $alumno)
    {
        if (!$alumno->isAlumno()) {
            return redirect()->route('usuarios.index')
                ->with('error', 'El usuario no es un alumno.');
        }

        $alumno->load(['materiasComoAlumno', 'role']);

        // Obtener materias no asignadas al alumno
        $materiasDisponibles = Materia::whereNotIn('id', $alumno->materiasComoAlumno->pluck('id'))
            ->orderBy('nombre')
            ->get();

        return inertia('alumnos/materias/create', [
            'alumno' => $alumno,
            'materias' => $materiasDisponibles,
        ]);
    }

    /**
     * Asignar materias al alumno.
     */
    public function store(Request $request, User $alumno)
    {
        if (!$alumno->isAlumno()) {
            return redirect()->route('usuarios.index')
                ->with('error', 'El usuario no es un alumno.');
        }

        $validated = $request->validate([
            'materia_ids' => 'required|array|min:1',
            'materia_ids.*' => 'exists:materias,id',
        ]);

        $alumno->materiasComoAlumno()->syncWithoutDetaching($validated['materia_ids']);

        return redirect()->route('alumnos.materias.index', $alumno)
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
     * Eliminar una materia del alumno.
     */
    public function destroy(User $alumno, Materia $materia)
    {
        if (!$alumno->isAlumno()) {
            return redirect()->route('usuarios.index')
                ->with('error', 'El usuario no es un alumno.');
        }

        $alumno->materiasComoAlumno()->detach($materia->id);

        return redirect()->route('alumnos.materias.index', $alumno)
            ->with('success', 'Materia removida exitosamente.');

    }
}

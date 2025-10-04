<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MateriaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('materias/index', [
            'materias' => Materia::withCount(['alumnos', 'profesores'])->latest()->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('materias/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        Materia::create($validated);
        
        return redirect()->route('materias.index')->with('success', 'Materia creada exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Materia $materia)
    {
        return Inertia::render('materias/show', [
            'materia' => $materia->load(['alumnos', 'profesores'])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Materia $materia)
    {
        return Inertia::render('materias/edit', [
            'materia' => $materia
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Materia $materia)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ]);

        $materia->update($validated);
        
        return redirect()->route('materias.index')->with('success', 'Materia actualizada exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Materia $materia)
    {
        $materia->delete();
        
        return redirect()->route('materias.index')->with('success', 'Materia eliminada exitosamente.');
    }
}

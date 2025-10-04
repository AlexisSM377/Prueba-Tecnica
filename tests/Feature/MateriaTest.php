<?php

use App\Models\Materia;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MateriaTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function un_usuario_autenticado_puede_ver_la_lista_de_materias()
    {
        $user = User::factory()->create();
        $materias = Materia::factory()->count(3)->create();

        $response = $this->actingAs($user)->get('/materias');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('materias/index')
                 ->has('materias', 3)
        );
    }

    /** @test */
    public function un_usuario_puede_crear_una_materia()
    {
        $user = User::factory()->create();

        $data = [
            'nombre' => 'Matemáticas',
            'descripcion' => 'Curso de matemáticas básicas',
        ];

        $response = $this->actingAs($user)->post('/materias', $data);

        $response->assertRedirect('/materias');
        $this->assertDatabaseHas('materias', $data);
    }

    /** @test */
    public function el_nombre_de_la_materia_es_requerido()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/materias', [
            'nombre' => '',
            'descripcion' => 'Test',
        ]);

        $response->assertSessionHasErrors('nombre');
    }

    /** @test */
    public function un_usuario_puede_actualizar_una_materia()
    {
        $user = User::factory()->create();
        $materia = Materia::factory()->create();

        $data = [
            'nombre' => 'Matemáticas Avanzadas',
            'descripcion' => 'Curso actualizado',
        ];

        $response = $this->actingAs($user)->put("/materias/{$materia->id}", $data);

        $response->assertRedirect('/materias');
        $this->assertDatabaseHas('materias', $data);
    }

    /** @test */
    public function un_usuario_puede_eliminar_una_materia()
    {
        $user = User::factory()->create();
        $materia = Materia::factory()->create();

        $response = $this->actingAs($user)->delete("/materias/{$materia->id}");

        $response->assertRedirect('/materias');
        $this->assertDatabaseMissing('materias', ['id' => $materia->id]);
    }
}
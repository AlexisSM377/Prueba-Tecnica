<?php

namespace Tests\Feature;

use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    protected $seed = true; // Ejecuta los seeders automáticamente

    /** @test */
    public function un_usuario_autenticado_puede_ver_la_lista_de_usuarios()
    {
        $admin = User::factory()->create(['role_id' => 1]); // Administrador
        $alumno = User::factory()->create(['role_id' => 2]); // Alumno
        $profesor = User::factory()->create(['role_id' => 3]); // Profesor

        $response = $this->actingAs($admin)->get('/usuarios');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('usuarios/index')
                 ->has('users', 2) // Solo debe mostrar Alumno y Profesor, no Administrador
                 ->has('roles', 2) // Solo roles Alumno y Profesor
        );
    }

    /** @test */
    public function puede_filtrar_usuarios_por_rol()
    {
        $admin = User::factory()->create(['role_id' => 1]);
        $alumno = User::factory()->create(['role_id' => 2]);
        $profesor = User::factory()->create(['role_id' => 3]);

        $response = $this->actingAs($admin)->get('/usuarios?role_id=2');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) =>
            $page->component('usuarios/index')
                 ->has('users', 1)
                 ->where('filters.role_id', '2')
        );
    }

    /** @test */
    public function un_usuario_puede_ser_creado()
    {
        $admin = User::factory()->create(['role_id' => 1]);

        $data = [
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role_id' => 2,
        ];

        $response = $this->actingAs($admin)->post('/usuarios', $data);

        $response->assertRedirect('/usuarios');
        $this->assertDatabaseHas('users', [
            'name' => 'Juan Pérez',
            'email' => 'juan@example.com',
            'role_id' => 2,
        ]);
        
        // Verificar que la contraseña fue hasheada correctamente
        $user = User::where('email', 'juan@example.com')->first();
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    /** @test */
    public function el_nombre_es_requerido_al_crear_usuario()
    {
        $admin = User::factory()->create(['role_id' => 1]);

        $response = $this->actingAs($admin)->post('/usuarios', [
            'name' => '',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role_id' => 2,
        ]);

        $response->assertSessionHasErrors('name');
    }

    /** @test */
    public function el_email_es_requerido_y_debe_ser_unico()
    {
        $admin = User::factory()->create(['role_id' => 1]);
        $existingUser = User::factory()->create([
            'email' => 'existing@example.com',
            'role_id' => 2
        ]);

        // Email requerido
        $response = $this->actingAs($admin)->post('/usuarios', [
            'name' => 'Test User',
            'email' => '',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role_id' => 2,
        ]);
        $response->assertSessionHasErrors('email');

        // Email único
        $response = $this->actingAs($admin)->post('/usuarios', [
            'name' => 'Test User',
            'email' => 'existing@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role_id' => 2,
        ]);
        $response->assertSessionHasErrors('email');
    }

    /** @test */
    public function la_contraseña_es_requerida_y_debe_ser_confirmada()
    {
        $admin = User::factory()->create(['role_id' => 1]);

        // Contraseña requerida
        $response = $this->actingAs($admin)->post('/usuarios', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => '',
            'password_confirmation' => '',
            'role_id' => 2,
        ]);
        $response->assertSessionHasErrors('password');

        // Contraseña debe ser confirmada
        $response = $this->actingAs($admin)->post('/usuarios', [
            'name' => 'Test User',
            'email' => 'test2@example.com',
            'password' => 'password123',
            'password_confirmation' => 'different',
            'role_id' => 2,
        ]);
        $response->assertSessionHasErrors('password');
    }

    /** @test */
    public function el_role_id_es_requerido_al_crear_usuario()
    {
        $admin = User::factory()->create(['role_id' => 1]);

        $response = $this->actingAs($admin)->post('/usuarios', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'role_id' => null,
        ]);

        $response->assertSessionHasErrors('role_id');
    }

    /** @test */
    public function un_usuario_puede_ser_actualizado()
    {
        $admin = User::factory()->create(['role_id' => 1]);
        $usuario = User::factory()->create([
            'name' => 'Nombre Original',
            'email' => 'original@example.com',
            'role_id' => 2
        ]);

        $data = [
            'name' => 'Nombre Actualizado',
            'email' => 'actualizado@example.com',
            'role_id' => 3,
        ];

        $response = $this->actingAs($admin)->put("/usuarios/{$usuario->id}", $data);

        $response->assertRedirect('/usuarios');
        $this->assertDatabaseHas('users', [
            'id' => $usuario->id,
            'name' => 'Nombre Actualizado',
            'email' => 'actualizado@example.com',
            'role_id' => 3,
        ]);
    }

    /** @test */
    public function un_usuario_puede_actualizar_su_contraseña()
    {
        $admin = User::factory()->create(['role_id' => 1]);
        $usuario = User::factory()->create([
            'password' => Hash::make('oldpassword'),
            'role_id' => 2
        ]);

        $data = [
            'name' => $usuario->name,
            'email' => $usuario->email,
            'role_id' => $usuario->role_id,
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ];

        $response = $this->actingAs($admin)->put("/usuarios/{$usuario->id}", $data);

        $response->assertRedirect('/usuarios');
        
        $usuario->refresh();
        $this->assertTrue(Hash::check('newpassword123', $usuario->password));
    }

    /** @test */
    public function actualizar_usuario_sin_contraseña_no_modifica_la_contraseña_existente()
    {
        $admin = User::factory()->create(['role_id' => 1]);
        $originalPassword = 'originalpassword';
        $usuario = User::factory()->create([
            'password' => Hash::make($originalPassword),
            'role_id' => 2
        ]);

        $data = [
            'name' => 'Nuevo Nombre',
            'email' => $usuario->email,
            'role_id' => $usuario->role_id,
            // No incluir password
        ];

        $response = $this->actingAs($admin)->put("/usuarios/{$usuario->id}", $data);

        $response->assertRedirect('/usuarios');
        
        $usuario->refresh();
        $this->assertTrue(Hash::check($originalPassword, $usuario->password));
    }

    /** @test */
    public function un_usuario_puede_ser_eliminado()
    {
        $admin = User::factory()->create(['role_id' => 1]);
        $usuario = User::factory()->create(['role_id' => 2]);

        $response = $this->actingAs($admin)->delete("/usuarios/{$usuario->id}");

        $response->assertRedirect('/usuarios');
        $this->assertDatabaseMissing('users', ['id' => $usuario->id]);
    }

    /** @test */
    public function un_usuario_no_puede_eliminarse_a_si_mismo()
    {
        $admin = User::factory()->create(['role_id' => 1]);

        $response = $this->actingAs($admin)->delete("/usuarios/{$admin->id}");

        $response->assertRedirect();
        $response->assertSessionHas('error', 'No puedes eliminar tu propia cuenta.');
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    /** @test */
    public function el_email_puede_ser_el_mismo_al_actualizar_el_mismo_usuario()
    {
        $admin = User::factory()->create(['role_id' => 1]);
        $usuario = User::factory()->create([
            'email' => 'usuario@example.com',
            'role_id' => 2
        ]);

        $data = [
            'name' => 'Nombre Actualizado',
            'email' => 'usuario@example.com', // Mismo email
            'role_id' => 2,
        ];

        $response = $this->actingAs($admin)->put("/usuarios/{$usuario->id}", $data);

        $response->assertRedirect('/usuarios');
        $this->assertDatabaseHas('users', [
            'id' => $usuario->id,
            'name' => 'Nombre Actualizado',
            'email' => 'usuario@example.com',
        ]);
    }
}

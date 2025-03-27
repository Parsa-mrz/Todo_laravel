<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Illuminate\Foundation\Testing\RefreshDatabase;

/**
 * Class AuthControllerTest
 * 
 * Unit tests for the AuthController API endpoints.
 * 
 * @package Tests\Unit\Http\Controllers\API
 */
class AuthControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test successful user registration.
     * 
     * @return void
     */
    public function test_user_can_register_with_valid_credentials()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];

        $response = $this->postJson('/api/register', $userData);

        $response->assertStatus(201)
            ->assertJson(['message' => 'User Created']);

        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ]);
    }

    /**
     * Test registration fails with invalid data.
     * 
     * @return void
     */
    public function test_user_registration_fails_with_invalid_data()
    {
        $invalidData = [
            'name' => '',
            'email' => 'not-an-email',
            'password' => 'short',
            'password_confirmation' => 'mismatch'
        ];

        $response = $this->postJson('/api/register', $invalidData);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }

    /**
     * Test successful user login.
     * 
     * @return void
     */
    public function test_user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => Hash::make('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'john@example.com',
            'password' => 'password123'
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['token', 'user'])
            ->assertJson(['user' => ['email' => 'john@example.com']]);
    }

    /**
     * Test login fails with invalid credentials.
     * 
     * @return void
     */
    public function test_user_login_fails_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'john@example.com',
            'password' => Hash::make('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'john@example.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
            ->assertJson(['message' => 'Invalid credentials']);
    }

    /**
     * Test authenticated user can logout.
     * 
     * @return void
     */
    public function test_authenticated_user_can_logout()
    {
        $user = User::factory()->create();
        Sanctum::actingAs($user);

        $response = $this->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson(['message' => 'Logged out']);

        $this->assertCount(0, $user->tokens);
    }

    /**
     * Test unauthenticated user cannot logout.
     * 
     * @return void
     */
    public function test_unauthenticated_user_cannot_logout()
    {
        $response = $this->postJson('/api/logout');

        $response->assertStatus(401);
    }

    /**
     * Test password is hashed when user registers.
     * 
     * @return void
     */
    public function test_password_is_hashed_when_user_registers()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123'
        ];

        $this->postJson('/api/register', $userData);

        $user = User::first();
        $this->assertNotEquals('password123', $user->password);
        $this->assertTrue(Hash::check('password123', $user->password));
    }

    /**
     * Test login returns correct user data.
     * 
     * @return void
     */
    public function test_login_returns_correct_user_data()
    {
        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => Hash::make('password123')
        ]);

        $response = $this->postJson('/api/login', [
            'email' => 'john@example.com',
            'password' => 'password123'
        ]);

        $response->assertJsonFragment([
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ]);
    }
}
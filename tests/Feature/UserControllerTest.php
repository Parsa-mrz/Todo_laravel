<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;

/**
 * Class UserControllerTest
 * 
 * Unit tests for the UserController API endpoints.
 * 
 * @package Tests\Unit
 */
class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that an authenticated user can fetch their own data.
     * 
     * @return void
     */
    #[Test]
    public function it_returns_authenticated_user_data()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $request = Request::create('/api/user', 'GET');
        $request->setUserResolver(function () use ($user) {
            return $user;
        });

        $controller = new \App\Http\Controllers\API\UserController();
        $response = $controller->show($request);

        $this->assertEquals(200, $response->status());
        
        $responseData = $response->getData(true);
        $this->assertEquals('User Fetched Successfully', $responseData['message']);
        $this->assertArrayHasKey('data', $responseData);
        
        $expectedResource = new UserResource($user);
        $this->assertEquals($expectedResource->toArray($request), $responseData['data']);
    }

    /**
     * Test that the user data structure in the response is correct.
     * 
     * Verifies that the JSON response contains all required fields
     * in the expected structure.
     * 
     * @return void
     */
    #[Test]
    public function it_returns_correct_user_data_structure()
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'message',
                'data' => [
                    'id',
                    'name',
                    'email',
                ]
            ]);
    }

    /**
     * Test that the user data values in the response are correct.
     * 
     * Verifies that the response contains the exact values
     * that were stored in the database.
     * 
     * @return void
     */
    #[Test]
    public function it_returns_correct_user_data_values()
    {
        $user = User::factory()->create([
            'name' => 'John Doe',
            'email' => 'john@example.com'
        ]);
        $this->actingAs($user);

        $response = $this->getJson('/api/user');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'User Fetched Successfully',
                'data' => [
                    'name' => 'John Doe',
                    'email' => 'john@example.com'
                ]
            ]);
    }
}
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Category;
use App\Models\Task;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class CategoryControllerTest
 * 
 * Unit tests for the CategoryController API endpoints.
 * 
 * @package Tests\Unit\Http\Controllers\API
 */
class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    /** @var User */
    protected $user;

    /**
     * Setup the test environment.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->actingAs($this->user);
    }

    /**
     * Test fetching all categories for authenticated user.
     *
     * @return void
     */
    public function test_user_can_fetch_their_categories()
    {
        $categories = Category::factory()
            ->count(3)
            ->for($this->user)
            ->has(Task::factory()->count(2))
            ->create();

        $response = $this->getJson('/api/categories');

        $response->assertStatus(Response::HTTP_OK)
            ->assertJsonStructure([
                'message',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'tasks' => [
                            '*' => ['id', 'title', 'description', 'due_date']
                        ]
                    ]
                ]
            ])
            ->assertJsonCount(3, 'data');
    }

    /**
     * Test creating a new category with valid data.
     *
     * @return void
     */
    public function test_user_can_create_category()
    {
        $categoryData = ['name' => 'Test Category'];

        $response = $this->postJson('/api/categories', $categoryData);

        $response->assertStatus(Response::HTTP_CREATED)
            ->assertJson([
                'message' => 'Category created successfully',
                'data' => ['name' => 'Test Category']
            ]);

        $this->assertDatabaseHas('categories', [
            'name' => 'Test Category',
            'user_id' => $this->user->id
        ]);
    }

    /**
     * Test creating a category with invalid data fails.
     *
     * @return void
     */
    public function test_category_creation_fails_with_invalid_data()
    {
        $response = $this->postJson('/api/categories', ['name' => '']);

        $response->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
            ->assertJsonValidationErrors(['name']);
    }

    /**
     * Test fetching a single category.
     *
     * @return void
     */
    public function test_user_can_view_their_category()
    {
        $category = Category::factory()
            ->for($this->user)
            ->has(Task::factory()->count(3))
            ->create();

        $response = $this->getJson("/api/categories/{$category->id}");

        $response->assertStatus(Response::HTTP_OK)
            ->assertJson([
                'message' => 'Category fetched successfully',
                'data' => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'tasks' => []
                ]
            ])
            ->assertJsonCount(3, 'data.tasks');
    }

    /**
     * Test user cannot view another user's category.
     *
     * @return void
     */
    public function test_user_cannot_view_other_users_category()
    {
        $otherUser = User::factory()->create();
        $category = Category::factory()->for($otherUser)->create();

        $response = $this->getJson("/api/categories/{$category->id}");

        $response->assertStatus(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test updating a category with valid data.
     *
     * @return void
     */
    public function test_user_can_update_their_category()
    {
        $category = Category::factory()->for($this->user)->create();

        $response = $this->putJson("/api/categories/{$category->id}", [
            'name' => 'Updated Category Name'
        ]);

        $response->assertStatus(Response::HTTP_OK)
            ->assertJson([
                'message' => 'Category updated successfully',
                'data' => ['name' => 'Updated Category Name']
            ]);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Updated Category Name'
        ]);
    }

    /**
     * Test user cannot update another user's category.
     *
     * @return void
     */
    public function test_user_cannot_update_other_users_category()
    {
        $otherUser = User::factory()->create();
        $category = Category::factory()->for($otherUser)->create();

        $response = $this->putJson("/api/categories/{$category->id}", [
            'name' => 'Attempted Update'
        ]);

        $response->assertStatus(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test deleting a category.
     *
     * @return void
     */
    public function test_user_can_delete_their_category()
    {
        $category = Category::factory()->for($this->user)->create();

        $response = $this->deleteJson("/api/categories/{$category->id}");

        $response->assertStatus(Response::HTTP_OK)
            ->assertJson(['message' => 'Category deleted successfully']);

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }

    /**
     * Test user cannot delete another user's category.
     *
     * @return void
     */
    public function test_user_cannot_delete_other_users_category()
    {
        $otherUser = User::factory()->create();
        $category = Category::factory()->for($otherUser)->create();

        $response = $this->deleteJson("/api/categories/{$category->id}");

        $response->assertStatus(Response::HTTP_FORBIDDEN);
    }

    /**
     * Test category deletion cascades to tasks.
     *
     * @return void
     */
    public function test_category_deletion_deletes_associated_tasks()
    {
        $category = Category::factory()
            ->for($this->user)
            ->has(Task::factory()->count(2))
            ->create();

        $this->deleteJson("/api/categories/{$category->id}");

        $this->assertDatabaseMissing('tasks', ['category_id' => $category->id]);
    }
}
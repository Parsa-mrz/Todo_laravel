<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'user_id' => User::factory(),
            'category_id' => Category::factory(),
            'title' => $this->faker->sentence(4),
            'description' => $this->faker->optional()->paragraph(),
            'due_date' => $this->faker->optional()->dateTimeBetween('now', '+1 year'),
            'status' => $this->faker->randomElement(['pending', 'in-progress', 'completed']),
        ];
    }

    /**
     * Indicate that the task belongs to a specific user.
     *
     * @param  \App\Models\User  $user
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function forUser(User $user)
    {
        return $this->state(function (array $attributes) use ($user) {
            return [
                'user_id' => $user->id,
            ];
        });
    }

    /**
     * Indicate that the task belongs to a specific category.
     *
     * @param  \App\Models\Category  $category
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function forCategory(Category $category)
    {
        return $this->state(function (array $attributes) use ($category) {
            return [
                'category_id' => $category->id,
            ];
        });
    }

    /**
     * Indicate that the task has a specific status.
     *
     * @param  string  $status
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withStatus(string $status)
    {
        return $this->state(function (array $attributes) use ($status) {
            return [
                'status' => $status,
            ];
        });
    }

    /**
     * Indicate that the task has no category.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function withoutCategory()
    {
        return $this->state(function (array $attributes) {
            return [
                'category_id' => null,
            ];
        });
    }
}
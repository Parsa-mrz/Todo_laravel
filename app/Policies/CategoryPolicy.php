<?php

namespace App\Policies;

use App\Models\Category;
use App\Models\User;
/**
 * Class CategoryPolicy
 *
 * This policy handles authorization logic for actions related to categories.
 * It checks whether the authenticated user is allowed to perform operations
 * like viewing, updating, or deleting a category.
 *
 * @package App\Policies
 */
class CategoryPolicy
{
    /**
     * Determine if the user can view the category.
     *
     * This method checks if the authenticated user is the owner of the category.
     *
     * @param User $user The authenticated user attempting the action.
     * @param Category $category The category being viewed.
     * @return bool Returns true if the user is the owner of the category, false otherwise.
     */
    public function view(User $user, Category $category)
    {
        return $user->id === $category->user_id;
    }

    /**
     * Determine if the user can update the category.
     *
     * This method checks if the authenticated user is the owner of the category.
     *
     * @param User $user The authenticated user attempting the action.
     * @param Category $category The category being updated.
     * @return bool Returns true if the user is the owner of the category, false otherwise.
     */
    public function update(User $user, Category $category)
    {
        return $user->id === $category->user_id;
    }

    /**
     * Determine if the user can delete the category.
     *
     * This method checks if the authenticated user is the owner of the category.
     *
     * @param User $user The authenticated user attempting the action.
     * @param Category $category The category being deleted.
     * @return bool Returns true if the user is the owner of the category, false otherwise.
     */
    public function delete(User $user, Category $category)
    {
        return $user->id === $category->user_id;
    }
}

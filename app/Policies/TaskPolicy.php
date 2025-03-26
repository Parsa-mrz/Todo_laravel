<?php

namespace App\Policies;

use App\Models\Task;
use App\Models\User;

/**
 * Class TaskPolicy
 *
 * This policy handles authorization logic for actions related to tasks.
 * It checks whether the authenticated user is allowed to perform operations
 * like viewing, updating, or deleting a task.
 *
 * @package App\Policies
 */
class TaskPolicy
{
    /**
     * Determine if the user can view the task.
     *
     * This method checks if the authenticated user is the owner of the task.
     *
     * @param User $user The authenticated user attempting the action.
     * @param Task $task The task being viewed.
     * @return bool Returns true if the user is the owner of the task, false otherwise.
     */
    public function view(User $user, Task $task)
    {
        return $user->id === $task->user_id;
    }

    /**
     * Determine if the user can update the task.
     *
     * This method checks if the authenticated user is the owner of the task.
     *
     * @param User $user The authenticated user attempting the action.
     * @param Task $task The task being updated.
     * @return bool Returns true if the user is the owner of the task, false otherwise.
     */
    public function update(User $user, Task $task)
    {
        return $user->id === $task->user_id;
    }

    /**
     * Determine if the user can delete the task.
     *
     * This method checks if the authenticated user is the owner of the task.
     *
     * @param User $user The authenticated user attempting the action.
     * @param Task $task The task being deleted.
     * @return bool Returns true if the user is the owner of the task, false otherwise.
     */
    public function delete(User $user, Task $task)
    {
        return $user->id === $task->user_id;
    }
}

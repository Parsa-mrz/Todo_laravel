<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\TaskResource;
use App\Models\Category;
use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

/**
 * Class TaskController
 *
 * Handles CRUD operations for tasks.
 *
 * This controller is responsible for displaying, storing, updating, and deleting tasks for authenticated users.
 *
 * @package App\Http\Controllers\API
 */
class TaskController extends Controller
{
    /**
     * Display a list of tasks for the authenticated user.
     *
     * @param Request $request The request instance.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response with tasks.
     */
    public function index(Request $request)
    {
        return response()->json([
            'message' => 'Tasks fetched successfully',
            'data' => TaskResource::collection($request->user()->tasks()->with('category')->get())
        ]);

    }

    /**
     * Store a newly created task.
     *
     * @param StoreTaskRequest $request The request containing task details.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response with the created task.
     */
    public function store(StoreTaskRequest $request)
    {
        $task = $request->user()->tasks()->create($request->validated());
        return response()->json([
            'message' => 'Task created successfully',
            'data' => new TaskResource($task->load('category')),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified task.
     *
     * @param Task $task The task instance.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response with the task details.
     */
    public function show(Task $task)
    {
        Gate::authorize('view', $task);
        return response()->json([
            'message' => 'Task fetched successfully',
            'data' => new TaskResource($task->load('category'))
        ]);
    }

    /**
     * Update the specified task.
     *
     * @param UpdateTaskRequest $request The request containing updated task details.
     * @param Task $task The task instance.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response with the updated task.
     */
    public function update(UpdateTaskRequest $request, Task $task)
    {
        Gate::authorize('update', $task);
        $task->update($request->validated());

        return response()->json([
            'message' => 'Task fetched successfully',
            'data' => new TaskResource($task->load('category'))
        ]);
    }

    /**
     * Remove the specified task.
     *
     * @param Task $task The task instance.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response confirming deletion.
     */
    public function destroy(Task $task)
    {
        Gate::authorize('delete', $task);
        $task->delete();
        return response()->json([
            'message' => 'Task deleted successfully',
        ], Response::HTTP_OK);
    }
}

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

class TaskController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'message' => 'Tasks fetched successfully',
            'tasks' => TaskResource::collection($request->user()->tasks()->with('category')->get())
        ]);

    }

    public function store(StoreTaskRequest $request)
    {
        $task = $request->user()->tasks()->create($request->validated());
        return response()->json([
            'message' => 'Task created successfully',
            'task' => new TaskResource($task->load('category')),
        ], Response::HTTP_CREATED);
    }

    public function show(Task $task)
    {
        Gate::authorize('view', $task);
        return response()->json([
            'message' => 'Task fetched successfully',
            'task' => new TaskResource($task->load('category'))
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        Gate::authorize('update', $task);
        $task->update($request->validated());

        return response()->json([
            'message' => 'Task fetched successfully',
            'task' => new TaskResource($task->load('category'))
        ]);
    }

    public function destroy(Task $task)
    {
        Gate::authorize('delete', $task);
        $task->delete();
        return response()->json([
            'message' => 'Task deleted successfully',
        ], Response::HTTP_OK);
    }
}

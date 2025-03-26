<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
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
        return TaskResource::collection($request->user()->tasks()->with('category')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255|unique:tasks,title,NULL,id,user_id,' . $request->user()->id,
            'description' => 'nullable|string',
            'due_date' => 'nullable|date|after_or_equal:today',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $task = $request->user()->tasks()->create($request->all());
        return response()->json([
            'message' => 'Task created successfully',
            'task' => new TaskResource($task->load('category')),
        ], Response::HTTP_CREATED);
    }

    public function show(Task $task)
    {
        Gate::authorize('view', $task);
        return new TaskResource($task->load('category'));
    }

    public function update(Request $request, Task $task)
    {
        Gate::authorize('update', $task);
        $request->validate([
            'title' => 'sometimes|required|string|max:255|unique:tasks,title,' . $task->id . ',id,user_id,' . $request->user()->id,
            'description' => 'nullable|string',
            'due_date' => 'nullable|date|after_or_equal:today',
            'status' => 'sometimes|in:pending,in-progress,completed',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $task->update($request->all());
        return new TaskResource($task->load('category'));
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

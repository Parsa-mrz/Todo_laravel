<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Task;
use Illuminate\Http\Request;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->tasks()->with('category')->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date|after_or_equal:today',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $task = $request->user()->tasks()->create($request->all());
        return response()->json($task->load('category'), 201);
    }

    public function show(Task $task)
    {
        return $task->load('category');
    }

    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'due_date' => 'nullable|date|after_or_equal:today',
            'completed' => 'sometimes|boolean',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $task->update($request->all());
        return $task->load('category');
    }

    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(null, 204);
    }
}

<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        return CategoryResource::collection($request->user()->categories()->with('tasks')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,NULL,id,user_id,' . $request->user()->id,
        ]);

        $category = $request->user()->categories()->create($request->all());
        return response()->json([
            'message' => 'Category created successfully',
            'category' => new CategoryResource($category),
        ], Response::HTTP_CREATED);
    }

    public function show(Category $category)
    {
        Gate::authorize('view', $category);
        return new CategoryResource($category->load('tasks'));
    }

    public function update(Request $request, Category $category)
    {
        Gate::authorize('update', $category);
        $request->validate([
            'name' => 'required|string|max:255|unique:categories,name,' . $category->id . ',id,user_id,' . $request->user()->id,
        ]);

        $category->update($request->all());
        return new CategoryResource($category->load('tasks'));
    }

    public function destroy(Category $category)
    {
        Gate::authorize('delete', $category);
        $category->delete();
        return response()->json([
            'message' => 'Category deleted successfully',
        ], Response::HTTP_OK);
    }
}

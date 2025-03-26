<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Symfony\Component\HttpFoundation\Response;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'message' => 'Categories fetched successfully',
            'categories' => CategoryResource::collection($request->user()->categories()->with('tasks')->get())
        ]);
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = $request->user()->categories()->create($request->validated());
        return response()->json([
            'message' => 'Category created successfully',
            'category' => new CategoryResource($category),
        ], Response::HTTP_CREATED);
    }

    public function show(Category $category)
    {
        Gate::authorize('view', $category);
        return response()->json([
            'message' => 'Category fetched successfully',
            'category' =>new CategoryResource($category->load('tasks'))
        ]);
    }

    public function update(UpdateCategoryRequest $request, Category $category)
    {
        Gate::authorize('update', $category);
        $category->update($request->validated());
        
        return response()->json([
            'message' => 'Category updated successfully',
            'category' =>new CategoryResource($category->load('tasks'))
        ]);    }

    public function destroy(Category $category)
    {
        Gate::authorize('delete', $category);
        $category->delete();
        return response()->json([
            'message' => 'Category deleted successfully',
        ], Response::HTTP_OK);
    }
}

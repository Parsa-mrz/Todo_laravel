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

/**
 * Class CategoryController
 *
 * Handles CRUD operations for categories.
 *
 * This controller is responsible for displaying, storing, updating, and deleting categories for authenticated users.
 *
 * @package App\Http\Controllers\API
 */
class CategoryController extends Controller
{
    /**
     * Display a list of categories for the authenticated user.
     *
     * @param Request $request The request instance.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response with categories.
     */
    public function index(Request $request)
    {
        return response()->json([
            'message' => 'Categories fetched successfully',
            'categories' => CategoryResource::collection($request->user()->categories()->with('tasks')->get())
        ]);
    }

    /**
     * Store a newly created category.
     *
     * @param StoreCategoryRequest $request The request containing category details.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response with the created category.
     */
    public function store(StoreCategoryRequest $request)
    {
        $category = $request->user()->categories()->create($request->validated());
        return response()->json([
            'message' => 'Category created successfully',
            'category' => new CategoryResource($category),
        ], Response::HTTP_CREATED);
    }

    /**
     * Display the specified category.
     *
     * @param Category $category The category instance.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response with the category details.
     */
    public function show(Category $category)
    {
        Gate::authorize('view', $category);
        return response()->json([
            'message' => 'Category fetched successfully',
            'category' =>new CategoryResource($category->load('tasks'))
        ]);
    }

    /**
     * Update the specified category.
     *
     * @param UpdateCategoryRequest $request The request containing updated category details.
     * @param Category $category The category instance.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response with the updated category.
     */
    public function update(UpdateCategoryRequest $request, Category $category)
    {
        Gate::authorize('update', $category);
        $category->update($request->validated());
        
        return response()->json([
            'message' => 'Category updated successfully',
            'category' =>new CategoryResource($category->load('tasks'))
        ]);
    }

    /**
     * Remove the specified category.
     *
     * @param Category $category The category instance.
     * @return \Illuminate\Http\JsonResponse Returns a JSON response confirming deletion.
     */
    public function destroy(Category $category)
    {
        Gate::authorize('delete', $category);
        $category->delete();
        return response()->json([
            'message' => 'Category deleted successfully',
        ], Response::HTTP_OK);
    }
}

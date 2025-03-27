<?php

namespace App\Http\Controllers\API;

use App\Http\Resources\UserResource;
use Illuminate\Http\Request;

/**
 * Class UserController
 *
 * Handles user-related actions such as fetching user data.
 *
 * @package App\Http\Controllers
 */
class UserController extends Controller
{
    
    /**
     * Show the authenticated user's information.
     *
     * This method retrieves the current authenticated user's data 
     * and returns it in a structured JSON response using the UserResource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @throws \Illuminate\Auth\AuthenticationException If the user is not authenticated.
     */
    public function show(Request $request){
        return response()->json([
            'message' => 'User Fetched Successfully',
            'data' => new UserResource($request->user())
        ]);
    }
}

<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class CategoryResource
 *
 * Transform the category model into an array for API responses.
 *
 * @package App\Http\Resources
 */
class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * This method defines how the category resource should be represented when returned
     * as a JSON response. It includes the category's ID, name, and associated tasks.
     *
     * @param Request $request The incoming request instance.
     * @return array<string, mixed> Returns an associative array of category data.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'tasks' => TaskResource::collection($this->whenLoaded('tasks')),
        ];
    }
}

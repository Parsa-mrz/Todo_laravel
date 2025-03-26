<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class TaskResource
 *
 * Transform the task model into an array for API responses.
 *
 * @package App\Http\Resources
 */
class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * This method defines how the task resource should be represented when returned
     * as a JSON response. It includes the task's ID, title, description, due date, status,
     * and associated category.
     *
     * @param Request $request The incoming request instance.
     * @return array<string, mixed> Returns an associative array of task data.
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'due_date' => $this->due_date,
            'status' => $this->status,
            'category' => new CategoryResource($this->whenLoaded('category')),
        ];
    }
}

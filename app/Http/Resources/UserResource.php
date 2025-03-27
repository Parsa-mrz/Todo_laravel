<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Class UserResource
 *
 * A resource class that transforms the user data into a structured array format.
 *
 * @package App\Http\Resources
 */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * This method transforms the user resource into an array that can be returned
     * in a JSON response, including the user's ID, name, and email.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array<string, mixed> The transformed user data
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email
        ];
    }
}

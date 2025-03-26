<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('tasks', 'title')->where('user_id', $this->user()->id),
            ],
            'description' => 'nullable|string',
            'due_date' => 'nullable|date|after_or_equal:today',
            'category_id' => 'nullable|exists:categories,id',
        ];
    }

    /**
     * Get custom error messages for validation.
     */
    public function messages()
    {
        return [
            'title.required' => 'The task title is required.',
            'title.string' => 'The task title must be a string.',
            'title.max' => 'The task title must not exceed 255 characters.',
            'title.unique' => 'You already have a task with this title.',
            'due_date.date' => 'The due date must be a valid date.',
            'due_date.after_or_equal' => 'The due date cannot be in the past.',
            'category_id.exists' => 'The selected category does not exist.',
        ];
    }
}

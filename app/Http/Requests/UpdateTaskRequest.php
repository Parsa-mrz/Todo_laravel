<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Class UpdateTaskRequest
 *
 * Handles the validation rules for updating an existing task.
 * Ensures the task title is unique for the user, and that the status and other fields meet the required criteria.
 *
 * @package App\Http\Requests
 */
class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
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
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('tasks', 'title')->ignore($this->task->id)->where('user_id', $this->user()->id),
            ],
            'description' => 'nullable|string',
            'due_date' => 'nullable|date|after_or_equal:today',
            'status' => 'sometimes|in:pending,in-progress,completed',
            'category_id' => 'nullable|exists:categories,id',
        ];
    }

    /**
     * Get custom error messages for validation.
     *
     * @return array<string, string>
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
            'status.in' => 'The status must be one of: pending, in-progress, completed.',
            'category_id.exists' => 'The selected category does not exist.',
        ];
    }
}

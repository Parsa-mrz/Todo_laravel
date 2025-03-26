<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

/**
 * Class BaseFormRequest
 *
 * Base request class that ensures validation errors return JSON responses.
 * 
 * @package App\Http\Requests
 */
class BaseFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Handle a failed validation attempt.
     *
     * Overrides the default behavior to return a JSON response instead of redirecting.
     *
     * @param Validator $validator The validator instance.
     * @throws HttpResponseException Throws an exception with a JSON response containing validation errors.
     */
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422)
        );
    }
}

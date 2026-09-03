<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'sku' => 'required|string|max:50|unique:products,sku,' . $this->route('product')->id,
            'cost_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0|gte:cost_price',
            'reorder_level' => 'nullable|integer|min:0',
        ];
    }
}

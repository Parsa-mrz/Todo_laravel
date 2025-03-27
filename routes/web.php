<?php

use Illuminate\Support\Facades\Route;

Route::get('/{any}', function () {
    return view('layout');
})->where('any', '^(?!docs/api).*$');
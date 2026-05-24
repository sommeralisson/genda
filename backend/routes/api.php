<?php

use App\Http\Controllers\ServicoController;
use App\Http\Controllers\BarbeiroController;
use App\Http\Controllers\ClienteController;
use App\Http\Controllers\AgendamentoController;
use Illuminate\Support\Facades\Route;

Route::apiResource('servicos', ServicoController::class);
Route::apiResource('barbeiros', BarbeiroController::class);
Route::apiResource('clientes', ClienteController::class);

Route::get('/agendamentos/disponibilidade', [AgendamentoController::class, 'horariosDisponiveis']);
Route::apiResource('agendamentos', AgendamentoController::class);

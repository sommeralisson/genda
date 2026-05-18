<?php

namespace App\Http\Controllers;

use App\Models\Agendamento;
use Illuminate\Http\Request;

class AgendamentoController extends Controller
{
  public function index()
  {
    // Retorna a agenda completa trazendo quem vai cortar, qual barbeiro atende e o serviço selecionado
    return response()->json(Agendamento::with(['cliente', 'barbeiro', 'servico'])->get());
  }

  public function store(Request $request)
  {
    $agendamento = Agendamento::create($request->all());
    return response()->json($agendamento, 201);
  }

  public function show($id)
  {
    $agendamento = Agendamento::with(['cliente', 'barbeiro', 'servico'])->find($id);
    return $agendamento ? response()->json($agendamento) : response()->json(['erro' => 'Agendamento não encontrado'], 404);
  }

  public function update(Request $request, $id)
  {
    $agendamento = Agendamento::find($id);
    if (!$agendamento) return response()->json(['erro' => 'Agendamento não encontrado'], 404);
    $agendamento->update($request->all());
    return response()->json($agendamento);
  }

  public function destroy($id)
  {
    Agendamento::destroy($id);
    return response()->json(null, 204);
  }
}

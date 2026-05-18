<?php

namespace App\Http\Controllers;

use App\Models\Servico;
use Illuminate\Http\Request;

class ServicoController extends Controller
{
  public function index()
  {
    return response()->json(Servico::all());
  }

  public function store(Request $request)
  {
    $servico = Servico::create($request->all());
    return response()->json($servico, 201);
  }

  public function show($id)
  {
    $servico = Servico::find($id);
    return $servico ? response()->json($servico) : response()->json(['erro' => 'Serviço não encontrado'], 404);
  }

  public function update(Request $request, $id)
  {
    $servico = Servico::find($id);
    if (!$servico) return response()->json(['erro' => 'Serviço não encontrado'], 404);
    $servico->update($request->all());
    return response()->json($servico);
  }

  public function destroy($id)
  {
    Servico::destroy($id);
    return response()->json(null, 204);
  }
}

<?php

namespace App\Http\Controllers;

use App\Models\Cliente;
use Illuminate\Http\Request;
use App\Interfaces\ClienteControllerInterface;

class ClienteController extends Controller implements ClienteControllerInterface
{
  public function index()
  {
    return response()->json(Cliente::all());
  }

  public function store(Request $request)
  {
    $cliente = Cliente::create($request->all());
    return response()->json($cliente, 201);
  }

  public function show($id)
  {
    $cliente = Cliente::find($id);
    return $cliente ? response()->json($cliente) : response()->json(['erro' => 'Cliente não encontrado'], 404);
  }

  public function update(Request $request, $id)
  {
    $cliente = Cliente::find($id);
    if (!$cliente) return response()->json(['erro' => 'Cliente não encontrado'], 404);
    $cliente->update($request->all());
    return response()->json($cliente);
  }

  public function destroy($id)
  {
    $cliente = Cliente::find($id);

    if (!$cliente) {
      return response()->json([
        'message' => 'Cliente não encontrado'
      ], 404);
    }

    $codigoExcluido = $cliente->id;

    $cliente->delete();

    return response()->json([
      'message' => 'Cliente excluído com sucesso',
      'id_excluido' => $codigoExcluido
    ], 200);
  }
}

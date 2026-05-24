<?php

namespace App\Http\Controllers;

use App\Models\Barbeiro;
use Illuminate\Http\Request;
use App\Interfaces\BarbeiroControllerInterface;

class BarbeiroController extends Controller implements BarbeiroControllerInterface {
  /**
   * @inheritdoc
   */
  public function index() {
    return response()->json(Barbeiro::all());
  }

  /**
   * @inheritdoc
   */
  public function store(Request $request) {
    $barbeiro = Barbeiro::create($request->all());
    return response()->json($barbeiro, 201);
  }

  /**
   * @inheritdoc
   */
  public function show($id) {
    $barbeiro = Barbeiro::find($id);
    return $barbeiro ? response()->json($barbeiro) : response()->json(['erro' => 'Barbeiro não encontrado'], 404);
  }

  /**
   * @inheritdoc
   */
  public function update(Request $request, $id) {
    $barbeiro = Barbeiro::find($id);
    if (!$barbeiro) {
      return response()->json(['erro' => 'Barbeiro não encontrado'], 404);
    }

    $barbeiro->update($request->all());
    return response()->json($barbeiro);
  }

  /**
   * @inheritdoc
   */
  public function destroy($id) {
    $barbeiro = Barbeiro::find($id);

    if (!$barbeiro) {
      return response()->json([
        'message' => 'Barbeiro não encontrado'
      ], 404);
    }

    $codigoExcluido = $barbeiro->id;
    $barbeiro->delete();

    return response()->json([
      'message' => 'Barbeiro removido com sucesso',
      'id_excluido' => $codigoExcluido
    ], 200);
  }
}

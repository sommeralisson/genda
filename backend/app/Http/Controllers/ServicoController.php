<?php

namespace App\Http\Controllers;

use App\Models\Servico;
use Illuminate\Http\Request;
use App\Interfaces\ServicoControllerInterface;

class ServicoController extends Controller implements ServicoControllerInterface {
  /**
   * @inheritdoc
   */
  public function index() {
    return response()->json(Servico::all());
  }

  /**
   * @inheritdoc
   */
  public function store(Request $request) {
    $servico = Servico::create($request->all());
    return response()->json($servico, 201);
  }

  /**
   * @inheritdoc
   */
  public function show($id) {
    $servico = Servico::find($id);
    return $servico ? response()->json($servico) : response()->json(['erro' => 'Serviço não encontrado'], 404);
  }

  /**
   * @inheritdoc
   */
  public function update(Request $request, $id) {
    $servico = Servico::find($id);

    if (!$servico) {
      return response()->json(['erro' => 'Serviço não encontrado'], 404);
    }

    $servico->update($request->all());
    return response()->json($servico);
  }

  /**
   * @inheritdoc
   */
  public function destroy($id) {
    $servico = Servico::find($id);

    if ($servico->agendamentos()->exists()) {
      return response()->json([
        'erro' => 'Vínculo encontrado',
        'message' => 'Não é possível excluir este serviço porque ele está incluso em agendamentos existentes.'
      ], 422);
    }

    if (!$servico) {
      return response()->json([
        'message' => 'Serviço não encontrado'
      ], 404);
    }

    $codigoExcluido = $servico->id;
    $servico->delete();

    return response()->json([
      'message' => 'Serviço removido com sucesso',
      'id_excluido' => $codigoExcluido
    ], 200);
  }
}

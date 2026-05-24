<?php

namespace App\Http\Controllers;

use App\Models\Agendamento;
use Illuminate\Http\Request;
use App\Interfaces\AgendamentoControllerInterface;

class AgendamentoController extends Controller implements AgendamentoControllerInterface {
  /**
   * @inheritdoc
   */
  public function index() {
    return response()->json(Agendamento::all());
  }

  /**
   * @inheritdoc
   */
  public function store(Request $request) {
    $request->validate([
      'cliente_id'  => 'required|exists:clientes,id',
      'barbeiro_id' => 'required|exists:barbeiros,id',
      'data_hora'   => 'required|date_format:Y-m-d H:i:s|after:now',
      'servicos'    => 'required|array',
      'servicos.*'  => 'exists:servicos,id'
    ]);

    $inicioNovo = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $request->data_hora);
    $minutosTotais = (int) \App\Models\Servico::whereIn('id', $request->servicos)->sum('duracao_minutos');
    $terminoNovo = $inicioNovo->copy()->addMinutes($minutosTotais);

    $agendamentosConflitantes = Agendamento::where('barbeiro_id', $request->barbeiro_id)
      ->whereDate('data_hora', $inicioNovo->toDateString())
      ->get();

    foreach ($agendamentosConflitantes as $existente) {
      $inicioExistente = \Carbon\Carbon::parse($existente->data_hora);
      $minutosExistente = (int) $existente->servicos()->sum('duracao_minutos');
      $terminoExistente = $inicioExistente->copy()->addMinutes($minutosExistente);

      if ($inicioNovo->lessThan($terminoExistente) && $terminoNovo->greaterThan($inicioExistente)) {
        return response()->json([
          'erro' => 'Conflito de agenda',
          'mensagem' => "O barbeiro já possui um agendamento das {$inicioExistente->format('H:i')} até as {$terminoExistente->format('H:i')}."
        ], 422);
      }
    }

    $clienteOcupado = Agendamento::where('cliente_id', $request->cliente_id)
    ->whereDate('data_hora', $inicioNovo->toDateString())
    ->get();

    foreach ($clienteOcupado as $existente) {
      $inicioExistente = \Carbon\Carbon::parse($existente->data_hora);
      $minutosExistente = (int) $existente->servicos()->sum('duracao_minutos');
      $terminoExistente = $inicioExistente->copy()->addMinutes($minutosExistente);

      if ($inicioNovo->lessThan($terminoExistente) && $terminoNovo->greaterThan($inicioExistente)) {
        return response()->json([
          'erro' => 'Conflito de agenda do cliente',
          'mensagem' => 'Você já possui outro agendamento marcado para este mesmo horário.'
        ], 422);
      }
    }

    $agendamento = Agendamento::create($request->only(['cliente_id', 'barbeiro_id', 'data_hora']));
    $agendamento->servicos()->attach($request->servicos);

    return response()->json($agendamento->load('servicos'), 201);
  }

  /**
   * @inheritdoc
   */
  public function show($id) {
    $agendamento = Agendamento::find($id);
    return $agendamento ? response()->json($agendamento) : response()->json(['erro' => 'Agendamento não encontrado'], 404);
  }

  /**
   * @inheritdoc
   */
  public function update(Request $request, $id) {
    $agendamento = Agendamento::find($id);
    if (!$agendamento) {
      return response()->json(['erro' => 'Agendamento não encontrado'], 404);
    }

    $request->validate([
      'cliente_id'  => 'sometimes|exists:clientes,id',
      'barbeiro_id' => 'sometimes|exists:barbeiros,id',
      'data_hora'   => 'sometimes|date_format:Y-m-d H:i:s|after:now',
      'servicos'    => 'sometimes|array',
      'servicos.*'  => 'exists:servicos,id'
    ]);

    $barbeiroId  = $request->input('barbeiro_id', $agendamento->barbeiro_id);
    $clienteId   = $request->input('cliente_id', $agendamento->cliente_id);
    $dataHoraRaw = $request->input('data_hora', $agendamento->data_hora);

    $inicioNovo  = \Carbon\Carbon::parse($dataHoraRaw);

    if ($request->has('servicos')) {
      $minutosTotais = (int) \App\Models\Servico::whereIn('id', $request->servicos)->sum('duracao_minutos');
    } else {
      $minutosTotais = (int) $agendamento->servicos()->sum('duracao_minutos');
    }

    $terminoNovo = $inicioNovo->copy()->addMinutes($minutosTotais);

    $conflitosBarbeiro = Agendamento::where('barbeiro_id', $barbeiroId)
      ->where('id', '!=', $id)
      ->whereDate('data_hora', $inicioNovo->toDateString())
      ->get();

    foreach ($conflitosBarbeiro as $existente) {
      $inicioExistente = \Carbon\Carbon::parse($existente->data_hora);
      $minutosExistente = (int) $existente->servicos()->sum('duracao_minutos');
      $terminoExistente = $inicioExistente->copy()->addMinutes($minutosExistente);

      if ($inicioNovo->lessThan($terminoExistente) && $terminoNovo->greaterThan($inicioExistente)) {
        return response()->json([
          'erro' => 'Conflito de agenda do barbeiro',
          'mensagem' => "O barbeiro selecionado já possui um agendamento das {$inicioExistente->format('H:i')} até as {$terminoExistente->format('H:i')}."
        ], 422);
      }
    }

    $conflitosCliente = Agendamento::where('cliente_id', $clienteId)
      ->where('id', '!=', $id)
      ->whereDate('data_hora', $inicioNovo->toDateString())
      ->get();

    foreach ($conflitosCliente as $existente) {
      $inicioExistente = \Carbon\Carbon::parse($existente->data_hora);
      $minutosExistente = (int) $existente->servicos()->sum('duracao_minutos');
      $terminoExistente = $inicioExistente->copy()->addMinutes($minutosExistente);

      if ($inicioNovo->lessThan($terminoExistente) && $terminoNovo->greaterThan($inicioExistente)) {
        return response()->json([
          'erro' => 'Conflito de agenda do cliente',
          'mensagem' => "O cliente já possui outro agendamento marcado das {$inicioExistente->format('H:i')} até as {$terminoExistente->format('H:i')}."
        ], 422);
      }
    }

    $agendamento->update($request->only(['cliente_id', 'barbeiro_id', 'data_hora']));

    if ($request->has('servicos')) {
      $agendamento->servicos()->sync($request->servicos);
    }

    return response()->json($agendamento->load('servicos'));
  }

  /**
   * @inheritdoc
   */
  public function destroy($id) {
    $agendamento = Agendamento::find($id);

    if (!$agendamento) {
      return response()->json(['erro' => 'Agendamento não encontrado'], 404);
    }

    $horarioAgendamento = \Carbon\Carbon::parse($agendamento->data_hora);

    if (\Carbon\Carbon::now()->diffInHours($horarioAgendamento, false) < 2) {
      return response()->json([
        'erro' => 'Prazo esgotado',
        'mensagem' => 'Agendamentos só podem ser cancelados com no mínimo 2 horas de antecedência.'
      ], 422);
    }

    $agendamento->delete();
    return response()->json(['mensagem' => 'Agendamento cancelado com sucesso.']);
  }

  /**
   * @inheritdoc
   */
  public function horariosDisponiveis(Request $request) {
    $request->validate([
      'barbeiro_id' => 'required|exists:barbeiros,id',
      'data' => 'required|date_format:Y-m-d',
      'servicos' => 'required|array',
      'servicos.*' => 'exists:servicos,id'
    ]);

    $abertura = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $request->data . ' 08:00:00');
    $fechamento = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $request->data . ' 18:00:00');
    $duracaoNecessaria = (int) \App\Models\Servico::whereIn('id', $request->servicos)->sum('duracao_minutos');

    $agendamentosDoDia = Agendamento::where('barbeiro_id', $request->barbeiro_id)
      ->whereDate('data_hora', $request->data)
      ->get()
      ->map(function ($agendamento) {
        $inicio = \Carbon\Carbon::parse($agendamento->data_hora);
        $duracao = (int) $agendamento->servicos()->sum('duracao_minutos');
        return [
          'inicio'  => $inicio,
          'termino' => $inicio->copy()->addMinutes($duracao)
        ];
      });

    $horariosLivres = [];
    $ponteiroTempo = $abertura->copy();

    while ($ponteiroTempo->copy()->addMinutes($duracaoNecessaria)->lessThanOrEqualTo($fechamento)) {
      $inicioProposto = $ponteiroTempo->copy();
      $terminoProposto = $inicioProposto->copy()->addMinutes($duracaoNecessaria);
      $colidiu = false;

      $horaAlmoçoInicio = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $request->data . ' 12:00:00');
      $horaAlmoçoFim = \Carbon\Carbon::createFromFormat('Y-m-d H:i:s', $request->data . ' 13:30:00');

      if ($inicioProposto->lessThan($horaAlmoçoFim) && $terminoProposto->greaterThan($horaAlmoçoInicio)) {
        $colidiu = true;
      }

      foreach ($agendamentosDoDia as $agendamento) {
        if ($inicioProposto->lessThan($agendamento['termino']) && $terminoProposto->greaterThan($agendamento['inicio'])) {
          $colidiu = true;
          break;
        }
      }

      if (!$colidiu) {
        $horariosLivres[] = $inicioProposto->format('H:i');
      }

      $ponteiroTempo->addMinutes(30);
    }

    return response()->json($horariosLivres);
  }
}

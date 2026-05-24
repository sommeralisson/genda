<?php

namespace App\Interfaces;

use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Agendamentos", description: "Gerenciamento da agenda de horários")]
interface AgendamentoControllerInterface {
  /**
   * Método responsável por listar toda a agenda de marcações da barbearia.
   *
   * @return \Illuminate\Http\JsonResponse Retorna uma coleção JSON contendo todos os agendamentos registrados.
   */
  #[OA\Get(path: '/agendamentos', summary: 'Listar toda a agenda da barbearia', tags: ['Agendamentos'])]
  #[OA\Response(response: 200, description: 'Lista de agendamentos retornada com sucesso')]
  public function index();

  /**
   * Método responsável por criar e reservar um novo agendamento de horário no sistema.
   *
   * @param \Illuminate\Http\Request $request Objeto contendo as chaves estrangeiras (cliente_id, barbeiro_id, servico_id) e o timestamp (data_hora).
   * @return \Illuminate\Http\JsonResponse Retorna o objeto JSON do agendamento concluído com sucesso.
   */
  #[OA\Post(path: '/agendamentos', summary: 'Criar um novo agendamento de horário', tags: ['Agendamentos'])]
  #[OA\RequestBody(
    required: true,
    content: new OA\JsonContent(
      required: ["cliente_id", "barbeiro_id", "servico_id", "data_hora"],
      properties: [
        new OA\Property(property: "cliente_id", type: "integer", example: 1),
        new OA\Property(property: "barbeiro_id", type: "integer", example: 1),
        new OA\Property(property: "servicos", type: "array", items: new OA\Items(type: "integer"), example: [1, 3]),
        new OA\Property(property: "data_hora", type: "string", format: "date-time", example: "2026-06-15 14:30:00")
      ]
    )
  )]
  #[OA\Response(response: 201, description: 'Agendamento realizado com sucesso')]
  public function store(Request $request);

  /**
   * Método responsável por consultar e exibir os detalhes específicos de um agendamento por meio de seu ID.
   *
   * @param int $id Código numérico exclusivo do agendamento.
   * @return \Illuminate\Http\JsonResponse Retorna o JSON do agendamento localizado ou uma mensagem de erro 404.
   */
  #[OA\Get(path: '/agendamentos/{id}', summary: 'Consultar detalhes de um agendamento específico', tags: ['Agendamentos'])]
  #[OA\Parameter(name: 'id', in: 'path', description: 'ID do agendamento', required: true, schema: new OA\Schema(type: 'integer'))]
  #[OA\Response(response: 200, description: 'Dados do agendamento retornados')]
  #[OA\Response(response: 404, description: 'Agendamento não encontrado')]
  public function show($id);

  /**
   * Método responsável por remarcar a data/hora ou alterar o profissional associado a um agendamento existente.
   *
   * @param \Illuminate\Http\Request $request Objeto contendo os novos dados para modificação parcial.
   * @param int $id Código numérico exclusivo do agendamento a ser alterado.
   * @return \Illuminate\Http\JsonResponse Retorna o objeto JSON do agendamento já atualizado.
   */
  #[OA\Patch(path: '/agendamentos/{id}', summary: 'Remarcar data ou alterar dados do agendamento', tags: ['Agendamentos'])]
  #[OA\Parameter(name: 'id', in: 'path', description: 'ID do agendamento', required: true, schema: new OA\Schema(type: 'integer'))]
  #[OA\RequestBody(
    required: true,
    content: new OA\JsonContent(
      properties: [
        new OA\Property(property: "data_hora", type: "string", format: "date-time", example: "2026-06-15 16:00:00"),
        new OA\Property(property: "barbeiro_id", type: "integer", example: 2)
      ]
    )
  )]
  #[OA\Response(response: 200, description: 'Horário reagendado com sucesso')]
  #[OA\Response(response: 404, description: 'Agendamento não encontrado')]
  public function update(Request $request, $id);

  /**
   * Método responsável por cancelar e remover permanentemente um horário agendado do sistema.
   *
   * @param int $id Código numérico do agendamento que será cancelado.
   * @return \Illuminate\Http\JsonResponse Retorna a confirmação com o ID do agendamento cancelado ou erro 404.
   */
  #[OA\Delete(path: '/agendamentos/{id}', summary: 'Cancelar um agendamento', tags: ['Agendamentos'])]
  #[OA\Parameter(name: 'id', in: 'path', description: 'ID do agendamento a ser cancelado', required: true, schema: new OA\Schema(type: 'integer'))]
  #[OA\Response(response: 200, description: 'Agendamento cancelado com sucesso')]
  #[OA\Response(response: 404, description: 'Agendamento não encontrado')]
  public function destroy($id);

  /**
   * Método responsável por calcular e retornar os horários disponíveis de um barbeiro em uma data específica.
   *
   * @param \Illuminate\Http\Request $request Dados contendo barbeiro_id, data (YYYY-MM-DD) e o array de servicos.
   * @return \Illuminate\Http\JsonResponse Lista de horários livres em formato HH:mm.
   */
  #[OA\Get(path: '/agendamentos/disponibilidade', summary: 'Consultar horários disponíveis de um barbeiro', tags: ['Agendamentos'])]
  #[OA\Parameter(name: 'barbeiro_id', in: 'query', required: true, schema: new OA\Schema(type: 'integer'))]
  #[OA\Parameter(name: 'data', in: 'query', description: 'Formato YYYY-MM-DD', required: true, schema: new OA\Schema(type: 'string'))]
  #[OA\Parameter(name: 'servicos[]', in: 'query', description: 'Array de IDs dos serviços ex: servicos[]=1&servicos[]=2', required: true, style: 'form', explode: true, schema: new OA\Schema(type: 'array', items: new OA\Items(type: 'integer')))]
  #[OA\Response(response: 200, description: 'Lista de horários livres retornada')]
  public function horariosDisponiveis(Request $request);

}

<?php

namespace App\Interfaces;

use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Barbeiros", description: "Gerenciamento de profissionais/barbeiros")]
interface BarbeiroControllerInterface {
  /**
   * Método responsável por listar todos os barbeiros cadastrados no estabelecimento.
   *
   * @return \Illuminate\Http\JsonResponse Retorna uma coleção JSON com a lista de profissionais.
   */
  #[OA\Get(path: '/barbeiros', summary: 'Listar todos os barbeiros', tags: ['Barbeiros'])]
  #[OA\Response(response: 200, description: 'Lista de barbeiros retornada com sucesso')]
  public function index();

  /**
   * Método responsável por cadastrar e persistir um novo barbeiro/profissional no sistema.
   *
   * @param \Illuminate\Http\Request $request Objeto contendo os dados da requisição (nome, especialidade).
   * @return \Illuminate\Http\JsonResponse Retorna o objeto JSON do barbeiro recém-criado.
   */
  #[OA\Post(path: '/barbeiros', summary: 'Cadastrar novo barbeiro', tags: ['Barbeiros'])]
  #[OA\RequestBody(
    required: true,
    content: new OA\JsonContent(
      required: ["nome", "especialidade"],
      properties: [
        new OA\Property(property: "nome", type: "string", example: "Navalha de Ouro")
      ]
    )
  )]
  #[OA\Response(response: 201, description: 'Barbeiro cadastrado com sucesso')]
  public function store(Request $request);

  /**
   * Método responsável por buscar e exibir os dados de um barbeiro específico por meio de seu ID.
   *
   * @param int $id Código numérico exclusivo do barbeiro.
   * @return \Illuminate\Http\JsonResponse Retorna o JSON do barbeiro encontrado ou uma mensagem de erro 404.
   */
  #[OA\Get(path: '/barbeiros/{id}', summary: 'Obter dados de um barbeiro específico', tags: ['Barbeiros'])]
  #[OA\Parameter(name: 'id', in: 'path', description: 'ID numérico do barbeiro', required: true, schema: new OA\Schema(type: 'integer'))]
  #[OA\Response(response: 200, description: 'Dados do barbeiro retornados com sucesso')]
  #[OA\Response(response: 404, description: 'Barbeiro não encontrado')]
  public function show($id);

  /**
   * Método responsável por atualizar a especialidade ou outros dados cadastrais de um barbeiro existente.
   *
   * @param \Illuminate\Http\Request $request Objeto contendo os novos dados a serem salvos.
   * @param int $id Código numérico exclusivo do barbeiro que sofrerá as atualizações.
   * @return \Illuminate\Http\JsonResponse Retorna o objeto JSON do profissional com os dados atualizados.
   */
  #[OA\Patch(path: '/barbeiros/{id}', summary: 'Atualizar dados de um barbeiro', tags: ['Barbeiros'])]
  #[OA\Parameter(name: 'id', in: 'path', description: 'ID numérico do barbeiro', required: true, schema: new OA\Schema(type: 'integer'))]
  #[OA\RequestBody(
    required: true,
    content: new OA\JsonContent(
      properties: [
        new OA\Property(property: "especialidade", type: "string", example: "Especialista em Degradê e Progressiva")
      ]
    )
  )]
  #[OA\Response(response: 200, description: 'Barbeiro atualizado com sucesso')]
  #[OA\Response(response: 404, description: 'Barbeiro não encontrado')]
  public function update(Request $request, $id);

  /**
   * Método responsável por remover permanentemente um barbeiro do banco de dados do sistema.
   *
   * @param int $id Código numérico do barbeiro a ser excluído.
   * @return \Illuminate\Http\JsonResponse Retorna a confirmação de exclusão contendo o ID removido ou erro 404.
   */
  #[OA\Delete(path: '/barbeiros/{id}', summary: 'Excluir um barbeiro', tags: ['Barbeiros'])]
  #[OA\Parameter(name: 'id', in: 'path', description: 'ID numérico do barbeiro a ser excluído', required: true, schema: new OA\Schema(type: 'integer'))]
  #[OA\Response(response: 200, description: 'Barbeiro removido com sucesso')]
  #[OA\Response(response: 404, description: 'Barbeiro não encontrado')]
  public function destroy($id);
}
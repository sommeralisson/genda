<?php

namespace App\Interfaces;

use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Clientes", description: "Gerenciamento de clientes da barbearia")]
interface ClienteControllerInterface {
  /**
   * Método responsável por listar todos os clientes cadastrados na base de dados.
   *
   * @return \Illuminate\Http\JsonResponse Retorna uma coleção JSON com todos os clientes.
   */
  #[OA\Get(path: '/clientes', summary: 'Listar todos os clientes', tags: ['Clientes'])]
  #[OA\Response(response: 200, description: 'Lista de clientes retornada com sucesso')]
  public function index();

  /**
   * Método responsável por criar e persistir um novo cliente no sistema.
   *
   * @param \Illuminate\Http\Request $request Objeto contendo os dados da requisição (nome, telefone, email).
   * @return \Illuminate\Http\JsonResponse Retorna o objeto JSON do cliente recém-criado.
   */
  #[OA\Post(path: '/clientes', summary: 'Cadastrar novo cliente', tags: ['Clientes'])]
  #[OA\RequestBody(
    required: true,
    content: new OA\JsonContent(
      required: ["nome", "telefone", "email"],
      properties: [
        new OA\Property(property: "nome", type: "string", example: "Alisson Sommer"),
        new OA\Property(property: "telefone", type: "string", example: "47999998888"),
        new OA\Property(property: "email", type: "string", example: "alisson@email.com")
      ]
    )
  )]
  #[OA\Response(response: 201, description: 'Cliente cadastrado com sucesso')]
  public function store(Request $request);

  /**
   * Método responsável por buscar e exibir os detalhes de um cliente específico através do seu código identificador.
   *
   * @param int $id Código numérico exclusivo do cliente.
   * @return \Illuminate\Http\JsonResponse Retorna o JSON do cliente encontrado ou uma mensagem de erro 404.
   */
  #[OA\Get(path: '/clientes/{id}', summary: 'Obter dados de um cliente específico', tags: ['Clientes'])]
  #[OA\Parameter(name: 'id', in: 'path', description: 'ID numérico do cliente', required: true, schema: new OA\Schema(type: 'integer'))]
  #[OA\Response(response: 200, description: 'Dados do cliente retornados com sucesso')]
  #[OA\Response(response: 404, description: 'Cliente não encontrado')]
  public function show($id);

  /**
   * Método responsável por atualizar de forma parcial ou total os dados cadastrais de um cliente existente.
   *
   * @param \Illuminate\Http\Request $request Objeto contendo os campos a serem modificados.
   * @param int $id Código numérico exclusivo do cliente que sofrerá a alteração.
   * @return \Illuminate\Http\JsonResponse Retorna o objeto JSON do cliente com as informações já atualizadas.
   */
  #[OA\Patch(path: '/clientes/{id}', summary: 'Atualizar dados de um cliente', tags: ['Clientes'])]
  #[OA\Parameter(name: 'id', in: 'path', description: 'ID numérico do cliente', required: true, schema: new OA\Schema(type: 'integer'))]
  #[OA\RequestBody(
    required: true,
    content: new OA\JsonContent(
      properties: [
        new OA\Property(property: "nome", type: "string", example: "Alisson S. Mudado"),
        new OA\Property(property: "telefone", type: "string", example: "47988887777")
      ]
    )
  )]
  #[OA\Response(response: 200, description: 'Cliente atualizado com sucesso')]
  #[OA\Response(response: 404, description: 'Cliente não encontrado')]
  public function update(Request $request, $id);

  /**
   * Método responsável por remover definitivamente um cliente do banco de dados e retornar a confirmação do código excluído.
   *
   * @param int $id Código numérico exclusivo do cliente a ser removido.
   * @return \Illuminate\Http\JsonResponse Retorna um JSON de sucesso contendo o ID do registro que foi apagado.
   */
  #[OA\Delete(path: '/clientes/{id}', summary: 'Excluir um cliente do sistema', tags: ['Clientes'])]
  #[OA\Parameter(name: 'id', in: 'path', description: 'ID numérico do cliente a ser excluído', required: true, schema: new OA\Schema(type: 'integer'))]
  #[OA\Response(response: 200, description: 'Cliente excluído com sucesso e ID retornado')]
  #[OA\Response(response: 404, description: 'Cliente não encontrado')]
  public function destroy($id);
}
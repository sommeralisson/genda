<?php

namespace App\Interfaces;

use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

#[OA\Tag(name: "Serviços", description: "Gerenciamento do catálogo de serviços e preços")]
interface ServicoControllerInterface {
  /**
   * Método responsável por listar todo o catálogo de serviços cadastrados na barbearia.
   *
   * @return \Illuminate\Http\JsonResponse Retorna uma coleção JSON com todos os serviços e preços.
   */
  #[OA\Get(path: '/servicos', summary: 'Listar catálogo de serviços', tags: ['Serviços'])]
  #[OA\Response(response: 200, description: 'Lista de serviços retornada com sucesso')]
  public function index();

  /**
   * Método responsável por adicionar e persistir um novo serviço ao catálogo da barbearia.
   *
   * @param \Illuminate\Http\Request $request Objeto contendo os dados da requisição (nome, preco, duracao_minutos).
   * @return \Illuminate\Http\JsonResponse Retorna o objeto JSON do serviço recém-criado.
   */
  #[OA\Post(path: '/servicos', summary: 'Adicionar novo serviço ao catálogo', tags: ['Serviços'])]
  #[OA\RequestBody(
    required: true,
    content: new OA\JsonContent(
      required: ["nome", "preco", "duracao_minutos"],
      properties: [
        new OA\Property(property: "nome", type: "string", example: "Corte Social + Barba completíssimo"),
        new OA\Property(property: "preco", type: "number", format: "float", example: 65.50),
        new OA\Property(property: "duracao_minutos", type: "integer", example: 45)
      ]
    )
  )]
  #[OA\Response(response: 201, description: 'Serviço adicionado com sucesso')]
  public function store(Request $request);

  /**
   * Método responsável por obter e exibir os detalhes de um serviço específico através do seu código identificador.
   *
   * @param int $id Código numérico exclusivo do serviço.
   * @return \Illuminate\Http\JsonResponse Retorna o JSON do serviço encontrado ou uma mensagem de erro 404.
   */
  #[OA\Get(path: '/servicos/{id}', summary: 'Obter detalhes de um serviço específico', tags: ['Serviços'])]
  #[OA\Parameter(name: 'id', in: 'path', description: 'ID numérico do serviço', required: true, schema: new OA\Schema(type: 'integer'))]
  #[OA\Response(response: 200, description: 'Detalhes do serviço retornados')]
  #[OA\Response(response: 404, description: 'Serviço não encontrado')]
  public function show($id);

  /**
   * Método responsável por atualizar o preço ou outros dados cadastrais de um serviço existente no catálogo.
   *
   * @param \Illuminate\Http\Request $request Objeto contendo as alterações (como um novo preço).
   * @param int $id Código numérico exclusivo do serviço que será modificado.
   * @return \Illuminate\Http\JsonResponse Retorna o objeto JSON do serviço com as informações atualizadas.
   */
  #[OA\Patch(path: '/servicos/{id}', summary: 'Atualizar preço ou dados do serviço', tags: ['Serviços'])]
  #[OA\Parameter(name: 'id', in: 'path', description: 'ID numérico do serviço', required: true, schema: new OA\Schema(type: 'integer'))]
  #[OA\RequestBody(
    required: true,
    content: new OA\JsonContent(
      properties: [
        new OA\Property(property: "preco", type: "number", format: "float", example: 70.00)
      ]
    )
  )]
  #[OA\Response(response: 200, description: 'Serviço updated com sucesso')]
  #[OA\Response(response: 404, description: 'Serviço não encontrado')]
  public function update(Request $request, $id);

  /**
   * Método responsável por remover definitivamente um serviço do catálogo do sistema.
   *
   * @param int $id Código numérico do serviço a ser removido.
   * @return \Illuminate\Http\JsonResponse Retorna a confirmação de exclusão ou erro 404 caso não exista.
   */
  #[OA\Delete(path: '/servicos/{id}', summary: 'Remover um serviço do catálogo', tags: ['Serviços'])]
  #[OA\Parameter(name: 'id', in: 'path', description: 'ID do serviço a ser removido', required: true, schema: new OA\Schema(type: 'integer'))]
  #[OA\Response(response: 200, description: 'Serviço removido com sucesso')]
  #[OA\Response(response: 404, description: 'Serviço não encontrado')]
  public function destroy($id);
}
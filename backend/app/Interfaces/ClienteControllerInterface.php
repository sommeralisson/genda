<?php

namespace App\Interfaces;

use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

// =========================================================================
// CONFIGURAÇÕES GLOBAIS OBRIGATÓRIAS DO SWAGGER
// =========================================================================
#[OA\Info(title: "API Barbearia", version: "1.0.0", description: "Documentacao dos endpoints da barbearia")]
#[OA\Server(url: "http://localhost:8000/api", description: "Servidor Local")]

// =========================================================================
// ROTAS DA ENTIDADE DE CLIENTES
// =========================================================================
#[OA\Tag(name: "Clientes", description: "Gerenciamento de Clientes da Barbearia")]
interface ClienteControllerInterface
{
  #[OA\Get(path: '/clientes', summary: 'Listar todos os clientes', tags: ['Clientes'])]
  #[OA\Response(response: 200, description: 'Sucesso')]
  public function index();

  #[OA\Post(path: '/clientes', summary: 'Cadastrar novo cliente', tags: ['Clientes'])]
  #[OA\Response(response: 201, description: 'Criado com sucesso')]
  public function store(Request $request);

  #[OA\Get(path: '/show', summary: 'Listar um cliente', tags: ['Clientes'])]
  #[OA\Response(response: 200, description: 'Cliente consultado com sucesso')]
  public function show($id);

  #[OA\Patch(path: '/update', summary: 'Atualizar um cliente', tags: ['Clientes'])]
  #[OA\Response(response: 201, description: 'Atualizado com sucesso')]
  public function update(Request $request, $id);

  #[OA\Delete(path: '/destroy', summary: 'Excluir um cliente', tags: ['Clientes'])]
  #[OA\Response(response: 201, description: 'Excluído com sucesso')]
  public function destroy($id);
}

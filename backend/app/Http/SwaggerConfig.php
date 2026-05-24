<?php

namespace App\Http;

use OpenApi\Attributes as OA;

// CONFIGURAÇÕES GLOBAIS OBRIGATÓRIAS DO SWAGGER
#[OA\Info(
  title: "API Barbearia",
  version: "1.0.0",
  description: "Documentação dos endpoints da barbearia desenvolvida em Laravel 11"
)]

#[OA\Server(
  url: "http://localhost:8000/api",
  description: "Servidor Local (Docker)"
)]
class SwaggerConfig {}
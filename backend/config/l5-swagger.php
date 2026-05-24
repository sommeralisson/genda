<?php

return [
  'default' => 'default',
  'documentations' => [
    'default' => [
      'api' => [
        'title' => 'L5 Swagger UI',
      ],
      'routes' => [
        'api' => 'api/documentation',
      ],
      'paths' => [
        'use_absolute_path' => env('L5_SWAGGER_USE_ABSOLUTE_PATH', true),
        'annotations' => [
          base_path('app'),
        ],
        'views' => base_path('resources/views/vendor/l5-swagger'),
        'base' => env('L5_SWAGGER_BASE_PATH', null),
        'excludes' => [],
      ],
    ],
  ],
  'defaults' => [
    'routes' => [
      'docs' => 'docs',
      'oauth2_callback' => 'api/oauth2-callback.html',
    ],
    'paths' => [
      'docs' => storage_path('api-docs'),
      'docs_json' => 'api-docs.json',
      'docs_yaml' => 'api-docs.yaml',
      'format_to_use' => env('L5_FORMAT_TO_USE', 'json'),
      'annotations' => [
        base_path('app'),
      ],
    ],
    'scanOptions' => [
      'analyzer' => 'pattern',
      'analysis' => null,
      'processors' => [],
    ],
    'securityDefinitions' => [
      'securitySchemes' => [],
      'security' => [],
    ],
    'generate_always' => env('L5_SWAGGER_GENERATE_ALWAYS', false),
    'generate_swagger_ui' => true,
    'proxy' => false,
    'additional_config_vars' => [],
    'ui' => [
      'display' => [
        'doc_expansion' => env('L5_SWAGGER_UI_DOC_EXPANSION', 'none'),
        'filter' => env('L5_SWAGGER_UI_FILTERS', true),
      ],
      'authorization' => [
        'persist_authorization' => env('L5_SWAGGER_UI_PERSIST_AUTHORIZATION', false),
        'oauth2' => [
          'use_pkce_with_authorization_code_grant' => false,
        ],
      ],
    ],
    'operations_sort' => env('L5_SWAGGER_OPERATIONS_SORT', null),
    'validator_url' => null,
    'additional_config_url' => null,
  ],
];

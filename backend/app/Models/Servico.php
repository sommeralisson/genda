<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Servico extends Model {
  protected $fillable = ['nome', 'preco', 'duracao_minutos'];

  protected $casts = [
    'duracao_minutos' => 'integer',
    'preco' => 'float'
  ];

  public function agendamentos() {
    return $this->belongsToMany(Agendamento::class, 'agendamento_servico')->withTimestamps();
  }
}

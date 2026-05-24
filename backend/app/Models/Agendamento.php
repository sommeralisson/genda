<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agendamento extends Model {
  protected $fillable = ['cliente_id', 'barbeiro_id', 'servico_id', 'data_hora'];

  public function cliente() {
    return $this->belongsTo(Cliente::class);
  }

  public function barbeiro() {
    return $this->belongsTo(Barbeiro::class);
  }

  public function servicos() {
    return $this->belongsToMany(Servico::class, 'agendamento_servico')->withTimestamps();
  }
}

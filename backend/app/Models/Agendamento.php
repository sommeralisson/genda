<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Agendamento extends Model
{
  protected $fillable = ['cliente_id', 'barbeiro_id', 'servico_id', 'data_hora', 'status'];

  public function cliente()
  {
    return $this->belongsTo(Cliente::class);
  }
  public function barbeiro()
  {
    return $this->belongsTo(Barbeiro::class);
  }
  public function servico()
  {
    return $this->belongsTo(Servico::class);
  }
}

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
      Schema::create('agendamento_servico', function (Blueprint $table) {
        $table->id();
        $table->foreignId('agendamento_id')->constrained('agendamentos')->onDelete('cascade');
        $table->foreignId('servico_id')->constrained('servicos')->onDelete('restrict');
        $table->timestamps();
      });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('agendamento_servico');
    }
};

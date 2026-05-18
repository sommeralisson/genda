<?php

namespace App\Http\Controllers;

use App\Models\Barbeiro;
use Illuminate\Http\Request;

class BarbeiroController extends Controller
{
  public function index()
  {
    return response()->json(Barbeiro::all());
  }

  public function store(Request $request)
  {
    $barbeiro = Barbeiro::create($request->all());
    return response()->json($barbeiro, 201);
  }

  public function show($id)
  {
    $barbeiro = Barbeiro::find($id);
    return $barbeiro ? response()->json($barbeiro) : response()->json(['erro' => 'Barbeiro não encontrado'], 404);
  }

  public function destroy($id)
  {
    Barbeiro::destroy($id);
    return response()->json(null, 204);
  }
}

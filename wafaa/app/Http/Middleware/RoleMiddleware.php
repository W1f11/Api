<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role): Response
    {
        //je vérifie est ce que l'utilisateur est connecté
        if(!$request->user()){
            return response()->json(['message' => 'Non authentifié']);
        }
         //je vérifie le rôle

        $userRole = $request->user()->role;

        // Corriger l'ancienne orthographe "employe"
        if ($userRole === 'employe') {
            $userRole = 'employer';
        }

        // Vérifier si le rôle correspond exactement
        if ($userRole !== $role) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }



        return $next($request);
    }
}

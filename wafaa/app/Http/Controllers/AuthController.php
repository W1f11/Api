<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Http\Request;


/**
 * @OA\Info(
 *     title="Wafaa API Documentation",
 *     version="1.0.0",
 *     description="API documentation for Wafaa job portal application"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="bearerAuth",
 *     type="http",
 *     description="Utilisez un jeton Bearer pour vous authentifier",
 *     name="bearerAuth",
 *     in="header",
 *     scheme="bearer",
 *     bearerFormat="JWT"
 * )
 *
 * @OA\SecurityScheme(
 *     securityScheme="sanctum",
 *     type="apiKey",
 *     description="Entrez le token au format: Bearer {token}",
 *     name="Authorization",
 *     in="header"
 * )
 */

class AuthController extends Controller
{
    /**
     * @OA\Post(
     *     path="/api/register",
     *     summary="Inscription utilisateur",
     *     tags={"Authentification"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name","email","password","password_confirmation"},
     *             @OA\Property(property="name", type="string", example="Wafaa"),
     *             @OA\Property(property="email", type="string", example="wafaa@gmail.com"),
     *             @OA\Property(property="password", type="string", example="wafaaessalhi"),
     *             @OA\Property(property="password_confirmation", type="string", example="wafaaessalhi")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Inscription réussie")
     * )
     */



    public function register(Request $request){
        // ici je valide les données d'inscription 
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|confirmed',
            // standardized role values: user, employer, admin
            'role' => 'nullable|string|in:user,employer,admin'
        ]);
        //maitenant je crée l'utilisateur
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'user'

        ]);

        //je crée un token d'authentification pour l'utilisateur
        $token = $user->createToken('Api Token')->plainTextToken;
        return response()->json ([
            'message' => 'Inscription réussie',
            'token' => $token

        ]);

    }


    /**
     * @OA\Post(
     *     path="/api/login",
     *     summary="Connexion utilisateur",
     *     tags={"Authentification"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"email","password"},
     *             @OA\Property(property="email", type="string", example="wafaa@gmail.com"),
     *             @OA\Property(property="password", type="string", example="wafaaessalhi")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Connexion réussie"),
     *     @OA\Response(response=401, description="Identifiants invalides")
     * )
     */
    public function login (Request $request){
        // je valide les données de connexion
        $credentials = $request->validate ([
            'email' => 'required|string|email',
            'password' => 'required|string'
        ]);
        // j'essaie de connecter l'utilisateur
        $user = User::where('email', $credentials['email'])->first();
        // verfier lemot de passe
        if(!$user || !Hash::check($credentials['password'], $user->password)){
            return response()->json(['message' => 'Identifiants invalides']);
        }
        // je crée un nouveau token 
        $token = $user->createToken('Api Token')->plainTextToken;
        return response()->json([
            'message' => 'Connexion réussie',
            'token' => $token
        ]);
    }


    /**
     * @OA\Post(
     *     path="/api/logout",
     *     summary="Déconnexion de l'utilisateur",
     *     description="Supprime le jeton d'accès actuel de l'utilisateur authentifié.",
     *     tags={"Authentification"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Déconnexion réussie",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Deconnexion reussie")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Non authentifié")
     * )
     */
    // Maitenant je supprime le token pour la deconnexion
    public function logout(Request $request){
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Deconnexion reussie']);
    }


    /**
     * @OA\Get(
     *     path="/api/me",
     *     summary="Récupérer l'utilisateur connecté",
     *     description="Retourne les informations de l'utilisateur actuellement authentifié.",
     *     tags={"Authentification"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Utilisateur authentifié",
     *         @OA\JsonContent(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="name", type="string", example="Wafaa"),
     *             @OA\Property(property="email", type="string", example="wafaa@gmail.com"),
     *             @OA\Property(property="created_at", type="string", format="date-time", example="2025-10-22T10:00:00Z")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Non authentifié")
     * )
     */

    //renvoyer l'utilisateur connecté
    public function me(Request $request){
        return response()->json($request->user());
    }
}

<?php

namespace App\Http\Controllers;
use App\Models\Job;
use Illuminate\Http\Request;

class JobController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/jobs",
     *     summary="Lister toutes les offres d'emploi",
     *     description="Retourne la liste complète des offres d'emploi disponibles.",
     *     tags={"Offres d'emploi"},
    *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Liste des offres récupérée avec succès",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Job"))
     *     )
     * )
     */

    //lister toutes les offres d'emploi
    public function index()
    {
         return response()->json(Job::all());
    }

    /**
     * @OA\Post(
     *     path="/api/jobs",
     *     summary="Créer une nouvelle offre d'emploi",
     *     description="Permet à un employeur connecté de créer une nouvelle offre d'emploi.",
     *     tags={"Offres d'emploi"},
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title","description","company","location"},
     *             @OA\Property(property="title", type="string", example="Développeur web"),
     *             @OA\Property(property="description", type="string", example="Développement d'applications Laravel."),
     *             @OA\Property(property="company", type="string", example="TechCorp"),
     *             @OA\Property(property="salary", type="number", example=4000),
     *             @OA\Property(property="location", type="string", example="Casablanca")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Offre créée avec succès"),
     *     @OA\Response(response=401, description="Non authentifié")
     * )
     */
    // Créer une offre d'emploi
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'company' => 'required|string',
            'salary' => 'nullable|numeric',
            'location' => 'required|string',
        ]);
        $job = Job::create([
            'title' => $request->title,
            'description' => $request->description,
            'company' => $request->company,
            'salary' => $request->salary,
            'location' => $request->location,
            'user_id' => $request->user()->id,  //employeur qui crée l'offre
        ]);
        return response()->json($job);
    }

    /**
     * Display the specified resource.
     */
    //voir une offre 
    public function show(Job $job)
    {
        return response()->json($job);
    }

    /**
     * @OA\Put(
     *     path="/api/jobs/{id}",
     *     summary="Mettre à jour une offre d'emploi",
     *     tags={"Offres d'emploi"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de l'offre à modifier",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="title", type="string", example="Développeur backend"),
     *             @OA\Property(property="description", type="string", example="Mise à jour des API REST."),
     *             @OA\Property(property="company", type="string", example="TechCorp"),
     *             @OA\Property(property="salary", type="number", example=4500),
     *             @OA\Property(property="location", type="string", example="Rabat")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Offre mise à jour avec succès"),
     *     @OA\Response(response=403, description="Accès refusé"),
     *     @OA\Response(response=404, description="Offre non trouvée")
     * )
     */
    // mettre à jour à une offre
    public function update(Request $request, Job $job)
    {
        if($request->user()->role !== 'admin' && $request->user()->id !== $job->user_id){
            return response()->json(['message' => 'Accès refusé'], 403);
        }

        $job->update($request->all());
        return response()->json($job);

    }

    /**
     * @OA\Delete(
     *     path="/api/jobs/{id}",
     *     summary="Supprimer une offre d'emploi",
     *     tags={"Offres d'emploi"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="ID de l'offre à supprimer",
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(response=200, description="Offre supprimée avec succès"),
     *     @OA\Response(response=403, description="Accès refusé"),
     *     @OA\Response(response=404, description="Offre non trouvée")
     * )
     */
    // Supprimer une offre
    public function destroy(Request $request, Job $job)
    {
        if($request->user()->role !== 'admin' && $request->user()->id !== $job->user_id) {
            return response()->json(['message' => 'Accès refusé'], 403);
        }
        $job->delete();
        return response()->json(['message' => 'Offre supprimée']);
    }



    /**
     * @OA\Get(
     *     path="/api/jobs/search",
     *     summary="Rechercher des offres d'emploi",
     *     tags={"Offres d'emploi"},
     *     @OA\Parameter(name="title", in="query", description="Filtrer par titre", @OA\Schema(type="string")),
     *     @OA\Parameter(name="company", in="query", description="Filtrer par entreprise", @OA\Schema(type="string")),
     *     @OA\Parameter(name="location", in="query", description="Filtrer par localisation", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="Résultats de la recherche")
     * )
     */

    //Recherche simple par titre, entreprise, ou localisation
    public function search(Request $request){

        $query = Job::query();
        if ($request->title) $query->where('title', 'like', "%{$request->title}%");
        if ($request->company) $query->where('company', 'like', "%{$request->company}%");
        if ($request->location) $query->where('location', 'like', "%{$request->location}%");
        return response()->json([$query->get()]);
    }


    /**
 * @OA\Schema(
 *     schema="Job",
 *     title="Job",
 *     description="Modèle d'offre d'emploi",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Développeur web"),
 *     @OA\Property(property="description", type="string", example="Créer des sites web dynamiques."),
 *     @OA\Property(property="company", type="string", example="TechCorp"),
 *     @OA\Property(property="salary", type="number", example=4000),
 *     @OA\Property(property="location", type="string", example="Casablanca"),
 *     @OA\Property(property="user_id", type="integer", example=2),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-10-22T10:00:00Z")
 * )
 */
}

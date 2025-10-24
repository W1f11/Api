<?php

namespace App\Http\Controllers;
use App\Models\Application;
use App\Models\Job;
use Illuminate\Http\Request;


class ApplicationController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/applications",
     *     summary="Lister toutes les candidatures de l'utilisateur connecté",
     *     tags={"Candidatures"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Liste des candidatures de l'utilisateur connecté",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Application")
     *         )
     *     ),
     *     @OA\Response(response=401, description="Non authentifié")
     * )
     */
    //lister toutes les condidatures
    public function index()
    {
        $applications = Application::where('user_id', $request->user()->id)
        ->with('job')
        ->get();
        return response()->json($applications);
    }

    /**
     * @OA\Post(
     *     path="/api/jobs/{job}/apply",
     *     summary="Postuler à une offre d'emploi",
     *     tags={"Candidatures"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="job",
     *         in="path",
     *         required=true,
     *         description="ID du job auquel postuler",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Candidature créée avec succès",
     *         @OA\JsonContent(ref="#/components/schemas/Application")
     *     ),
     *     @OA\Response(response=400, description="Déjà postulé"),
     *     @OA\Response(response=401, description="Non authentifié")
     * )
     */
    public function store(Request $request, Job $job)
    {
        //verifier si l'utilisateur si déja postuler à cette offre
        if(Application::where('user_id', $request->user()->id)->where('job_id', $request->$job->id)->exists()){
            return response()->json(['message' => 'Vous avez déjà postulé à cette offre']);
        }
        $application = Application::create([
            'user_id' => $request->user()->id,
            'job_id' => $request->job()->id,
            'status'=> 'pending',
        ]);
        return  response()->json($application);
    }

    /**
     * @OA\Get(
     *     path="/api/jobs/{job}/applications",
     *     summary="Lister les candidatures pour une offre d'emploi (admin ou employeur)",
     *     tags={"Candidatures"},
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="job",
     *         in="path",
     *         required=true,
     *         description="ID du job",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Liste des candidatures pour cette offre",
     *         @OA\JsonContent(
     *             type="array",
     *             @OA\Items(ref="#/components/schemas/Application")
     *         )
     *     ),
     *     @OA\Response(response=403, description="Accès refusé"),
     *     @OA\Response(response=401, description="Non authentifié")
     * )
     */


    //lister les candidatures pour un job (employer ou admin)
    public function jobApplications(Request $request, Job $job){
        if($request->user()->role !== 'admin' && $request->user()->id !== $job->user_id){
            return response()->json(['message' => 'Accès refusé']);

            return response()->json($job->applications()->width('user')->get());
        }
    }




 
}

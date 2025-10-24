<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


/**
 * @OA\Schema(
 *     schema="Job",
 *     type="object",
 *     title="Job",
 *     description="Modèle représentant une offre d'emploi",
 *     @OA\Property(property="id", type="integer", example=1),
 *     @OA\Property(property="title", type="string", example="Développeur Web"),
 *     @OA\Property(property="description", type="string", example="Développer des applications Laravel."),
 *     @OA\Property(property="company", type="string", example="TechCorp"),
 *     @OA\Property(property="salary", type="number", example=4500),
 *     @OA\Property(property="location", type="string", example="Casablanca"),
 *     @OA\Property(property="user_id", type="integer", example=2),
 *     @OA\Property(property="created_at", type="string", format="date-time", example="2025-10-22T10:00:00Z"),
 *     @OA\Property(property="updated_at", type="string", format="date-time", example="2025-10-22T10:00:00Z")
 * )
 */

class Job extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'company',
        'location',
        'salary',
        'user_id',
    ];


    public function applications(){
        return $this->hasMany(Application::class);
    }
}

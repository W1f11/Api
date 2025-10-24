<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


/**
 * @OA\Schema(
 *     schema="Application",
 *     title="Application Model",
 *     description="Modèle représentant une candidature",
 *     type="object",
 *     required={"user_id", "job_id", "status"},
 *     @OA\Property(property="user_id", type="integer", example=3),
 *     @OA\Property(property="job_id", type="integer", example=7),
 *     @OA\Property(property="status", type="string", example="pending"),

 * )
 */


class Application extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'job_id',
        'status',
    ];
    public function job(){
        return $this->belongsTo(Job::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}

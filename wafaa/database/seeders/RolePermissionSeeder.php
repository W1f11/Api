<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Traits\HasRoles;

use App\Models\User;
class RolePermissionSeeder extends Seeder
{
     use HasApiTokens, HasFactory, Notifiable, HasRoles;
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //Supprimer les caches éventuelle
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();


        //Créer les permissions 

        Permission::create(['name' => 'manage jobs']);
        Permission::create(['name' => 'manage users']);
        Permission::create(['name' => 'apply jobs']);


        //Créer les rôles

        $admin = Role::create(['name' => 'admin']);
        $employer = Role::create(['name' => 'employer']);
        $user = Role::create(['name' => 'user']);

        //Je donne les permissions à chaque rôle
        $admin->givePermissionTo(['manage jobs', 'manage users']);
        $employer->givePermissionTo(['manage jobs']);
        $user->givePermissionTo(['apply jobs']);




        // Assigner un rôle à un utilisateur (optionnel)
        $firstUser = User::find(1);
        if ($firstUser) {
            $firstUser->assignRole('admin');
        }
        
        
    }
}

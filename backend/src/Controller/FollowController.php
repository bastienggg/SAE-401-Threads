<?php

namespace App\Controller;

use App\Entity\Follow;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class FollowController extends AbstractController
{
    #[Route('/follow/{id}', name: 'app_follow_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser(); // Utilisateur authentifié (via le token)
    
        $profile = $entityManager->getRepository(User::class)->find($id);
        if (!$profile) {
            return new JsonResponse(['error' => 'Profile not found'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        // Vérifier si la relation existe déjà
        $existingFollow = $entityManager->getRepository(Follow::class)->findOneBy([
            'profile' => $profile,
            'follower' => $user,
        ]);
    
        if ($existingFollow) {
            return new JsonResponse(['error' => 'Already following this profile'], JsonResponse::HTTP_CONFLICT);
        }
    
        $follow = new Follow();
        $follow->setProfile($profile);
        $follow->setFollower($user);
    
        $entityManager->persist($follow);
        $entityManager->flush();
    
        return new JsonResponse(['message' => 'Follow created successfully'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/follow/{id}', name: 'app_follow_delete', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function delete(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $user = $this->getUser(); // Utilisateur authentifié (via le token)
    
        // Trouver le profil suivi correspondant à l'ID
        $profile = $entityManager->getRepository(User::class)->find($id);
        if (!$profile) {
            return new JsonResponse(['error' => 'Profile not found'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        // Rechercher la relation Follow
        $follow = $entityManager->getRepository(Follow::class)->findOneBy([
            'profile' => $profile,
            'follower' => $user,
        ]);
    
        if (!$follow) {
            return new JsonResponse(['error' => 'Follow relationship not found'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        $entityManager->remove($follow);
        $entityManager->flush();
    
        return new JsonResponse(['message' => 'Follow deleted successfully'], JsonResponse::HTTP_OK);
    }
}
<?php

namespace App\Controller;

use App\Entity\Follow;
use App\Entity\User;
use App\Repository\UserBlockRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
final class FollowController extends AbstractController
{
    #[Route('/follow/{id}', name: 'app_follow_create', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function create(
        int $id,
        EntityManagerInterface $entityManager,
        UserBlockRepository $userBlockRepository
    ): JsonResponse {
        $user = $this->getUser();
    
        $profile = $entityManager->getRepository(User::class)->find($id);
        if (!$profile) {
            return new JsonResponse(['error' => 'Profile not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        // Vérifier si l'utilisateur est bloqué
        if ($userBlockRepository->isBlocked($profile->getId(), $user->getId())) {
            return new JsonResponse(['error' => 'Cannot follow a user who has blocked you'], JsonResponse::HTTP_FORBIDDEN);
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
        $user = $this->getUser();
    
        $follow = $entityManager->getRepository(Follow::class)->findOneBy([
            'profile' => $id,
            'follower' => $user,
        ]);
    
        if (!$follow) {
            return new JsonResponse(['error' => 'Follow not found'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        $entityManager->remove($follow);
        $entityManager->flush();
    
        return new JsonResponse(['message' => 'Follow deleted successfully']);
    }
}
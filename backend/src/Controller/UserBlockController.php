<?php

namespace App\Controller;

use App\Entity\UserBlock;
use App\Repository\UserBlockRepository;
use App\Repository\UserRepository;
use App\Repository\FollowRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
class UserBlockController extends AbstractController
{
    #[Route('/block/{id}', name: 'block_user', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function blockUser(
        int $id,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        UserBlockRepository $userBlockRepository,
        FollowRepository $followRepository
    ): JsonResponse {
        $blocker = $this->getUser();
        $blocked = $userRepository->find($id);

        if (!$blocked) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($blocker->getId() === $blocked->getId()) {
            return new JsonResponse(['error' => 'Cannot block yourself'], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Vérifier si le blocage existe déjà
        if ($userBlockRepository->isBlocked($blocker->getId(), $blocked->getId())) {
            return new JsonResponse(['error' => 'User is already blocked'], JsonResponse::HTTP_CONFLICT);
        }

        try {
            // Créer le blocage
            $userBlock = new UserBlock();
            $userBlock->setBlocker($blocker);
            $userBlock->setBlocked($blocked);

            // Supprimer les abonnements existants dans les deux sens
            $follows = $followRepository->findBy([
                'follower' => $blocker,
                'profile' => $blocked
            ]);
            foreach ($follows as $follow) {
                $entityManager->remove($follow);
            }

            $follows = $followRepository->findBy([
                'follower' => $blocked,
                'profile' => $blocker
            ]);
            foreach ($follows as $follow) {
                $entityManager->remove($follow);
            }

            $entityManager->persist($userBlock);
            $entityManager->flush();

            return new JsonResponse(['message' => 'User blocked successfully']);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Failed to block user: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    #[Route('/unblock/{id}', name: 'unblock_user', methods: ['DELETE'])]
    #[IsGranted('ROLE_USER')]
    public function unblockUser(
        int $id,
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        UserBlockRepository $userBlockRepository
    ): JsonResponse {
        $blocker = $this->getUser();
        $blocked = $userRepository->find($id);

        if (!$blocked) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $userBlock = $userBlockRepository->findOneBy([
            'blocker' => $blocker,
            'blocked' => $blocked
        ]);

        if (!$userBlock) {
            return new JsonResponse(['error' => 'User is not blocked'], JsonResponse::HTTP_NOT_FOUND);
        }

        $entityManager->remove($userBlock);
        $entityManager->flush();

        return new JsonResponse(['message' => 'User unblocked successfully']);
    }

    #[Route('/blocked-users', name: 'get_blocked_users', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getBlockedUsers(UserBlockRepository $userBlockRepository): JsonResponse
    {
        $user = $this->getUser();
        $blockedUsers = $userBlockRepository->findBlockedUsers($user->getId());

        $data = array_map(function ($block) {
            return [
                'id' => $block->getBlocked()->getId(),
                'pseudo' => $block->getBlocked()->getPseudo(),
                'email' => $block->getBlocked()->getEmail(),
                'blockedAt' => $block->getCreatedAt()->format('Y-m-d H:i:s')
            ];
        }, $blockedUsers);

        return new JsonResponse($data);
    }

    #[Route('/is-blocked/{id}', name: 'check_if_blocked', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function checkIfBlocked(
        int $id,
        UserBlockRepository $userBlockRepository
    ): JsonResponse {
        $user = $this->getUser();
        $isBlocked = $userBlockRepository->isBlocked($id, $user->getId());

        return new JsonResponse(['isBlocked' => $isBlocked]);
    }
} 
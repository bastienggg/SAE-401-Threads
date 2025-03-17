<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;

final class UserController extends AbstractController
{


    #[Route('/users', name: 'get_all_users', methods: ['GET'])]
    public function getAllUsers(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        $data = [];

        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'pseudo' => $user->getPseudo(),
                'isVerified' => $user->getIsVerified(),
            ];
        }

        return new JsonResponse($data);
    }

    #[Route('/users/{id}/update-pseudo', name: 'update_user_pseudo', methods: ['POST'])]
    public function updatePseudo(int $id, Request $request, UserRepository $userRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $newPseudo = $data['pseudo'] ?? null;

        if (!$newPseudo) {
            return new JsonResponse(['code' => 'C-2401'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['code' => 'C-4121'], JsonResponse::HTTP_NOT_FOUND);
        }

        $user->setPseudo($newPseudo);
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['code' => 'C-1411'], JsonResponse::HTTP_OK);
    }

    #[Route('/users/{id}/update-email', name: 'update_user_email', methods: ['POST'])]
    public function updateEmail(int $id, Request $request, UserRepository $userRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $newEmail = $data['email'] ?? null;

        if (!$newEmail) {
            return new JsonResponse(['code' => 'C-2501'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['code' => 'C-4121'], JsonResponse::HTTP_NOT_FOUND);
        }

        $user->setEmail($newEmail);
        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['code' => 'C-1511'], JsonResponse::HTTP_OK);
    }
}

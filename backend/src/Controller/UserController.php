<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class UserController extends AbstractController
{


    #[Route('/users', name: 'get_all_users', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getAllUsers(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        $data = [];
    
        foreach ($users as $user) {
            if (!in_array('ROLE_ADMIN', $user->getRoles())) {
                $data[] = [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'pseudo' => $user->getPseudo(),
                    'isVerified' => $user->getIsVerified(),
                ];
            }
        }
    
        return new JsonResponse($data);
    }

    
    #[Route('/users/{id}', name: 'get_user', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function fetchUser(int $id, UserRepository $userRepository): JsonResponse
    {
        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['code' => 'C-4121'],   JsonResponse::HTTP_NOT_FOUND);
        }

        $data = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'pseudo' => $user->getPseudo(),
            'bio' => $user->getBio(),
            'avatar' => $user->getAvatar(),
            'place' => $user->getPlace(),
            'banner' => $user->getBanner(),
            'link' => $user->getLink(),
        ];

        return new JsonResponse($data);
    }

    #[Route('/users/{id}', name: 'update_user', methods: ['PATCH'])]
    #[IsGranted('ROLE_USER')]
    public function updateUser(int $id, Request $request, UserRepository $userRepository, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $newPseudo = $data['pseudo'] ?? null;
        $newEmail = $data['email'] ?? null;

        if (!$newPseudo && !$newEmail) {
            return new JsonResponse(['code' => 'C-2601'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['code' => 'C-4121'], JsonResponse::HTTP_NOT_FOUND);
        }

        if ($newPseudo) {
            $user->setPseudo($newPseudo);
        }

        if ($newEmail) {
            $user->setEmail($newEmail);
        }

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['code' => 'C-1611'], JsonResponse::HTTP_OK);
    }

    #[Route('/verify-admin', name: 'verify_admin', methods: ['POST'])]
    public function verifyAdmin(Request $request, UserRepository $userRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $token = $data['token'] ?? null;

        if (!$token) {
            return new JsonResponse(['code' => 'C-2601'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $userRepository->findOneBy(['apiToken' => $token]);

        if (!$user) {
            return new JsonResponse(['code' => 'C-4121'], JsonResponse::HTTP_NOT_FOUND);
        }

        if (in_array('ROLE_ADMIN', $user->getRoles())) {
            return new JsonResponse(['code' => 'C-0001'], JsonResponse::HTTP_OK);
        }

        return new JsonResponse(['code' => 'C-1101'], JsonResponse::HTTP_OK);
    }
}

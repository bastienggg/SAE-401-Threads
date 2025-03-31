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
use Symfony\Component\HttpKernel\Attribute\MapUploadedFile;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;


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
                    'isBlocked' => $user->isBlocked(), // Ajout de l'information sur le blocage
                ];
            }
        }
    
        return new JsonResponse($data);
    }

    
    
    #[Route('/users/{id}', name: 'get_user', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function fetchUser(
        int $id,
        Request $request,
        UserRepository $userRepository,
        UrlGeneratorInterface $urlGenerator
    ): JsonResponse {
        $user = $userRepository->find($id);
    
        if (!$user) {
            return new JsonResponse(['code' => 'C-4121'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        // Récupérer l'utilisateur connecté
        $currentUser = $this->getUser();


    
        // Compter les abonnés
        $followersCount = $userRepository->countFollowers($id);
    
        // Vérifier si l'utilisateur connecté suit cet utilisateur
        $isFollowing = false;
        if ($currentUser instanceof \App\Entity\User) {
            $isFollowing = $userRepository->isFollowing($currentUser->getId(), $id);
        }

        // Récupérer le chemin public pour les fichiers
        $baseUrl = $this->getParameter('base_url');
        $uploadDir = $this->getParameter('upload_directory');


        $avatarUrl = $user->getAvatar() ? $baseUrl  . $uploadDir . '/' . $user->getAvatar() : null;
        $bannerUrl = $user->getBanner() ? $baseUrl . $uploadDir . '/' . $user->getBanner() : null;
    
    
        $data = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'pseudo' => $user->getPseudo(),
            'bio' => $user->getBio(),
            'avatar' => $avatarUrl,
            'place' => $user->getPlace(),
            'banner' => $bannerUrl,
            'link' => $user->getLink(),
            'followersCount' => $followersCount,
            'isFollowing' => $isFollowing,
        ];
    
        return new JsonResponse($data);
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

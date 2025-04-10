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
use App\Repository\UserBlockRepository;
use App\Entity\User;


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

    #[Route('/users-update/{id}', name: 'update_user', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
     public function updateProfilUser(
         int $id,
         Request $request,
         UserRepository $userRepository,
         EntityManagerInterface $entityManager
     ): JsonResponse {
         // Récupérer les données textuelles depuis form-data
         $newPseudo = $request->get('pseudo');
         $newEmail = $request->get('email');
         $newBio = $request->get('bio');
         $newPlace = $request->get('place');
         $newLink = $request->get('link');
     
         // Récupérer les fichiers envoyés
         $avatar = $request->files->get('avatar');
         $banner = $request->files->get('banner');
     
         $user = $userRepository->find($id);
     
         if (!$user) {
             return new JsonResponse(['code' => 'C-4121', 'message' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
         }
     
         // Mise à jour des champs textuels uniquement si non null ou non vide
         if (!empty($newPseudo)) {
             $user->setPseudo($newPseudo);
         }
     
         if (!empty($newEmail)) {
             $user->setEmail($newEmail);
         }
     
         if (!empty($newBio)) {
             $user->setBio($newBio);
         }
     
         if (!empty($newPlace)) {
             $user->setPlace($newPlace);
         }
     
         if (!empty($newLink)) {
             $user->setLink($newLink);
         }
     
         $uploadDir = $this->getParameter('upload_directory');
     
         // Gestion de l'avatar
         if ($avatar && $avatar instanceof UploadedFile) {
             // Supprimer l'ancien avatar s'il existe
             if ($user->getAvatar()) {
                 $oldAvatarPath = $uploadDir . '/' . $user->getAvatar();
                 if (file_exists($oldAvatarPath)) {
                     unlink($oldAvatarPath);
                 }
             }
     
             // Enregistrer le nouvel avatar
             $avatarFileName = uniqid() . '_avatar.' . $avatar->guessExtension();
     
             try {
                 $avatar->move($uploadDir, $avatarFileName);
             } catch (\Exception $e) {
                 return new JsonResponse(['code' => 'C-5002', 'message' => 'Failed to upload avatar: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
             }
     
             $user->setAvatar($avatarFileName);
         }
     
         // Gestion de la bannière
         if ($banner && $banner instanceof UploadedFile) {
             // Supprimer l'ancienne bannière si elle existe
             if ($user->getBanner()) {
                 $oldBannerPath = $uploadDir . '/' . $user->getBanner();
                 if (file_exists($oldBannerPath)) {
                     unlink($oldBannerPath);
                 }
             }
     
             // Enregistrer la nouvelle bannière
             $bannerFileName = uniqid() . '_banner.' . $banner->guessExtension();
     
             try {
                 $banner->move($uploadDir, $bannerFileName);
             } catch (\Exception $e) {
                 return new JsonResponse(['code' => 'C-5003', 'message' => 'Failed to upload banner: ' . $e->getMessage()], JsonResponse::HTTP_INTERNAL_SERVER_ERROR);
             }
     
             $user->setBanner($bannerFileName);
         }
     
         $entityManager->persist($user);
         $entityManager->flush();
     
         return new JsonResponse(['code' => 'C-1611', 'message' => 'User updated successfully'], JsonResponse::HTTP_OK);
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
     
         // Construire les URLs des images
         $baseUrl = $this->getParameter('base_url'); // Assurez-vous que ce paramètre est défini dans votre configuration
         $avatarUrl = $user->getAvatar() ? $baseUrl . '/uploads/' . $user->getAvatar() : null;
         $bannerUrl = $user->getBanner() ? $baseUrl . '/uploads/' . $user->getBanner() : null;
     
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

    #[Route('/users/{id}/block-status', name: 'get_user_block_status', methods: ['GET'])]
    #[IsGranted('ROLE_USER')]
    public function getUserBlockStatus(int $id, UserBlockRepository $userBlockRepository): JsonResponse
    {
        $currentUser = $this->getUser();
        $targetUser = $this->getDoctrine()->getRepository(User::class)->find($id);

        if (!$targetUser) {
            return new JsonResponse(['error' => 'User not found'], JsonResponse::HTTP_NOT_FOUND);
        }

        $isBlocked = $userBlockRepository->isBlocked($currentUser->getId(), $targetUser->getId());

        return new JsonResponse([
            'isBlocked' => $isBlocked,
            'isBlockedByAdmin' => $targetUser->isBlocked()
        ]);
    }

}

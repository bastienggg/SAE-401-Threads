<?php

namespace App\Controller;

use App\Entity\Like;
use App\Repository\LikeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Repository\PostRepository;


#[Route('/api/like', name: 'api_likes_')]
class LikeController extends AbstractController
{
    #[Route('/{postId}', name: 'add', methods: ['POST'], format: 'json')]
    #[IsGranted('ROLE_USER')]
    public function addLike(
        int $postId,
        LikeRepository $likeRepository,
        PostRepository $postRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $this->getUser();
    
        // Vérifier si le post existe
        $post = $postRepository->find($postId);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        // Vérifier si un like existe déjà pour cet utilisateur et ce post
        $existingLike = $likeRepository->findOneBy(['user' => $user, 'post' => $post]);
        if ($existingLike) {
            return $this->json(['error' => 'You have already liked this post'], JsonResponse::HTTP_BAD_REQUEST);
        }
    
        // Créer un nouveau like
        $like = new Like();
        $like->setUser($user);
        $like->setPost($post);
    
        $entityManager->persist($like);
        $entityManager->flush();
    
        return $this->json(['message' => 'Post liked successfully'], JsonResponse::HTTP_CREATED);
    }

    
    #[Route('/{postId}', name: 'delete', methods: ['DELETE'], format: 'json')]
    #[IsGranted('ROLE_USER')]
    public function deleteLike(
        int $postId,
        LikeRepository $likeRepository,
        PostRepository $postRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $this->getUser();
    
        // Vérifier si le post existe
        $post = $postRepository->find($postId);
        if (!$post) {
            return $this->json(['error' => 'Post not found'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        // Rechercher le like correspondant à l'utilisateur et au post
        $like = $likeRepository->findOneBy(['user' => $user, 'post' => $post]);
        if (!$like) {
            return $this->json(['error' => 'Like not found for this post'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        $entityManager->remove($like);
        $entityManager->flush();
    
        return $this->json(['message' => 'Like deleted successfully'], JsonResponse::HTTP_OK);
    }
}
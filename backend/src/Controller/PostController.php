<?php

namespace App\Controller;

use App\Dto\Payload\CreatePostPayload;
use App\Service\PostService;
use App\Entity\Post;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use App\Repository\PostRepository;
use App\Repository\LikeRepository;

final class PostController extends AbstractController
{
    
    #[Route('/posts', name: 'app_post', methods: ['GET'], format: 'json')]
    #[IsGranted('ROLE_USER')]
    public function index(
        Request $request,
        PostRepository $postRepository,
        LikeRepository $likeRepository
    ): Response {
        $page = max(1, (int) $request->query->get('page', 1));
        $count = 20;
        $offset = ($page - 1) * $count;
    
        $paginator = $postRepository->paginateAllOrderedByLatest($offset, $count);
        $totalPostsCount = $paginator->count();
    
        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = ($offset + $count) < $totalPostsCount ? $page + 1 : null;
    
        $baseUrl = $this->getParameter('base_url');
        $uploadDir = $this->getParameter('upload_directory');
        $user = $this->getUser();
    
        $posts = array_map(function ($post) use ($baseUrl, $uploadDir, $likeRepository, $user) {
            $userEntity = $post->getUser();
            $avatarUrl = $userEntity->getAvatar() ? $baseUrl . $uploadDir . '/' . $userEntity->getAvatar() : null;
    
            // Récupérer le nombre de likes et vérifier si l'utilisateur a liké
            $likeCount = $likeRepository->count(['post' => $post]);
            $userLiked = $likeRepository->findOneBy(['post' => $post, 'user' => $user]) !== null;
    
            return [
                'id' => $post->getId(),
                'content' => $post->getContent(),
                'created_at' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                'user' => [
                    'id' => $userEntity->getId(),
                    'avatar' => $avatarUrl,
                    'pseudo' => $userEntity->getPseudo(),
                ],
                'like_count' => $likeCount,
                'user_liked' => $userLiked,
            ];
        }, iterator_to_array($paginator));
    
        return $this->json([
            'posts' => $posts,
            'previous_page' => $previousPage,
            'next_page' => $nextPage,
        ]);
    }
    
    #[Route('/user/{id}/posts', name: 'user.posts', methods: ['GET'], format: 'json')]
    public function getUserPosts(
        int $id,
        Request $request,
        PostRepository $postRepository,
        LikeRepository $likeRepository
    ): JsonResponse {
        $page = max(1, (int) $request->query->get('page', 1));
        $count = 20;
        $offset = ($page - 1) * $count;
    
        $paginator = $postRepository->paginateByUserOrderedByLatest($id, $offset, $count);
        $totalPostsCount = $paginator->count();
    
        $previousPage = $page > 1 ? $page - 1 : null;
        $nextPage = ($offset + $count) < $totalPostsCount ? $page + 1 : null;
    
        $baseUrl = $this->getParameter('base_url');
        $uploadDir = $this->getParameter('upload_directory');
        $user = $this->getUser();
    
        $posts = array_map(function ($post) use ($baseUrl, $uploadDir, $likeRepository, $user) {
            $userEntity = $post->getUser();
            $avatarUrl = $userEntity->getAvatar() ? $baseUrl . $uploadDir . '/' . $userEntity->getAvatar() : null;
    
            // Récupérer le nombre de likes et vérifier si l'utilisateur a liké
            $likeCount = $likeRepository->count(['post' => $post]);
            $userLiked = $likeRepository->findOneBy(['post' => $post, 'user' => $user]) !== null;
    
            return [
                'id' => $post->getId(),
                'content' => $post->getContent(),
                'created_at' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                'user' => [
                    'id' => $userEntity->getId(),
                    'avatar' => $avatarUrl,
                    'pseudo' => $userEntity->getPseudo(),
                ],
                'like_count' => $likeCount,
                'user_liked' => $userLiked,
            ];
        }, iterator_to_array($paginator));
    
        return $this->json([
            'posts' => $posts,
            'previous_page' => $previousPage,
            'next_page' => $nextPage,
        ]);
    }


    #[Route('/posts', name: 'posts.create', methods: ['POST'], format: 'json')]
    #[IsGranted('ROLE_USER')]
    public function createPost(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        PostService $postService
    ): JsonResponse {
        // Désérialiser le JSON en objet CreatePostPayload
        try {
            $payload = $serializer->deserialize($request->getContent(), CreatePostPayload::class, 'json');
        } catch (\Exception $e) {
            return $this->json(['error' => 'Invalid JSON format'], Response::HTTP_BAD_REQUEST);
        }
    
        // Vérifier que $payload est bien une instance de CreatePostPayload
        if (!$payload instanceof CreatePostPayload) {
            return $this->json(['error' => 'Invalid payload object'], Response::HTTP_BAD_REQUEST);
        }
    
        // Valider les données
        $errors = $validator->validate($payload);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();
        if (!$user || !method_exists($user, 'getId')) {
            return $this->json(['error' => 'User not authenticated or invalid user object'], Response::HTTP_UNAUTHORIZED);
        }
    
        // Ajouter l'ID de l'utilisateur au payload
        $payload->setUserId($user->getId());
    
        // Créer le post
        try {
            $postService->create($payload);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Failed to create post: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    
        return $this->json(['message' => 'Post created successfully'], Response::HTTP_CREATED);
    }

    
    #[Route('/posts/{id}', name: 'posts.delete', methods: ['DELETE'], format: 'json')]
    #[IsGranted('ROLE_USER')]
    public function deletePost(
        int $id,
        PostRepository $postRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        // Récupérer le post à supprimer
        $post = $postRepository->find($id);
    
        if (!$post) {
            return $this->json(['error' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }
    
        // Vérifier si l'utilisateur connecté est le propriétaire du post
        $user = $this->getUser();
        if ($post->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'You are not authorized to delete this post'], Response::HTTP_FORBIDDEN);
        }
    
        // Supprimer le post
        try {
            $entityManager->remove($post);
            $entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['error' => 'Failed to delete post: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    
        return $this->json(['message' => 'Post deleted successfully'], Response::HTTP_OK);
    }
    
}
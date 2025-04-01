<?php

namespace App\Controller;

use App\Dto\Payload\CreatePostPayload;
use App\Service\PostService;
use App\Entity\Post;
use App\Entity\Like;
use App\Entity\User;
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
        $user = $this->getUser();
    
        $posts = array_map(function ($post) use ($baseUrl, $likeRepository, $user) {
            $userEntity = $post->getUser();
            $avatarUrl = $userEntity->getAvatar() ? $baseUrl . '/uploads/' . $userEntity->getAvatar() : null;
    
            $likeCount = $likeRepository->count(['post' => $post]);
            $userLiked = $likeRepository->findOneBy(['post' => $post, 'user' => $user]) !== null;
    
            $media = array_map(fn($file) => $baseUrl . '/uploads/' . $file, $post->getMedia() ?? []);
    
            return [
                'id' => $post->getId(),
                'content' => $post->getContent(),
                'created_at' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                'user' => [
                    'id' => $userEntity->getId(),
                    'avatar' => $avatarUrl,
                    'pseudo' => $userEntity->getPseudo(),
                    'is_blocked' => $userEntity->isBlocked(),
                ],
                'like_count' => $likeCount,
                'user_liked' => $userLiked,
                'media' => $media,
            ];
        }, iterator_to_array($paginator));
    
        return $this->json([
            'posts' => $posts,
            'previous_page' => $previousPage,
            'next_page' => $nextPage,
        ]);
    }
    
    #[Route('/user/{id}/posts', name: 'user.posts', methods: ['GET'], format: 'json')]
    #[IsGranted('ROLE_USER')]
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
        $user = $this->getUser();
    
        $posts = array_map(function ($post) use ($baseUrl, $likeRepository, $user) {
            $userEntity = $post->getUser();
            $avatarUrl = $userEntity->getAvatar() ? $baseUrl . '/uploads/' . $userEntity->getAvatar() : null;
    
            $likeCount = $likeRepository->count(['post' => $post]);
            $userLiked = $likeRepository->findOneBy(['post' => $post, 'user' => $user]) !== null;
    
            $media = array_map(fn($file) => $baseUrl . '/uploads/' . $file, $post->getMedia() ?? []);
    
            return [
                'id' => $post->getId(),
                'content' => $post->getContent(),
                'created_at' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                'user' => [
                    'id' => $userEntity->getId(),
                    'avatar' => $avatarUrl,
                    'pseudo' => $userEntity->getPseudo(),
                    'is_blocked' => $userEntity->isBlocked(),
                ],
                'like_count' => $likeCount,
                'user_liked' => $userLiked,
                'media' => $media,
            ];
        }, iterator_to_array($paginator));
    
        return $this->json([
            'posts' => $posts,
            'previous_page' => $previousPage,
            'next_page' => $nextPage,
        ]);
    }

    #[Route('/posts-update/{id}', name: 'posts.update', methods: ['POST'], format: 'json')]
    #[IsGranted('ROLE_USER')]
    public function updatePost(
        int $id,
        Request $request,
        PostRepository $postRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $post = $postRepository->find($id);
    
        if (!$post) {
            return $this->json(['error' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }
    
        $user = $this->getUser();
        if ($post->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'You are not authorized to update this post'], Response::HTTP_FORBIDDEN);
        }
    
        $content = $request->request->get('content');
        $mediaFiles = $request->files->get('media', []);
        if (!is_array($mediaFiles)) {
            $mediaFiles = [$mediaFiles];
        }
    
        // Récupérer les médias à supprimer
        $removedMediaUrls = $request->request->all('removedMedia');
        if (!is_array($removedMediaUrls)) {
            $removedMediaUrls = [$removedMediaUrls];
        }
    
        // Supprimer les fichiers des médias supprimés
        $uploadDir = $this->getParameter('upload_directory');
        
        $currentMedia = $post->getMedia() ?? []; // Assurez-vous que $currentMedia est un tableau
        $updatedMedia = $currentMedia;
    
        foreach ($removedMediaUrls as $mediaUrl) {
            $media = basename($mediaUrl);
            $filePath = $uploadDir . '/' . $media;
    
            if (file_exists($filePath)) {
                unlink($filePath); // Supprime physiquement le fichier
            }
    
            $updatedMedia = array_filter($updatedMedia, fn($item) => $item !== $media);
        }
    
        $post->setMedia($updatedMedia);
    
        // Gérer les nouveaux fichiers médias
        $errors = [];
        $mediaPaths = [];
        foreach ($mediaFiles as $media) {
            if ($media && $media->isValid()) {
                $mediaName = uniqid() . '.' . $media->guessExtension();
                $media->move($uploadDir, $mediaName);
                $mediaPaths[] = $mediaName;
            } else {
                $errors[] = 'Invalid media upload.';
            }
        }
    
        if (!empty($errors)) {
            return $this->json(['errors' => $errors], Response::HTTP_BAD_REQUEST);
        }
    
        if ($content) {
            $post->setContent($content);
        }
    
        if (!empty($mediaPaths)) {
            $post->setMedia(array_merge($currentMedia, $mediaPaths)); // Utilisez $currentMedia ici
        }
    
        try {
            $entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['error' => 'Failed to update post: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    
        return $this->json(['message' => 'Post updated successfully'], Response::HTTP_OK);
    }


    #[Route('/posts', name: 'posts.create', methods: ['POST'], format: 'json')]
    #[IsGranted('ROLE_USER')]
    public function createPost(
        Request $request,
        ValidatorInterface $validator,
        PostService $postService
    ): JsonResponse {
        $user = $this->getUser();
        if (!$user || !method_exists($user, 'getId')) {
            return $this->json(['error' => 'User not authenticated or invalid user object'], Response::HTTP_UNAUTHORIZED);
        }
    
        if ($user->isBlocked()) {
            return $this->json(['error' => 'User is blocked', 'code' => 'C-3132'], Response::HTTP_FORBIDDEN);
        }
    
        $content = $request->request->get('content');
        $mediaFiles = $request->files->get('media', []);
        if (!is_array($mediaFiles)) {
            $mediaFiles = [$mediaFiles];
        }
    
        $errors = [];
        $mediaPaths = [];
        foreach ($mediaFiles as $media) {
            if ($media && $media->isValid()) {
                $uploadDir = $this->getParameter('upload_directory');
                $mediaName = uniqid() . '.' . $media->guessExtension();
                $media->move($uploadDir, $mediaName);
                $mediaPaths[] = $mediaName;
            } else {
                $errors[] = 'Invalid media upload.';
            }
        }
    
        if (!empty($errors)) {
            return $this->json(['errors' => $errors], Response::HTTP_BAD_REQUEST);
        }
    
        $payload = new CreatePostPayload();
        $payload->setUserId($user->getId());
        $payload->setContent($content);
        $payload->setMedia($mediaPaths);
    
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
        LikeRepository $likeRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $post = $postRepository->find($id);
    
        if (!$post) {
            return $this->json(['error' => 'Post not found'], Response::HTTP_NOT_FOUND);
        }
    
        $user = $this->getUser();
        if ($post->getUser()->getId() !== $user->getId()) {
            return $this->json(['error' => 'You are not authorized to delete this post'], Response::HTTP_FORBIDDEN);
        }
    
        try {
            $likes = $likeRepository->findBy(['post' => $post]);
            foreach ($likes as $like) {
                $entityManager->remove($like);
            }
    
            $entityManager->remove($post);
            $entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['error' => 'Failed to delete post: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    
        return $this->json(['message' => 'Post deleted successfully'], Response::HTTP_OK);
    }
    
}
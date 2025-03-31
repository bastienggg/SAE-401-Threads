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
        $uploadDir = $this->getParameter('upload_directory');
        $user = $this->getUser();
    
        $posts = array_map(function ($post) use ($baseUrl, $likeRepository, $user) {
            $userEntity = $post->getUser();
            $avatarUrl = $userEntity->getAvatar() ? $baseUrl . '/uploads/' . $userEntity->getAvatar() : null;
            $bannerUrl = $userEntity->getBanner() ? $baseUrl . '/uploads/' . $userEntity->getBanner() : null;
        
            // Récupérer le nombre de likes et vérifier si l'utilisateur a liké
            $likeCount = $likeRepository->count(['post' => $post]);
            $userLiked = $likeRepository->findOneBy(['post' => $post, 'user' => $user]) !== null;
        
            // Générer les URLs pour les pictures
            $pictures = array_map(fn($picture) => $baseUrl . '/uploads/' . $picture, $post->getPictures() ?? []);
        
            // Générer les URLs pour les videos
            $videos = array_map(fn($video) => $baseUrl . '/uploads/' . $video, $post->getVideos() ?? []);
        
            return [
                'id' => $post->getId(),
                'content' => $post->getContent(),
                'created_at' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                'user' => [
                    'id' => $userEntity->getId(),
                    'avatar' => $avatarUrl,
                    'banner' => $bannerUrl,
                    'pseudo' => $userEntity->getPseudo(),
                    'is_blocked' => $userEntity->isBlocked(),
                ],
                'like_count' => $likeCount,
                'user_liked' => $userLiked,
                'pictures' => $pictures,
                'videos' => $videos,
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
        $uploadDir = $this->getParameter('upload_directory');
        $user = $this->getUser();
    
        $posts = array_map(function ($post) use ($baseUrl, $likeRepository, $user) {
            $userEntity = $post->getUser();
            $avatarUrl = $userEntity->getAvatar() ? $baseUrl . '/uploads/' . $userEntity->getAvatar() : null;
            $bannerUrl = $userEntity->getBanner() ? $baseUrl . '/uploads/' . $userEntity->getBanner() : null;
        
            // Récupérer le nombre de likes et vérifier si l'utilisateur a liké
            $likeCount = $likeRepository->count(['post' => $post]);
            $userLiked = $likeRepository->findOneBy(['post' => $post, 'user' => $user]) !== null;
        
            // Générer les URLs pour les pictures
            $pictures = array_map(fn($picture) => $baseUrl . '/uploads/' . $picture, $post->getPictures() ?? []);
        
            // Générer les URLs pour les videos
            $videos = array_map(fn($video) => $baseUrl . '/uploads/' . $video, $post->getVideos() ?? []);
        
            return [
                'id' => $post->getId(),
                'content' => $post->getContent(),
                'created_at' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
                'user' => [
                    'id' => $userEntity->getId(),
                    'avatar' => $avatarUrl,
                    'banner' => $bannerUrl,
                    'pseudo' => $userEntity->getPseudo(),
                    'is_blocked' => $userEntity->isBlocked(),
                ],
                'like_count' => $likeCount,
                'user_liked' => $userLiked,
                'pictures' => $pictures,
                'videos' => $videos,
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
        ValidatorInterface $validator,
        PostService $postService
    ): JsonResponse {

        header('Access-Control-Allow-Origin: http://localhost:8090');

        $user = $this->getUser();
        if (!$user || !method_exists($user, 'getId')) {
            return $this->json(['error' => 'User not authenticated or invalid user object'], Response::HTTP_UNAUTHORIZED);
        }
    
        if ($user->isBlocked()) {
            return $this->json(['error' => 'User is blocked', 'code' => 'C-3132'], Response::HTTP_FORBIDDEN);
        }
    
        $content = $request->request->get('content');
        $pictures = $request->files->get('pictures', []); // Récupérer les fichiers
    
        dump($pictures);
        // Assurez-vous que $pictures est toujours un tableau
        if (!is_array($pictures)) {
            $pictures = [$pictures];
        }
    
        $errors = [];
        $picturePaths = [];
        foreach ($pictures as $picture) {
            if ($picture && $picture->isValid()) {
                $uploadDir = $this->getParameter('upload_directory');
                $pictureName = uniqid() . '.' . $picture->guessExtension();
                $picture->move($uploadDir, $pictureName);
                $picturePaths[] = $pictureName;
            } else {
                $errors[] = 'Invalid picture upload.';
            }
        }

        
    
        // Gestion des vidéos (similaire aux images)
        $videos = $request->files->get('videos', []);
        if (!is_array($videos)) {
            $videos = [$videos];
        }
    
        $videoPaths = [];
        foreach ($videos as $video) {
            if ($video && $video->isValid()) {
                $uploadDir = $this->getParameter('upload_directory');
                $videoName = uniqid() . '.' . $video->guessExtension();
                $video->move($uploadDir, $videoName);
                $videoPaths[] = $videoName;
            } else {
                $errors[] = 'Invalid video upload.';
            }
        }
    
        if (!empty($errors)) {
            return $this->json(['errors' => $errors], Response::HTTP_BAD_REQUEST);
        }
    
        $payload = new CreatePostPayload();
        $payload->setUserId($user->getId());
        $payload->setContent($content);
        $payload->setPictures($picturePaths);
        $payload->setVideos($videoPaths);
    
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
    
        // Supprimer les likes associés au post
        try {
            $likes = $likeRepository->findBy(['post' => $post]);
            foreach ($likes as $like) {
                $entityManager->remove($like);
            }
    
            // Supprimer le post
            $entityManager->remove($post);
            $entityManager->flush();
        } catch (\Exception $e) {
            return $this->json(['error' => 'Failed to delete post: ' . $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    
        return $this->json(['message' => 'Post deleted successfully'], Response::HTTP_OK);
    }
    
}
<?php

namespace App\Controller;

use App\Repository\PostRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class SearchController extends AbstractController
{
    private $postRepository;
    private $userRepository;
    private $serializer;

    public function __construct(
        PostRepository $postRepository,
        UserRepository $userRepository,
        SerializerInterface $serializer
    ) {
        $this->postRepository = $postRepository;
        $this->userRepository = $userRepository;
        $this->serializer = $serializer;
    }

    private function formatAvatarUrl($data)
    {
        if (isset($data['user']) && isset($data['user']['avatar'])) {
            $data['user']['avatar'] = 'http://localhost:8080/uploads/' . $data['user']['avatar'];
        }
        if (isset($data['media']) && is_array($data['media'])) {
            $data['media'] = array_map(function($media) {
                return 'http://localhost:8080/uploads/' . $media;
            }, $data['media']);
        }
        return $data;
    }

    #[Route('/api/search/posts', name: 'search_posts', methods: ['GET'])]
    public function searchPosts(Request $request): JsonResponse
    {
        $query = $request->query->get('q');
        
        if (!$query) {
            return new JsonResponse(['error' => 'Query parameter is required'], 400);
        }

        $posts = $this->postRepository->searchPosts($query);
        
        // Sérialiser les posts avec les groupes appropriés
        $serializedPosts = $this->serializer->serialize($posts, 'json', ['groups' => ['post:read', 'user:basic']]);
        $postsData = json_decode($serializedPosts, true);
        
        // Formater les URLs des avatars et des médias pour chaque post
        $formattedPosts = array_map([$this, 'formatAvatarUrl'], $postsData);
        
        return new JsonResponse(['posts' => $formattedPosts]);
    }

    #[Route('/api/search/users', name: 'search_users', methods: ['GET'])]
    public function searchUsers(Request $request): JsonResponse
    {
        $query = $request->query->get('q');
        
        if (!$query) {
            return new JsonResponse(['error' => 'Query parameter is required'], 400);
        }

        $users = $this->userRepository->searchUsers($query);
        
        // Sérialiser les utilisateurs avec le groupe approprié
        $serializedUsers = $this->serializer->serialize($users, 'json', ['groups' => ['user:basic']]);
        $usersData = json_decode($serializedUsers, true);
        
        // Formater les URLs des avatars pour chaque utilisateur
        $formattedUsers = array_map(function($user) {
            if (isset($user['avatar'])) {
                $user['avatar'] = 'http://localhost:8080/uploads/' . $user['avatar'];
            }
            return $user;
        }, $usersData);
        
        return new JsonResponse(['users' => $formattedUsers]);
    }
} 
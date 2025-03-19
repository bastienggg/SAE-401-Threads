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

final class PostController extends AbstractController
{
    #[Route('/posts', name: 'app_post', methods: ['GET'], format: 'json')]
    #[IsGranted('ROLE_USER')]
    public function index(EntityManagerInterface $entityManager): JsonResponse
    {
        $posts = $entityManager->getRepository(Post::class)->findBy([], ['created_at' => 'DESC']);

        $formattedPosts = array_map(function ($post) {
            return [
                'id' => $post->getId(),
                'content' => $post->getContent(),
                'pseudo' => $post->getPseudo(),
                'created_at' => $post->getCreatedAt()->format('Y-m-d H:i:s'),
            ];
        }, $posts);

        return $this->json(['posts' => $formattedPosts]);
    }

    #[Route('/posts', name: 'posts.create', methods: ['POST'], format: 'json')]
    public function createPost(
        Request $request,
        SerializerInterface $serializer,
        ValidatorInterface $validator,
        PostService $postService
    ): JsonResponse {
        // Désérialiser le JSON en objet CreatePostPayload
        $payload = $serializer->deserialize($request->getContent(), CreatePostPayload::class, 'json');
    
        // Valider les données
        $errors = $validator->validate($payload);
        if (count($errors) > 0) {
            return $this->json(['errors' => (string) $errors], Response::HTTP_UNPROCESSABLE_ENTITY);
        }
    
        // Créer le post
        $postService->create($payload);
    
        return $this->json(null, Response::HTTP_CREATED);
    }
}
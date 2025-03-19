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

final class PostController extends AbstractController
{
    #[Route('/posts', name: 'app_post', methods: ['GET'], format: 'json')]
    #[IsGranted('ROLE_USER')]
    public function index(Request $request, PostRepository $postRepository) : Response
    {
    $page = max(1, (int) $request->query->get('page', 1));
    $count = 20;
    $offset = ($page - 1) * $count;

    $paginator = $postRepository->paginateAllOrderedByLatest($offset,   $count);
    $totalPostsCount = $paginator->count();

    $previousPage = $page > 1 ? $page - 1 : null;
    $nextPage = ($offset + $count) < $totalPostsCount ? $page + 1 : null;

    return $this->json([
        'posts' => iterator_to_array($paginator),
        'previous_page' => $previousPage,
        'next_page' => $nextPage
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
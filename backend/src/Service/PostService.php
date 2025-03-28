<?php

namespace App\Service;

use App\Dto\Payload\CreatePostPayload;
use App\Entity\Post;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

class PostService
{
    private EntityManagerInterface $entityManager;
    private UserRepository $userRepository;

    public function __construct(EntityManagerInterface $entityManager, UserRepository $userRepository)
    {
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
    }

    public function create(CreatePostPayload $payload): void
    {
        // Récupérer l'utilisateur à partir de l'ID
        $user = $this->userRepository->find($payload->getUserId());
        if (!$user) {
            throw new \InvalidArgumentException('User not found');
        }

        // Créer un nouveau post
        $post = new Post();
        $post->setContent($payload->getContent());
        $post->setCreatedAt(new \DateTime());
        $post->setUser($user); // Associer l'utilisateur au post

        // Persister le post
        $this->entityManager->persist($post);
        $this->entityManager->flush();
    }
}
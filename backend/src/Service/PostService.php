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
        $user = $this->userRepository->find($payload->getUserId());
        if (!$user) {
            throw new \InvalidArgumentException('User not found');
        }
    
        $post = new Post();
        $post->setContent($payload->getContent());
        $post->setCreatedAt(new \DateTime());
        $post->setUser($user);
    
        if ($payload->getPictures()) {
            $post->setPictures($payload->getPictures());
        }
    
        if ($payload->getVideos()) {
            $post->setVideos($payload->getVideos());
        }
    
        $this->entityManager->persist($post);
        $this->entityManager->flush();
    }
}
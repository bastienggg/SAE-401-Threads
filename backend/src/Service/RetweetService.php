<?php

namespace App\Service;

use App\Entity\Post;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use App\Repository\PostRepository;

class RetweetService
{
    private EntityManagerInterface $entityManager;
    private PostRepository $postRepository;

    public function __construct(EntityManagerInterface $entityManager, PostRepository $postRepository)
    {
        $this->entityManager = $entityManager;
        $this->postRepository = $postRepository;
    }

    public function createRetweet(User $user, Post $originalPost): Post
    {
        // Vérifier si l'utilisateur a déjà retweeté ce post
        $existingRetweet = $this->postRepository->findOneBy([
            'user' => $user,
            'originalPost' => $originalPost
        ]);

        if ($existingRetweet) {
            throw new \Exception('Vous avez déjà retweeté ce post');
        }

        // Créer le nouveau retweet
        $retweet = new Post();
        $retweet->setUser($user);
        $retweet->setContent($originalPost->getContent());
        $retweet->setMedia($originalPost->getMedia());
        $retweet->setCreatedAt(new \DateTimeImmutable());
        $retweet->setIsRetweet(true);
        $retweet->setOriginalPost($originalPost);

        // Incrémenter le compteur de retweets du post original
        $originalPost->incrementRetweetCount();

        $this->entityManager->persist($retweet);
        $this->entityManager->flush();

        return $retweet;
    }

    public function removeRetweet(User $user, Post $originalPost): void
    {
        $retweet = $this->postRepository->findOneBy([
            'user' => $user,
            'originalPost' => $originalPost
        ]);

        if (!$retweet) {
            throw new \Exception('Retweet non trouvé');
        }

        // Décrémenter le compteur de retweets du post original
        $originalPost->decrementRetweetCount();

        $this->entityManager->remove($retweet);
        $this->entityManager->flush();
    }
} 
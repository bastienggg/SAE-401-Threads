<?php

namespace App\Service;

use Doctrine\ORM\EntityManagerInterface;
use App\Entity\AccessToken;

class TokenValidator
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function isValidToken(string $token): bool
    {
        $accessToken = $this->entityManager->getRepository(AccessToken::class)->findOneBy(['token' => $token]);

        if ($accessToken && $accessToken->getExpiresAt() > new \DateTime()) {
            return true;
        }

        return false;
    }
}
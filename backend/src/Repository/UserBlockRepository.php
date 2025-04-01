<?php

namespace App\Repository;

use App\Entity\UserBlock;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UserBlockRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, UserBlock::class);
    }

    public function findBlockedUsers(int $userId): array
    {
        return $this->createQueryBuilder('ub')
            ->andWhere('ub.blocker = :userId')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getResult();
    }

    public function findBlockingUsers(int $userId): array
    {
        return $this->createQueryBuilder('ub')
            ->andWhere('ub.blocked = :userId')
            ->setParameter('userId', $userId)
            ->getQuery()
            ->getResult();
    }

    public function isBlocked(int $blockerId, int $blockedId): bool
    {
        $result = $this->createQueryBuilder('ub')
            ->andWhere('ub.blocker = :blockerId')
            ->andWhere('ub.blocked = :blockedId')
            ->setParameter('blockerId', $blockerId)
            ->setParameter('blockedId', $blockedId)
            ->getQuery()
            ->getResult();

        return !empty($result);
    }
} 
<?php

namespace App\Repository;

use App\Entity\Post;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Doctrine\ORM\Tools\Pagination\Paginator;

/**
 * @extends ServiceEntityRepository<Post>
 */
class PostRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Post::class);
    }

    public function paginateAllOrderedByLatest(int $offset, int $count): Paginator
    {
        try {
            $query = $this->createQueryBuilder('p')
                ->select('p', 'u')
                ->innerJoin('p.user', 'u')
                ->where('p.parent IS NULL')
                ->orderBy('p.is_pinned', 'DESC')
                ->addOrderBy('p.created_at', 'DESC')
                ->setFirstResult($offset)
                ->setMaxResults($count)
                ->getQuery()
            ;
        
            return new Paginator($query, false);
        } catch (\Exception $e) {
            throw new \Exception('Erreur lors de la pagination des posts: ' . $e->getMessage());
        }
    }

    public function paginateByUserOrderedByLatest(int $userId, int $offset, int $limit): Paginator
    {
        try {
            $query = $this->createQueryBuilder('p')
                ->select('p', 'u')
                ->innerJoin('p.user', 'u')
                ->where('p.user = :userId')
                ->andWhere('p.parent IS NULL')
                ->setParameter('userId', $userId)
                ->orderBy('p.is_pinned', 'DESC')
                ->addOrderBy('p.created_at', 'DESC')
                ->setFirstResult($offset)
                ->setMaxResults($limit)
                ->getQuery();
        
            return new Paginator($query, false);
        } catch (\Exception $e) {
            throw new \Exception('Erreur lors de la pagination des posts utilisateur: ' . $e->getMessage());
        }
    }
    //    /**
    //     * @return Post[] Returns an array of Post objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('p.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Post
    //    {
    //        return $this->createQueryBuilder('p')
    //            ->andWhere('p.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}

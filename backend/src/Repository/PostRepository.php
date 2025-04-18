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
                ->select('p', 'u', 'op', 'opu')
                ->leftJoin('p.user', 'u')
                ->leftJoin('p.originalPost', 'op')
                ->leftJoin('op.user', 'opu')
                ->where('p.parent IS NULL')
                ->orderBy('p.created_at', 'DESC')
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
                ->select('p', 'u', 'op', 'opu')
                ->leftJoin('p.user', 'u')
                ->leftJoin('p.originalPost', 'op')
                ->leftJoin('op.user', 'opu')
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

    public function searchPosts(string $query)
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.user', 'u')
            ->where('p.content LIKE :query')
            ->orWhere('u.pseudo LIKE :query')
            ->setParameter('query', '%' . $query . '%')
            ->orderBy('p.created_at', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findRetweetsByUser(int $userId): array
    {
        return $this->createQueryBuilder('p')
            ->select('p', 'u', 'op', 'opu')
            ->leftJoin('p.user', 'u')
            ->leftJoin('p.originalPost', 'op')
            ->leftJoin('op.user', 'opu')
            ->where('p.user = :userId')
            ->andWhere('p.is_retweet = true')
            ->setParameter('userId', $userId)
            ->orderBy('p.created_at', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findRetweetsOfPost(int $postId): array
    {
        return $this->createQueryBuilder('p')
            ->select('p', 'u')
            ->leftJoin('p.user', 'u')
            ->where('p.originalPost = :postId')
            ->setParameter('postId', $postId)
            ->orderBy('p.created_at', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function hasUserRetweeted(int $userId, int $postId): bool
    {
        $retweet = $this->createQueryBuilder('p')
            ->where('p.user = :userId')
            ->andWhere('p.originalPost = :postId')
            ->andWhere('p.is_retweet = true')
            ->setParameter('userId', $userId)
            ->setParameter('postId', $postId)
            ->getQuery()
            ->getOneOrNullResult();

        return $retweet !== null;
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

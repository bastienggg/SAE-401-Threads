<?php

namespace App\Controller;


use Symfony\Component\HttpFoundation\Request;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Security\Http\Attribute\IsGranted;


#[Route('/api')]
final class BlockedController extends AbstractController
{
    #[Route('/blocked/{id}', name: 'app_block_user', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')] 
    public function blockUser(int $id, EntityManagerInterface $entityManager): Response
    {
        $user = $entityManager->getRepository(User::class)->find($id);

        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $user->setBlocked(true);
        $entityManager->flush();

        return $this->json(['message' => 'User has been blocked successfully']);
    }

    #[Route('/blocked/{id}', name: 'app_unblock_user', methods: ['DELETE'])]
    #[IsGranted('ROLE_ADMIN')]
    public function unblockUser(int $id, EntityManagerInterface $entityManager): Response
    {
        $user = $entityManager->getRepository(User::class)->find($id);
    
        if (!$user) {
            return $this->json(['error' => 'User not found'], Response::HTTP_NOT_FOUND);
        }
    
        $user->setBlocked(false);
        $entityManager->flush();
    
        return $this->json(['message' => 'User has been unblocked successfully']);
    }  
}
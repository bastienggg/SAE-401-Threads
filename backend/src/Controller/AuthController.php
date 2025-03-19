<?php

namespace App\Controller;

use App\Repository\UserRepository;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;
use Psr\Log\LoggerInterface;


class AuthController extends AbstractController
{
    #[Route('/login', name: 'api_login', methods: ['POST'])]
    public function login(Request $request, UserRepository $userRepository, UserPasswordHasherInterface $passwordHasher, LoggerInterface $logger, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $password = $data['password'] ?? null;

        if (!$email || !$password) {
            $logger->error('Email and password are required');
            return new JsonResponse(['code' => 'C-3111 '], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            // Log the error
            $logger->error('Invalid email');
            // Retourner un message d'erreur personnalisé pour un email invalide
            return new JsonResponse(['code' => 'C-3121'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        if (!$passwordHasher->isPasswordValid($user, $password)) {
            // Log the error
            $logger->error('Invalid password');
            // Retourner un message d'erreur personnalisé pour un mot de passe invalide
            return new JsonResponse(['code' => 'C-3131'], JsonResponse::HTTP_UNAUTHORIZED);
        }

        $token = $user->getApiToken();

        if (!$token) {
            $token = bin2hex(random_bytes(32));
            $user->setApiToken($token);

            $entityManager->persist($user);
            $entityManager->flush();
        }

    return new JsonResponse(['token' => $token, 'pseudo' => $user->getPseudo(), 'code' => 'C-1101']);

    }

    
    #[Route('/register', name: 'api_register', methods: ['POST'])]
    public function register(Request $request, UserRepository $userRepository,  UserPasswordHasherInterface $passwordEncoder, EntityManagerInterface     $entityManager, MailerInterface $mailer, Environment $twig): JsonResponse
    {
    $data = json_decode($request->getContent(), true);

    $email = $data['email'] ?? null;
    $password = $data['password'] ?? null;
    $pseudo = $data['pseudo'] ?? null;

    if (!$email || !$password || !$pseudo) {
        return new JsonResponse(['code' => 'C-3111'], JsonResponse::HTTP_BAD_REQUEST);
    }

    $existingUser = $userRepository->findOneBy(['email' => $email]);

    if ($existingUser) {
        return new JsonResponse(['code' => 'C-3241'], JsonResponse::HTTP_CONFLICT);
    }

    $existingPseudo = $userRepository->findOneBy(['pseudo' => $pseudo]);

    if ($existingPseudo) {
        return new JsonResponse(['code' => 'C-3242'], JsonResponse::HTTP_CONFLICT);
    }

    $user = new User();
    $user->setEmail($email);
    $user->setPassword($passwordEncoder->hashPassword($user, $password));
    $user->setPseudo($pseudo);

    // Générer un code de vérification à 6 chiffres
    $verificationCode = random_int(100000, 999999);
    $user->setVerificationCode((string)$verificationCode);

    $entityManager->persist($user);
    $entityManager->flush();

    // Générer le contenu HTML de l'email
    $htmlContent = $twig->render('emails/verification_email.html.twig', [
        'verificationCode' => $verificationCode,
    ]);

    // Envoyer l'email de vérification
    $emailMessage = (new Email())
        ->from('no-reply@yourdomain.com')
        ->to($email)
        ->subject('Vérification de votre compte')
        ->html($htmlContent);

    $mailer->send($emailMessage);

    return new JsonResponse(['code' => 'C-1251'], JsonResponse::HTTP_CREATED);
    }

    #[Route('/verify', name: 'api_verify', methods: ['POST'])]
    public function verify(Request $request, UserRepository $userRepository,    EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? null;
        $verificationCode = $data['verificationCode'] ?? null;

        if (!$email || !$verificationCode) {
            return new JsonResponse(['code' => 'C-2301'], JsonResponse::HTTP_BAD_REQUEST);
        }

        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user) {
            return new JsonResponse(['code' => 'C-4121'],  JsonResponse::HTTP_NOT_FOUND);
        }

        if ($user->getVerificationCode() !== $verificationCode) {
            return new JsonResponse(['code' => 'C-3231'],   JsonResponse::HTTP_UNAUTHORIZED);
        }

        $user->setIsVerified(true);
        $user->setVerificationCode(0);

        $entityManager->persist($user);
        $entityManager->flush();

        return new JsonResponse(['code' => 'C-1301'],   JsonResponse::HTTP_OK);
    }

}
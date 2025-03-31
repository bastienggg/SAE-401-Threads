<?php

namespace App\Entity;

use App\Repository\FollowRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FollowRepository::class)]
class Follow
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'followers')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $profile = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'following')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $follower = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getProfile(): ?User
    {
        return $this->profile;
    }

    public function setProfile(?User $profile): self
    {
        $this->profile = $profile;

        return $this;
    }

    public function getFollower(): ?User
    {
        return $this->follower;
    }

    public function setFollower(?User $follower): self
    {
        $this->follower = $follower;

        return $this;
    }
}
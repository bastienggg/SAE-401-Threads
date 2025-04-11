<?php

namespace App\Entity;

use App\Repository\PostRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: PostRepository::class)]
class Post
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['post:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['post:read'])]
    private ?string $content = null;

    #[ORM\Column]
    #[Groups(['post:read'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\ManyToOne(inversedBy: 'posts')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['post:read'])]
    private ?User $user = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['post:read'])]
    private ?array $media = [];

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $is_censored = false;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $is_pinned = false;

    #[ORM\ManyToOne(targetEntity: Post::class, inversedBy: 'replies')]
    #[ORM\JoinColumn(name: 'parent_id', referencedColumnName: 'id', nullable: true)]
    private ?Post $parent = null;

    #[ORM\OneToMany(mappedBy: 'parent', targetEntity: Post::class)]
    private Collection $replies;

    #[ORM\Column(type: Types::BOOLEAN)]
    private bool $is_retweet = false;

    #[ORM\ManyToOne(targetEntity: Post::class)]
    #[ORM\JoinColumn(name: 'original_post_id', referencedColumnName: 'id', nullable: true)]
    private ?Post $originalPost = null;

    #[ORM\Column(type: Types::INTEGER)]
    private int $retweet_count = 0;

    public function __construct()
    {
        $this->replies = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): static
    {
        $this->id = $id;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getMedia(): ?array
    {
        return $this->media ?? [];
    }
    
    public function setMedia(?array $media): static
    {
        $this->media = $media;
    
        return $this;
    }

    public function isCensored(): bool
    {
        return $this->is_censored;
    }

    public function setIsCensored(bool $is_censored): static
    {
        $this->is_censored = $is_censored;
        return $this;
    }

    public function isPinned(): bool
    {
        return $this->is_pinned;
    }

    public function setIsPinned(bool $is_pinned): static
    {
        $this->is_pinned = $is_pinned;
        return $this;
    }

    public function getParent(): ?self
    {
        return $this->parent;
    }

    public function setParent(?self $parent): static
    {
        $this->parent = $parent;
        return $this;
    }

    public function getReplies(): Collection
    {
        return $this->replies;
    }

    public function addReply(self $reply): static
    {
        if (!$this->replies->contains($reply)) {
            $this->replies->add($reply);
            $reply->setParent($this);
        }
        return $this;
    }

    public function removeReply(self $reply): static
    {
        if ($this->replies->removeElement($reply)) {
            if ($reply->getParent() === $this) {
                $reply->setParent(null);
            }
        }
        return $this;
    }

    public function isRetweet(): bool
    {
        return $this->is_retweet;
    }

    public function setIsRetweet(bool $is_retweet): static
    {
        $this->is_retweet = $is_retweet;
        return $this;
    }

    public function getOriginalPost(): ?self
    {
        return $this->originalPost;
    }

    public function setOriginalPost(?self $originalPost): static
    {
        $this->originalPost = $originalPost;
        return $this;
    }

    public function getRetweetCount(): int
    {
        return $this->retweet_count;
    }

    public function setRetweetCount(int $retweet_count): static
    {
        $this->retweet_count = $retweet_count;
        return $this;
    }

    public function incrementRetweetCount(): static
    {
        $this->retweet_count++;
        return $this;
    }

    public function decrementRetweetCount(): static
    {
        if ($this->retweet_count > 0) {
            $this->retweet_count--;
        }
        return $this;
    }
}
<?php

namespace App\Dto\Payload;

class CreatePostPayload
{
    private ?int $userId = null;
    private ?string $content = null;
    private ?array $media = [];

    public function getUserId(): ?int
    {
        return $this->userId;
    }

    public function setUserId(int $userId): void
    {
        $this->userId = $userId;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): void
    {
        $this->content = $content;
    }



    public function getMedia(): ?array
    {
        return $this->media;
    }
    
    public function setMedia(?array $media): static
    {
        $this->media = $media;
    
        return $this;
    }
}
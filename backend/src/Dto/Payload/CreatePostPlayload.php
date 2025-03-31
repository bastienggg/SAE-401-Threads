<?php

namespace App\Dto\Payload;

class CreatePostPayload
{
    private ?int $userId = null;
    private ?string $content = null;
    private ?array $pictures = [];
    private ?array $videos = [];

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


    public function getPictures(): ?array
    {
        return $this->pictures;
    }
    
    public function setPictures(?array $pictures): static
    {
        $this->pictures = $pictures;
    
        return $this;
    }
    
    public function getVideos(): ?array
    {
        return $this->videos;
    }
    
    public function setVideos(?array $videos): static
    {
        $this->videos = $videos;
    
        return $this;
    }
}
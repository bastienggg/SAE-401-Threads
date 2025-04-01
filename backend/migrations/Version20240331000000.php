<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20240331000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add parent_id column to post table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE post ADD parent_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE post ADD CONSTRAINT FK_5A8A6C8D727ACA70 FOREIGN KEY (parent_id) REFERENCES post (id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE post DROP FOREIGN KEY FK_5A8A6C8D727ACA70');
        $this->addSql('ALTER TABLE post DROP parent_id');
    }
} 
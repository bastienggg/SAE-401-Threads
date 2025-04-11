<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250411081800 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post ADD original_post_id INT DEFAULT NULL, ADD is_retweet TINYINT(1) NOT NULL, ADD retweet_count INT NOT NULL');
        $this->addSql('ALTER TABLE post ADD CONSTRAINT FK_5A8A6C8DCD09ADDB FOREIGN KEY (original_post_id) REFERENCES post (id)');
        $this->addSql('CREATE INDEX IDX_5A8A6C8DCD09ADDB ON post (original_post_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post DROP FOREIGN KEY FK_5A8A6C8DCD09ADDB');
        $this->addSql('DROP INDEX IDX_5A8A6C8DCD09ADDB ON post');
        $this->addSql('ALTER TABLE post DROP original_post_id, DROP is_retweet, DROP retweet_count');
    }
}

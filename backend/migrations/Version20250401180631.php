<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250401180631 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post CHANGE is_censored is_censored TINYINT(1) NOT NULL');
        $this->addSql('ALTER TABLE post RENAME INDEX fk_5a8a6c8d727aca70 TO IDX_5A8A6C8D727ACA70');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE post CHANGE is_censored is_censored TINYINT(1) DEFAULT 0 NOT NULL');
        $this->addSql('ALTER TABLE post RENAME INDEX idx_5a8a6c8d727aca70 TO FK_5A8A6C8D727ACA70');
    }
}

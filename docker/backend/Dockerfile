# Use the official PHP 8.3 FPM image as the base image
FROM php:8.3-fpm

# Set the working directory to /app
WORKDIR /app/backend

# Install necessary dependencies
RUN apt-get update && \
    apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    libonig-dev

# Install PDO MySQL extension
RUN docker-php-ext-install pdo_mysql

# Install Composer globally
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN echo "post_max_size = 512M" >> /usr/local/etc/php/php.ini
RUN echo "upload_max_filesize = 512M" >> /usr/local/etc/php/php.ini



# Expose port 9000 for PHP-FPM
EXPOSE 9000

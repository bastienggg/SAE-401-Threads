# Use the official PHP 8.3 FPM image as the base image
FROM php:8.3-fpm

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

# Set the working directory to /var/www/html
WORKDIR /var/www/html

# Create uploads directory and set permissions
RUN mkdir -p /var/www/html/public/uploads && \
    chown -R www-data:www-data /var/www/html && \
    chmod -R 775 /var/www/html

# Add user to www-data group
RUN usermod -a -G www-data root

# Expose port 9000 for PHP-FPM
EXPOSE 9000

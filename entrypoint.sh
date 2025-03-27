#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
while ! nc -z "$DB_HOST" "$DB_PORT"; do
  sleep 1
done
echo "PostgreSQL is ready!"

echo "Running composer dump-autoload..."
composer dump-autoload --optimize

echo "Running migrations..."
php artisan migrate --force

echo "Creating storage link..."
php artisan storage:link || true

echo "Starting PHP development server..."
php artisan serve --host=0.0.0.0 --port=8000 &

echo "Container setup complete, waiting for background processes..."
wait
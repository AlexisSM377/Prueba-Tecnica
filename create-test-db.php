<?php

try {
    $pdo = new PDO('pgsql:host=localhost;port=5432', 'postgres', 'alexis');
    
    // Check if database exists
    $result = $pdo->query("SELECT 1 FROM pg_database WHERE datname = 'crud_escolar_test'");
    
    if ($result->rowCount() === 0) {
        $pdo->exec('CREATE DATABASE crud_escolar_test');
        echo "✓ Database 'crud_escolar_test' created successfully!\n";
    } else {
        echo "✓ Database 'crud_escolar_test' already exists.\n";
    }
} catch (Exception $e) {
    echo "✗ Error: " . $e->getMessage() . "\n";
    exit(1);
}

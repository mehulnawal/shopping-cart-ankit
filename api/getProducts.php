<?php
header('Content-Type: application/json; charset=utf-8');

$path = __DIR__ . '/../data/products.json';

if (!file_exists($path)) {
    echo json_encode([]);
    exit;
}

$content = file_get_contents($path);
if ($content === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to read products file.']);
    exit;
}

echo $content;

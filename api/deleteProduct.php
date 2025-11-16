<?php
header('Content-Type: application/json; charset=utf-8');

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !is_array($data) || empty($data['id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input.']);
    exit;
}

$path = __DIR__ . '/../data/products.json';
if (!file_exists($path)) {
    http_response_code(500);
    echo json_encode(['error' => 'Products file not found.']);
    exit;
}

$products = json_decode(file_get_contents($path), true) ?: [];
$new = [];
$found = false;

foreach ($products as $p) {
    if (isset($p['id']) && $p['id'] === $data['id']) {
        $found = true;
        continue; // skip it
    }
    $new[] = $p;
}

if (!$found) {
    http_response_code(404);
    echo json_encode(['error' => 'Product not found.']);
    exit;
}

$written = file_put_contents($path, json_encode($new, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);

if ($written === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write products file.']);
    exit;
}

echo json_encode(['success' => true]);

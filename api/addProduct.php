<?php
header('Content-Type: application/json; charset=utf-8');

// Read JSON input
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !is_array($data)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid input.']);
    exit;
}

$path = __DIR__ . '/../data/products.json';
$products = [];

// Read existing
if (file_exists($path)) {
    $json = file_get_contents($path);
    $products = json_decode($json, true) ?: [];
}

// Generate ID: find highest numeric suffix
$max = 0;
foreach ($products as $p) {
    if (isset($p['id'])) {
        if (preg_match('/P0*([0-9]+)/', $p['id'], $m)) {
            $n = intval($m[1]);
            if ($n > $max) $max = $n;
        }
    }
}
$newIndex = $max + 1;
$newId = 'P' . str_pad($newIndex, 4, '0', STR_PAD_LEFT);

// Basic sanitization / normalization
$product = [
    'id' => $newId,
    'name' => trim($data['name'] ?? ''),
    'image1' => trim($data['image1'] ?? ''),
    'image2' => trim($data['image2'] ?? ''),
    'price' => floatval($data['price'] ?? 0),
    'oldPrice' => floatval($data['oldPrice'] ?? 0),
    'discount' => intval($data['discount'] ?? 0),
    'category' => trim($data['category'] ?? ''),
    'description' => trim($data['description'] ?? ''),
    'rating' => isset($data['rating']) ? floatval($data['rating']) : round(mt_rand(40, 50) / 10, 1),
    'ratingCount' => isset($data['ratingCount']) ? intval($data['ratingCount']) : mt_rand(50, 5000)
];

// Add and save
$products[] = $product;
$written = file_put_contents($path, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);

if ($written === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write products file.']);
    exit;
}

echo json_encode(['success' => true, 'product' => $product]);

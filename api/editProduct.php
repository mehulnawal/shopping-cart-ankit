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
$found = false;

foreach ($products as $i => $p) {
    if (isset($p['id']) && $p['id'] === $data['id']) {
        // update fields (only expected keys)
        $products[$i]['name'] = trim($data['name'] ?? $p['name']);
        $products[$i]['image1'] = trim($data['image1'] ?? $p['image1']);
        $products[$i]['image2'] = trim($data['image2'] ?? $p['image2']);
        $products[$i]['price'] = floatval($data['price'] ?? $p['price']);
        $products[$i]['oldPrice'] = floatval($data['oldPrice'] ?? $p['oldPrice']);
        $products[$i]['discount'] = intval($data['discount'] ?? $p['discount']);
        $products[$i]['category'] = trim($data['category'] ?? $p['category']);
        $products[$i]['description'] = trim($data['description'] ?? $p['description']);
        $products[$i]['rating'] = isset($data['rating']) ? floatval($data['rating']) : $p['rating'];
        $products[$i]['ratingCount'] = isset($data['ratingCount']) ? intval($data['ratingCount']) : $p['ratingCount'];
        $found = true;
        break;
    }
}

if (!$found) {
    http_response_code(404);
    echo json_encode(['error' => 'Product not found.']);
    exit;
}

$written = file_put_contents($path, json_encode($products, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES), LOCK_EX);

if ($written === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to write products file.']);
    exit;
}

echo json_encode(['success' => true, 'product' => $products[$i]]);

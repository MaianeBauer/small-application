<?php

error_reporting(0);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, x-api-key");

function retornaJson($body, $statusCode = 200)
{
    header("Content-Type: application/json");
    http_response_code($statusCode);
    echo (json_encode($body));
    die();
}

function validaCampoBody($nomeCampo, $body)
{
    if (!array_key_exists($nomeCampo, $body)) {
        retornaJson([
            'erro' => true,
            'tipoErro' => 'CAMPO_OBRIGATORIO',
            'nomeCampo' => $nomeCampo
        ], 400);
    }
}

$requestMethod = $_SERVER['REQUEST_METHOD'];

if ($requestMethod === 'OPTIONS') {
    http_response_code(200);
    die();
}


if ($requestMethod !== 'POST') {
    http_response_code(405);
    die();
}

// Verifica a API Key
$headers = getallheaders();

if (!array_key_exists('x-api-key', $headers) || !array_key_exists('Content-Type', $headers)) {
    http_response_code(400);
    die();
}

if ($headers['x-api-key'] !== getenv('API_KEY')) {
    http_response_code(403);
    die();
}

// Verifica se o content-type é application/json
if ($headers['Content-Type'] !== 'application/json') {
    http_response_code(400);
    die();
}

$tempoAleatorio = rand(1, 5);
sleep($tempoAleatorio);


// Campos esperados
// Nome
// Email
// Senha
// Confirmação de senha
$body = json_decode(file_get_contents('php://input'), true);

validaCampoBody('nome', $body);
validaCampoBody('email', $body);
validaCampoBody('senha', $body);
validaCampoBody('confirmacaoSenha', $body);

// Valida individualmente os campos
//Nome
$nome = $body['nome'];

if ($nome === null || strlen($nome) === 0) {
    retornaJson([
        'erro' => true,
        'tipoErro' => 'CAMPO_INVALIDO',
        'nomeCampo' => 'nome'
    ], 400);
}

$email = $body['email'];
if ($email === null || strlen($email) === 0 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    retornaJson([
        'erro' => true,
        'tipoErro' => 'CAMPO_INVALIDO',
        'nomeCampo' => 'email'
    ], 400);
}

$senha = $body['senha'];
if ($senha === null || strlen($senha) < 8 
|| !preg_match('/[A-Z]/', $senha) 
|| !preg_match('/[a-z]/', $senha) 
|| !preg_match('/[0-9]/', $senha) ) {
    retornaJson([
        'erro' => true,
        'tipoErro' => 'CAMPO_INVALIDO',
        'nomeCampo' => 'senha'
    ], 400);
}

$confirmacaoSenha = $body['confirmacaoSenha'];
if ($confirmacaoSenha === null || $confirmacaoSenha !== $senha) {
    retornaJson([
        'erro' => true,
        'tipoErro' => 'CAMPO_INVALIDO',
        'nomeCampo' => 'confirmacaoSenha'
    ], 400);
}

// Valida emails que já existem
$emailsExistentes = [
    'teste@exemplo.com',
    'joao@exemplo.com',
    'maria@acme.net'
];

if(in_array($email, $emailsExistentes)) {
    retornaJson([
        'erro' => true,
        'tipoErro' => 'USUARIO_EXISTENTE',
    ], 400);
}

retornaJson([
    'erro' => false,
]);
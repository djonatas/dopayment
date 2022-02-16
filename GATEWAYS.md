# GATEWAY DE PAGAMENTOS  V1

# 1 - Gateway de pagamentos suportados:
- JUNO API
- YAPAY API
- PAGAR.ME API

# 1.1 JUNO API 
# REQUISITOS PARA INTEGRAÇÃO 
 - Ter o Resource token (token privado) da conta que irá gerar a cobrança.
    
    Exemplo autenticação:
    curl --location --request POST 'https://sandbox.boletobancario.com/authorization-server/oauth/token' \
    --header 'Authorization: Basic akU1ZEgxYkUyQTZhVGhEWjozOWlyU2NqV1psYkdCd1hCUF9rK0VtRmY3fFtTTXcleA==' \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode 'grant_type=client_credentials'


 - É necessário ter um token de autorização válido.

- PAGAMENTO COM BOLETOS (SPLIT)
    **Para o split será utilizado a propriedade recipientToken(array de strings) corresponde a cada conta digital envolvida.**
    **Caso o emissor delimitado no X-Resource-Token esteja envolvido na divisão, este também deve ser informado em um dos objetos desse array, além dos demais destinatários.**

        Método: POST
        Authorization: Bearer Token
        Header:  Key X-API-Version = 2 e X-Resource-Token = token privado
        Body: RAW 
        {
            "charge": {
                "pixKey": "stringstringstringstringstringstring",
                "pixIncludeImage": false,
                "description": "string",
                "references": [
                "string"
                ],
                "totalAmount": 0.01,
                "amount": 0.01,
                "dueDate": "yyyy-MM-dd",
                "installments": 0,
                "maxOverdueDays": 0,
                "fine": 0,
                "interest": "0.00",
                "discountAmount": "0.00",
                "discountDays": -1,
                "paymentTypes": [
                "<!-- BOLETO, BOLETO_PIX e CREDIT_CARD -->" 
                ],
                "paymentAdvance": true,
                "feeSchemaToken": "string",
                "split": [
                {
                    "recipientToken": "string",
                    "amount": 10,
                    "percentage": 10,
                    "amountRemainder": true,
                    "chargeFee": true
                }
                ]
            },
            "billing": {
                "name": "string",
                "document": "string",
                "email": "string",
                "address": {
                "street": "string",
                "number": "string",
                "complement": "string",
                "neighborhood": "string",
                "city": "string",
                "state": "string",
                "postCode": "string"
                },
                "secondaryEmail": "string",
                "phone": "string",
                "birthDate": "yyyy-MM-dd",
                "notify": false
            }
        }

# 1.2 PAGAR.ME API
# REQUISITOS PARA INTEGRAÇÃO 

**Instruções para o split**
    Para dar prosseguimento a esse tipo de pedido, é necessário que dentro de payments seja indicado que está sendo feito um Split com os seguintes dados:

    type(Tipo de Split. Pode ser feita em valores (flat) ou em porcentagem (percentage))
    amount(Valor destinado a cada recebedor)
    recipient_id (Identificação do recebedor)

    AUTH: 
        var fs = require('fs');
        const request = require("request");
        var body = JSON.parse(fs.readFileSync('body.json', 'utf8'));

        var options = {                 
            method: 'POST',             
            uri: 'https://api.pagar.me/core/v5/orders',                    
            headers: {               
            'Authorization': 'Basic ' + Buffer.from("sk_test_tra6ezsW3BtPPXQa:").toString('base64'),
            'Content-Type': 'application/json'              
            },
            json : body
        };    

        request(options, function(error, response, body) {  
            console.log(response.body);
        });

    {
        "items": [
            {
                "amount": 100,
                "description": "Chaveiro do Tesseract",
                "quantity": 1,
                "code": "12345"
            }
        ],
        "customer": {
            "name": "Tony Stark",
            "email": "Tony@Avangers.com"
        },
        "payments": [
            {
                "payment_method": "credit_card",
                "credit_card": {
                    "installments": 1,
                    "statement_descriptor": "AVENGERS",
                    "card": {
                        "number": "342793631858229",
                        "holder_name": "Tony Stark",
                        "exp_month": 1,
                        "exp_year": 30,
                        "cvv": "3531",
                        "billing_address": {
                            "line_1": "10880, Malibu Point, Malibu Central",
                            "zip_code": "90265",
                            "city": "Malibu",
                            "state": "CA",
                            "country": "US"
                        }
                    }
                },
                "split": [
                    {
                        "amount": 50,
                        "recipient_id": "rp_5yGwpMGckBHVYmb6",
                        "type": "percentage",
                        "options": {
                            "charge_processing_fee": true,
                            "charge_remainder_fee": true,
                            "liable": true
                        }
                    },
                    {
                        "amount": 50,
                        "type": "percentage",
                        "recipient_id": "rp_yLnAyVpHbQIqZxwO",
                        "options": {
                            "charge_processing_fee": false,
                            "charge_remainder_fee": false,
                            "liable": false
                        }
                    }
                ]
            }
        ]
    }

# 1.3 YAPAY API
# REQUISITOS PARA INTEGRAÇÃO 

    {  
        "token_account":"SEU_TOKEN_AQUI",
        "customer":{  
            "contacts":[  
                {  
                    "type_contact":"H",
                    "number_contact":"1133221122"
                },{  
                    "type_contact":"M",
                    "number_contact":"11999999999"
                }         
            ],
            "addresses":[  
                {  
                    "type_address":"B",
                    "postal_code":"17000-000",
                    "street":"Av Themyscira",
                    "number":"1001",
                    "completion":"A",
                    "neighborhood":"Jd das Rochas",
                    "city":"Themyscira",
                    "state":"SP"
                }
            ],
            "name":"Diana Prince",
            "birth_date": "21/05/1941",
            "cpf":"50235335142",
            "email":"email@cliente.com.br"
        },
        "transaction_product":[  
            {  
                "description":"Camiseta Wonder Woman",
                "quantity":"1",
                "price_unit":"130.00",
                "code": "1",
                "sku_code": "0001",
                "extra": "Informação Extra"
            }
        ],
        "transaction":{  
            "available_payment_methods": "2,3,4,5,6,7,14,15,16,18,19,21,22,23,27",
            "customer_ip":"127.0.0.1",
            "shipping_type":"Sedex",
            "shipping_price":"12",
            "price_discount": "",
            "url_notification":"http://www.loja.com.br/notificacao",
            "free": "Campo Livre"      
            
        },

        "affiliates":[{  
                "email":"emaildoafiliado@afiliado.com",
                "percentage":"15"
            }
        ],
        "payment":{  
            "payment_method_id":"3",
            "card_name": "DIANA PRINCE",
            "card_number": "4111111111111111",
            "card_expdate_month": "01",
            "card_expdate_year": "2021",
            "card_cvv": "644",
            "split": "1"
        }
    }

# ESTRUTURA DE DADOS

    {
        "gateway": {
            "env": "prod, sandbox",
            "token": "aqui a chave privada do gateway para autenticar as requisições"
            "type": "YAPAY, PAGARME, JUNO"
        },
        "paymentData": {
            "objeto especifico do gateway escolhido"
        }
    }
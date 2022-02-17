const doPayment = require('./index');

const transaction = {
    gateway: {
    env: 'prod',
    type: 3,
    token: 'syhdfvgadsvfadghvhgfv'
	},
    customer_ip: '127.0.0.1',
    customerInfo: {
        name: 'Joao da Silva',
        email: 'joao.dasilva@gmail.com',
        document: '43822043800',
        birthDate: '18/02/2000',
        contactInfo: {
            phone: '12123456',
            cellphone: '12854723698'
        },
        billingInfo: {
            street: 'Rua do Joao da Silva',
            number: '98',
            complement: 'teste da silva',
            neighborhood: 'Bairro da Silva',
            city: 'Sao Jose dos Campos',
            state: 'SP',
            postalCode: '12345-678'

        },
    }, 
    paymentInfo: {
        amount: 150,
        fee: 0,
        totalAmount: 150,
        duedate: '16/02/2000',
        payment:  { 
			paymentMethod: 1,
            statement_descriptor: 'MINHA ECOMMERCE',
			card: {
	            card_name: 'JOAO SILVA',
	            card_number: '1111111111111111',
	            card_expdate_month: 2,
	            card_expdate_year: 2028,
	            card_cvv: 123,
	            split: 2
			}

		},
        split: [
        {
            percentage: 1,
            amount: 100,
            afiliate_identifier: 'shdvbahdfgdasf'
        }, 
        {                
        	percentage: 2,
            amount: 99,
            afiliate_identifier: 'sdhfvahsdkfg'
        },
        {
        	percentage: 3,
            amount: 97.02,
            afiliate_identifier: 'sdbajbhvjhb'
        }]
    },
    products: [{ 
            price: 50,
            description: 'produto 1',
            quantity: 1,
            code: 65151651
    },
    { 
            price: 50,
            description: 'produto 2',
            quantity: 2,
            code: 541651651  	
    }]
};

//FORCE GLOBAL ERROR
new doPayment(transaction).processPayment();
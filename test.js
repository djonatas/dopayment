const doPayment = require('./index');

const transaction = {
    gateway: {
    env: 'sandbox',
    type: 1,
    token: '689fe612f4e2089',
    clientId: 'K8f87L6uLdAeGoKJ',
    clientSecret: 'qn1)Vy1Q(d$[{gV$aIN{QC!1{_7Gz^',
    resourceToken: '8BBBD0B32384C36FEC491ECEFE094CEBFE55CCF0F6ADAE9CEC035C9B6204B32B715683B1A520C610'
	},
    customer_ip: '127.0.0.1',
    customerInfo: {
        name: 'Joao da Silva',
        email: 'joao.dasilva@gmail.com',
        document: '43822043800',
        birthDate: '18/02/2000',
        contactInfo: {
            phone: '+5511999998888',
            cellphone: '+5511999998888'
        },
        billingInfo: {
            street: 'Rua do Joao da Silva',
            number: '98',
            complement: 'teste da silva',
            neighborhood: 'Bairro da Silva',
            city: 'Sao Jose dos Campos',
            state: 'SP',
            postalCode: '12345678'

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
	            card_name: 'STEPHEN STRANGE',
	            card_number: '4111111111111111',
	            card_expdate_month: 01,
	            card_expdate_year: 2021,
	            card_cvv: 644,
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

const dopay = new doPayment(transaction);

const start = async function(a, b) {
    const result = await dopay.processPayment()
    console.log(result)
}
  
start();
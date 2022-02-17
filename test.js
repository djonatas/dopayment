const doPayment = require('./index');

const transaction = {
    gateway: {
    env: 'sandbox',
    type: 2,
    token: 'ak_test_cHeJ72DhMFrtKmzO4X5yNgCCA1j1AQ',
    clientId: 'K8f87L6uLdAeGoKJ',
    clientSecret: 'qn1)Vy1Q(d$[{gV$aIN{QC!1{_7Gz^',
    resourceToken: '8BBBD0B32384C36FA215B08D5C42F854303CFAAEF978A5E7C8B5829C0273854B'
	},
    customer_ip: '127.0.0.1',
    customerInfo: {
        name: 'Joao da Silva',
        email: 'joao.dasilva@gmail.com',
        document: '43822043800',
        birthDate: '18/02/2000',
        contactInfo: {
            phone: '11999998888',
            cellphone: '11999998888'
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
	            card_expdate_month: '01',
	            card_expdate_year: '2021',
	            card_cvv: '644',
	            split: 2
			}

		},
        split: [
        {
            percentage: 1,
            amount: 100,
            afiliate_identifier: 're_cj6cglnhc0bbcbt6dbsl8fdcs'
        }, 
        {                
        	percentage: 2,
            amount: 99,
            afiliate_identifier: 're_cj6cgqzy31irpmx6dj9h3xdln'
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

const start = async function() {
    const result = await dopay.processPayment()
    console.log(result)
}
  
start();
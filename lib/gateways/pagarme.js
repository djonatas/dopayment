const pagarme = require('pagarme');
const utilEnum = require('../../obj/enum/enum');

class PagarmeHandler {
    constructor(generic) {
        const {
            gateway,
            customerInfo,
            paymentInfo,
            products
        } = generic;
        const { billingInfo, contactInfo } = customerInfo;
        this.gateway = gateway;
        this.customer_ip = generic.customer_ip;
        this.customerInfo = customerInfo;
        this.billingInfo = billingInfo;
        this.contactInfo = contactInfo;
        this.paymentInfo = paymentInfo;
        this.paymentData = paymentInfo.paymentData;
        this.products = products;
        this.contactInfo.phone = `+55${this.contactInfo.phone}`
        this.contactInfo.cellphone = `+55${this.contactInfo.cellphone}`
    }

    setModel() {
        this.pagarmeModel = this.identifyPayment();
        this.pagarmeModel.amount = this.paymentInfo.amount;
        this.pagarmeModel.items = this.setProducts();
        this.pagarmeModel.customer = {
                name: this.customerInfo.name,
                external_id: '#3311',
                email: this.customerInfo.email,
                type: 'individual',
                country: 'br',
                phone_numbers: [ this.contactInfo.phone, this.contactInfo.cellphone ],
                documents: [{ type: 'cpf', number: this.customerInfo.document }]
        };
        this.pagarmeModel.billing = {
            name: this.customerInfo.name,
            address: {
                zipcode: this.billingInfo.postalCode,
                street: this.billingInfo.street,
                street_number: this.billingInfo.number,
                neighborhood: this.billingInfo.neighborhood,
                city: this.billingInfo.city,
                state: this.billingInfo.state,
                country: 'br'
            }
        }
    }

    identifyPayment() {
        if(this.paymentData.type === utilEnum.paymentMethods.DEBIT_CARD)
            return this.debitCard();

        return this.creditCard();
    }

    creditCard() {
        return {
            payment_method: "credit_card",
            card_number: this.paymentData.creditCardInfo.card_number,
            card_cvv: this.paymentData.creditCardInfo.card_cvv,
            card_expiration_date: `${this.paymentData.creditCardInfo.card_expdate_month}${this.paymentData.creditCardInfo.card_expdate_year}`,
            card_holder_name: this.paymentData.creditCardInfo.card_name,
            installments: this.paymentData.creditCardInfo.split,
            statement_descriptor: this.paymentData.statement_descriptor,
            split_rules: this.setSplit(this.paymentInfo.split)
        }
    }

    debitCard() {
        return {
            payment_method: "debit_card",
            card_number: this.paymentData.creditCardInfo.card_number,
            card_cvv: this.paymentData.creditCardInfo.card_cvv,
            card_expiration_date: `${this.paymentData.creditCardInfo.card_expdate_month}${this.paymentData.creditCardInfo.card_expdate_year}`,
            card_holder_name: this.paymentData.creditCardInfo.card_name,
            statement_descriptor: this.paymentData.statement_descriptor,
            split_rules: this.setSplit(this.paymentInfo.split)
        }
    }

    setProducts() {
        const products = [];

        this.products.forEach(product => {
            products.push({
                title: product.description,
                quantity: product.quantity,
                unit_price: product.price,
                tangible: true,
                id: product.code.toString()
            });
       });

       return products;
    }

    setSplit(rawSplit) {
        let splits = [];
        rawSplit.forEach(split => {
            splits.push({
                percentage: split.percentage,
                recipient_id: split.afiliate_identifier,
                charge_processing_fee: false,
                liable: false
            });
        });

        return splits;
    }

    async doTransaction() {
        this.setModel();
        const client = await pagarme.client.connect({
            api_key: this.gateway.token 
        });
        
        return await client.transactions
        .create(this.pagarmeModel)
        .catch(function(e) {
            return e.response.errors;
        });
    }
}

module.exports = PagarmeHandler;
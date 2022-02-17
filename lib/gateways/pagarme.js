const pagarme = require('pagarme');
const utilEnum = require('../../obj/enum/enum');

class PagarmeHandler {
    constructor(generic) {
        const { gateway, customerInfo, paymentInfo, products } = generic;
        const { billingInfo, contactInfo } = customerInfo;
        this.gateway = gateway;
        this.customer_ip = generic.customer_ip;
        this.customerInfo = customerInfo;
        this.billingInfo = billingInfo;
        this.contactInfo = contactInfo;
        this.paymentInfo = paymentInfo;
        this.paymentData = paymentInfo.paymentData;
        this.products = products;
    }

    setModel() {
        this.pagarmeModel = {
            amount: this.paymentInfo.amount,
            payment_method: "credit_card",
            card_number: this.paymentData.creditCardInfo.card_number,
            card_cvv: '123',
            card_expiration_date: '0922',
            card_holder_name: "Morpheus Fishburne",
            items: this.setProducts(),
            customer: {
                name: this.customerInfo.name,
                external_id: '#3311',
                email: this.customerInfo.email,
                type: 'individual',
                country: 'br',
                phone_numbers: [ this.contactInfo.phone, this.contactInfo.cellphone ],
                documents: [{ type: 'cpf', number: this.customerInfo.document }]
            },
            billing: {
                name: this.customerInfo.name,
                address: {
                    zipcode: this.billingInfo.postalCode,
                    street: this.billingInfo.street,
                    street_number: this.billingInfo.number,
                    neighborhood: this.billingInfo.neighborhood,
                    city: this.billingInfo.city,
                    state: this.billingInfo.state,
                    country: "br"
                }
            }
        };
    }

    setPayment() {
       const payment =  [];
       payment.push(this.identifyPayment())

       return payment;
    }

    identifyPayment() {
        if(this.paymentData.type === utilEnum.paymentMethods.DEBIT_CARD)
            return this.debitCard();

        return this.creditCard();
    }

    creditCard() {
        const creditCard = {
            payment_method: "credit_card",
            credit_card: {
                installments: this.paymentData.creditCardInfo.split,
                statement_descriptor: this.paymentData.statement_descriptor,
                card: {
                    number: this.paymentData.creditCardInfo.card_number,
                    holder_name: this.paymentData.creditCardInfo.card_name,
                    exp_month: this.paymentData.creditCardInfo.card_expdate_month,
                    exp_year: this.paymentData.creditCardInfo.card_expdate_year,
                    cvv: this.paymentData.creditCardInfo.card_cvv,
                    billing_address: {
                        line_1: `${this.billingInfo.street}, ${this.billingInfo.number}, ${this.billingInfo.neighborhood}`,
                        zip_code: this.billingInfo.postalCode,
                        city: this.billingInfo.city,
                        state: this.billingInfo.state,
                        country: "BR"
                    }
                }
            },
            split: this.setSplit(this.paymentInfo.split)
        }

        return creditCard;
    }

    debitCard() {
        const debitCard = {
            payment_method: "debit_card",
            debit_card: {
                statement_descriptor: this.paymentData.statement_descriptor,
                card: {
                    number: this.paymentData.creditCardInfo.card_number,
                    holder_name: this.paymentData.creditCardInfo.card_name,
                    exp_month: this.paymentData.creditCardInfo.card_expdate_month,
                    exp_year: this.paymentData.creditCardInfo.card_expdate_year,
                    cvv: this.paymentData.creditCardInfo.card_cvv,
                }
            },
            split: this.setSplit(this.paymentInfo.split)
        }

        return debitCard;
    }

    setProducts() {
        const products = [];

        this.products.forEach(product => {
            products.push({
                title: product.description,
                quantity: product.quantity,
                unit_price: product.price,
                tangible: true,
                id:"1"
            });
       });

       return products;
    }

    setSplit(rawSplit) {
        let splits = [];
        rawSplit.forEach(split => {
            splits.push({
                amount: split.percentage,
                type: "percentage",
                recipient_id: split.afiliate_identifier,
                options: {
                    charge_processing_fee: false,
                    charge_remainder_fee: false,
                    liable: false
                }
            });
        });

        return splits;
    }

    async doTransaction() {
        this.setModel();
        const client = await pagarme.client.connect({ 
            api_key: this.gateway.token 
        });
        
        const transaction = await client.transactions
        .create(this.pagarmeModel)
        .catch(function(e) {
            return e.response.errors;
        });

        return transaction;
    }
}

module.exports = PagarmeHandler;
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
            items: this.setProducts(),
            customer: {
                name: this.customerInfo.name,
                email: this.customerInfo.email
            },
            payments: this.setPayment()
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
                description: product.description,
                quantity: product.quantity,
                amount: product.price,
                code: product.code
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

    doTransaction() {
        this.setModel();

        console.log(JSON.stringify(this.pagarmeModel));
    }
}

module.exports = PagarmeHandler;
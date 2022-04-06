const Juno = require('juno-api');

class JunoHandler {
    constructor(generic) {
        const { gateway, customerInfo, paymentInfo, products } = generic;
        const { billingInfo, contactInfo } = customerInfo;
        this.gateway = gateway;
        this.description = generic.description;
        this.customerInfo = customerInfo;
        this.billingInfo = billingInfo;
        this.contactInfo = contactInfo;
        this.paymentInfo = paymentInfo;
        this.products = products;
    }
    
    setModel() {
        this.transaction = {
            charge: {
                description: this.description,
                totalAmount: this.setProducts(),
                installments: this.paymentInfo.paymentData.split,
                paymentTypes: [ 'CREDIT_CARD' ],
                paymentAdvance: true,
                split: this.setSplit(this.paymentInfo.split)
            },
            billing: {
                name: this.customerInfo.name,
                document: this.customerInfo.document,
                email: this.customerInfo.email,
                address: {
                    street: this.billingInfo.street,
                    number: this.billingInfo.number,
                    neighborhood: this.billingInfo.neighborhood,
                    city: this.billingInfo.city,
                    state: this.billingInfo.state,
                    postCode: this.billingInfo.postalCode
                },
                phone: this.contactInfo.cellphone,
                birthDate: this.customerInfo.birthDate,
                notify: false
            },
            payment: {
                chargeId: '',
                billing: {
                  email: this.customerInfo.email,
                  address: {
                    street: this.billingInfo.street,
                    number: this.billingInfo.number,
                    neighborhood: this.billingInfo.neighborhood,
                    city: this.billingInfo.city,
                    state: this.billingInfo.state,
                    postCode: this.billingInfo.postalCode
                  },
                  delayed: false
                },
                creditCardDetails: {
                  creditCardHash: this.paymentInfo.paymentData.creditCardHash
                }
            }
        }
    }

    setProducts() {
        let totalAmount = 0;
        this.products.forEach(product => {
            totalAmount = totalAmount + product.price;
        });

        return totalAmount;
     }

    setSplit(rawSplit) {
        let splits = [];
        rawSplit.forEach(split => {
            splits.push({
                recipientToken: split.afiliate_identifier,
                percentage: split.percentage,
                amountRemainder: true,
                chargeFee: true
            });
        });

        return splits;
    }

    async doTransaction() {
        this.setModel();
        this.junoAuth = new Juno({
            clientId: this.gateway.clientId,
            clientSecret: this.gateway.clientSecret,
            isProd: false
        });
        this.token = await this.junoAuth.authorization.accessToken();
        
        this.juno = new Juno({
            accessToken: this.token.access_token,
            resourceToken: this.gateway.resourceToken,
            isProd: false
        });

        const result = await this.juno.charge.create(this.transaction);
        return result;
    }
}

module.exports = JunoHandler;
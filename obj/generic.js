const CommonValidator = require('../lib/validators/commonValidator');
const utilEnum = require('./enum/enum');
class Generic {
    constructor(obj) {
        this.objValidator = new CommonValidator(obj);
        this.objValidator.genericValidation();
        const validationResult = this.objValidator.validationResult();
        if (validationResult.isValid) {
            this.init(obj);
        }

        this.errors = validationResult.errors;
    }

    init(obj) {
        const { gateway, customerInfo, paymentInfo, products } = obj;
        const { billingInfo } = customerInfo;
        this.gateway = {
            env: !gateway.env ? 'prod' : gateway.env,
            type: gateway.type,
            token: gateway.token
        };

        this.transaction = {
            gateway: this.gateway,
            customer_ip: !obj.customer_ip ? '127.0.0.1' : obj.customer_ip,
            customerInfo: {
                name: customerInfo.name,
                email: customerInfo.email,
                document: customerInfo.document,
                birthDate: customerInfo.birthDate,
                contactInfo: {
                    phone: customerInfo.contactInfo.phone,
                    cellphone: customerInfo.contactInfo.cellphone
                },
                billingInfo: {
                    street: billingInfo.street,
                    number: billingInfo.number,
                    complement: billingInfo.complement,
                    neighborhood: billingInfo.neighborhood,
                    city: billingInfo.city,
                    state: billingInfo.state,
                    postalCode: billingInfo.postalCode

                },
            }, 
            paymentInfo: {
                amount: paymentInfo.amount,
                fee: paymentInfo.fee,
                totalAmount: paymentInfo.totalAmount,
                duedate: paymentInfo.duedate,
                paymentData: this.setGenericPaymentData(paymentInfo.payment),
                split: this.setGenericSplit(paymentInfo.split)
            },
            products: this.setGenericProduct(products),
            errors: this.errors
        }        
    }

    setGenericPaymentData(data) {
        switch (data.paymentMethod) {
            case utilEnum.paymentMethods.CREDIT_CARD:
                return {
                    type: utilEnum.paymentMethods.CREDIT_CARD,
                    statement_descriptor: data.statement_descriptor,
                    creditCardInfo: { 
                        card_name: data.card.card_name,
                        card_number: data.card.card_number,
                        card_expdate_month: data.card.card_expdate_month,
                        card_expdate_year: data.card.card_expdate_year,
                        card_cvv: data.card.card_cvv,
                        split: data.card.split
                    }
                };
            case utilEnum.paymentMethods.DEBIT_CARD:
                return {
                    type: utilEnum.paymentMethods.DEBIT_CARD,
                    statement_descriptor: data.statement_descriptor,
                    debitCardInfo: { 
                        card_name: data.card.card_name,
                        card_number: data.card.card_number,
                        card_expdate_month: data.card.card_expdate_month,
                        card_expdate_year: data.card.card_expdate_year,
                        card_cvv: data.card.card_cvv
                    }
                };
            case utilEnum.paymentMethods.BOLETO:
                return {
                    type: utilEnum.paymentMethods.BOLETO,
                    boletoInfo: { 
                       //TODO implement payments with boletos
                    }
                };
            case utilEnum.paymentMethods.PIX:
                return {
                    type: utilEnum.paymentMethods.PIX,
                    pixInfo: { 
                        pixKey: data.pix.pixKey,
                        pixIncludeImage: data.pix.pixKey,
                    }
                };
            default:
                return null;
        }
    }

    setGenericSplit(data) {
        let splits = [];
        data.forEach(split => {
            splits.push({
                percentage: split.percentage,
                amount: split.amount,
                afiliate_identifier: split.afiliate_identifier
            });
        });

        return splits;
    }

    setGenericProduct(data) {
        let products = [];
        data.forEach(product => {
            products.push({
            price: product.price,
            description: product.description,
            quantity: product.quantity,
            code: product.code
            });
        });

        return products;
    }

    getTransactionGeneric() {
        return this.transaction;
    }
}

module.exports = Generic;
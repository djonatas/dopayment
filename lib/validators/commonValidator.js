const Validation = require('./validation');

const validation = new Validation();

class CommonValidator {
    constructor(body) {
        this.gateway = body.gateway;
        this.customerInfo = body.customerInfo;
        this.billingInfo = body.customerInfo.billingInfo;
        this.contactInfo = body.customerInfo.contactInfo;
        this.paymentInfo = body.paymentInfo;
        this.products = body.products;
        this.validation = validation;
    }

    hasPaymentValue() {
        this.validation.isRequired(this.paymentInfo.amount, 'BASE-Validator: The attribute "amount" is required');
    }

    hasPaymentMethod() {
        this.validation.isRequired(this.paymentInfo.payment.paymentMethod, 'BASE-Validator: The payment attribute "type" is required');
    }

    hasToken() {
        this.validation.isRequired(this.gateway.token, 'BASE-Validator: The gateway attribute "token" is required');
    }

    genericValidation() {
        this.hasPaymentMethod();
        this.hasPaymentValue();
        this.hasToken;
    }

    validationResult() {
        return { isValid: this.validation.isValid(), errors: this.validation.returnErrors()};
    }
}

module.exports = CommonValidator;
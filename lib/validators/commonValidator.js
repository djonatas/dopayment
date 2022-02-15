const Validation = require('./validation');

const validation = new Validation();

class CommonValidator {
    constructor(body) {
        this.paymentData = body.paymentData;
        this.gatewayConfig = body.gateway;
        this.validation = validation;
    }

    hasPaymentValue() {
        this.validation.isRequired(paymentData.amount, 'The attribute "amount" is required');
    }

    hasPaymentMethod() {
        this.validation.isRequired(this.paymentData.paymentMethod, 'The attribute "paymentMethod" is required');
    }

    hasToken() {
        this.validation.isRequired(this.this.gatewayConfig.token, 'The gateway attribute "token" is required');
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
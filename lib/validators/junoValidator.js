const CommonValidator = require('./commonValidator');
const JunoHandler = require('../gateways/junoapi');

class JunoValidator extends CommonValidator {
    constructor(body) {
        super(body);
        const { customer_ip, products } = body;
        this.raw = body;
        this.customer_ip = customer_ip;
        this.products = products;
    }

    hasValidCustomer() {
        this.validation.isRequired(this.customerInfo.name, 'YAPAY-Validator: The customer attribute "name" is required');
        this.validation.isRequired(this.customerInfo.email, 'YAPAY-Validator: The customer attribute "email" is required');
        this.validation.isEmail(this.customerInfo.email, 'YAPAY-Validator: The attribute "email" is not valid');
    }

    hasValidCustomerAddress() {
        if (!this.billingInfo) {
            this.validation.isRequired(this.billingInfo, 'YAPAY-Validator: Customer billing address must be defined');
        }

        this.validation.isRequired(this.billingInfo.postalCode, 'YAPAY-Validator: The customer billing address attribute "postalCode" is required');
        this.validation.isRequired(this.billingInfo.street, 'YAPAY-Validator: The customer billing address attribute "street" is required');
        this.validation.isRequired(this.billingInfo.number, 'YAPAY-Validator: The customer billing address attribute "number" is required');
        this.validation.isRequired(this.billingInfo.neighborhood, 'YAPAY-Validator: The customer billing address attribute "neighborhood" is required');
        this.validation.isRequired(this.billingInfo.city, 'YAPAY-Validator: The customer billing address attribute "city" is required');
        this.validation.isRequired(this.billingInfo.state, 'YAPAY-Validator: The customer billing address attribute "state" is required');
    }

    hasValidPayment() {
        this.validation.isRequired(this.paymentInfo.paymentData.type, 'YAPAY-Validator: The payment attribute "type" is required');
    }

    hasValidTransactionProduct() {
        this.products.forEach(product => {
            this.validation.isRequired(product.price, 'YAPAY-Validator: The transaction product attribute "price" is required');
        });
    }

    validatePagarmeObj() {
        this.hasValidCustomer();
        this.hasValidCustomerAddress();
        this.hasValidPayment();
        this.hasValidTransactionProduct();

        const validationResult = this.validationResult();

        if(validationResult.isValid) {
            return new JunoHandler(this.raw);
        } else {
            return validationResult;
        }
    }
}

module.exports = JunoValidator;
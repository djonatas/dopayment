const CommonValidator = require('./commonValidator');
const Yapay = require('../gateways/yapay');

class YapayValidator extends CommonValidator {
    constructor(body) {
        super(body);
        this.gatewayConfig = body.gateway;
        this.paymentData = body.paymentData;
    }

    hasBasicProps() {
        this.validation.hasPaymentMethod();
        this.validation.hasPaymentValue();
    }

    hasValidCustomer() {
        this.validation.isRequired(this.paymentData.customer.name, 'The customer attribute "name" is required');
        this.validation.isRequired(this.paymentData.customer.cpf, 'The customer attribute "cpf" is required');
        this.validation.isRequired(this.paymentData.customer.email, 'The customer attribute "email" is required');
        this.validation.isEmail(this.paymentData.customer.email, 'The attribute "email" is not valid');
    }

    hasValidCustomerContact() {
        this.paymentData.customer.contacts.forEach(conctactInfo => {
            this.validation.isRequired(conctactInfo.type_contact, 'The customer contact attribute "type_contact" is required');
            this.validation.isRequired(conctactInfo.number_contact, 'The customer contact attribute "number_contact" is required');
        });
    }

    hasValidCustomerAddress() {
        this.paymentData.customer.addresses.forEach(address => {
            this.validation.isRequired(address.type_address, 'The customer address attribute "type_address" is required');
            this.validation.isRequired(address.postal_code, 'The customer address attribute "postal_code" is required');
            this.validation.isRequired(address.street, 'The customer address attribute "street" is required');
            this.validation.isRequired(address.number, 'The customer address attribute "number" is required');
            this.validation.isRequired(address.neighborhood, 'The customer address attribute "neighborhood" is required');
            this.validation.isRequired(address.city, 'The customer address attribute "city" is required');
            this.validation.isRequired(address.state, 'The customer address attribute "state" is required');
        });
    }

    hasTransactionCustomerIp() {
        this.validation.isRequired(this.paymentData.transaction.customer_ip, 'The transaction attribute "customer_ip" is required');
    }

    hasValidTransactionProduct() {
        this.paymentData.transaction_product.forEach(product => {
            this.validation.isRequired(product.description, 'The transaction product attribute "description" is required');
            this.validation.isRequired(product.quantity, 'The transaction product attribute "quantity" is required');
            this.validation.isRequired(product.price_unit, 'The transaction product attribute "price_unit" is required');
        });
    }

    hasValidPayment() {
        this.validation.isRequired(this.paymentData.payment.payment_method_id, 'The payment attribute "payment_method_id" is required');
        this.validation.isRequired(this.paymentData.payment.split, 'The payment attribute "split" is required');
    }

    validateYapayObj() {
        this.hasBasicProps();
        this.hasValidCustomer();
        this.hasValidCustomerContact();
        this.hasValidCustomerAddress();
        this.hasTransactionCustomerIp();
        this.hasValidTransactionProduct();
        this.hasValidPayment();

        const validationResult = this.validation.validationResult();

        if(validationResult.isValid) {
            return new Yapay(this.paymentData, this.gatewayConfig);
        } else {
            return validationResult;
        }
    }
}

module.exports = YapayValidator;

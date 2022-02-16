const CommonValidator = require('./commonValidator');
const YapayHandler = require('../gateways/yapay');

class YapayValidator extends CommonValidator {
    constructor(body) {
        super(body);
        const { customer_ip, products } = body;
        this.raw = body;
        this.customer_ip = customer_ip;
        this.products = products;
    }

    hasValidCustomer() {
        this.validation.isRequired(this.customerInfo.name, 'YAPAY-Validator: The customer attribute "name" is required');
        this.validation.isRequired(this.customerInfo.document, 'YAPAY-Validator: The customer attribute "document" is required');
        this.validation.isRequired(this.customerInfo.email, 'YAPAY-Validator: The customer attribute "email" is required');
        this.validation.isEmail(this.customerInfo.email, 'YAPAY-Validator: The attribute "email" is not valid');
    }

    hasValidCustomerContact() {
        if (!this.customerInfo.contactInfo) {
            this.validation.isRequired(conctactInfo, 'YAPAY-Validator: Customer contact must be defined');
        }
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

    hasTransactionCustomerIp() {
        this.validation.isRequired(this.customer_ip, 'YAPAY-Validator: The attribute "customer_ip" is required');
    }

    hasValidTransactionProduct() {
        this.products.forEach(product => {
            this.validation.isRequired(product.description, 'YAPAY-Validator: The transaction product attribute "description" is required');
            this.validation.isRequired(product.quantity, 'YAPAY-Validator: The transaction product attribute "quantity" is required');
            this.validation.isRequired(product.price, 'YAPAY-Validator: The transaction product attribute "price_unit" is required');
        });
    }

    hasValidPayment() {
        this.validation.isRequired(this.paymentInfo.paymentData.type, 'YAPAY-Validator: The payment attribute "payment_method_id" is required');
    }

    validateYapayObj() {
        this.hasValidCustomer();
        this.hasValidCustomerContact();
        this.hasValidCustomerAddress();
        this.hasTransactionCustomerIp();
        this.hasValidTransactionProduct();
        this.hasValidPayment();

        const validationResult = this.validationResult();

        if(validationResult.isValid) {
            return new YapayHandler(this.raw);
        } else {
            return validationResult;
        }
    }
}

module.exports = YapayValidator;

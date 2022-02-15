const CommonValidator = require('./commonValidator');

class PagarmeValidator extends CommonValidator {
    constructor(body) {
        super(body);
        this.gatewayConfig = body.gateway;
        this.paymentData = body.paymentData;
    }

    

}

module.exports = PagarmeValidator;
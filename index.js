const YapayValidator = require('./lib/validators/yapayValidator')
const Pagarme = require('./lib/gateways/pagarme');
const Juno = require('./lib/gateways/junoapi');

const transactionResult = { };

class Payment {
    constructor(body) {
        switch(body.gateway.type){
            case paymentGateways.YAPAY:
                this.paymentInfo = new 
                this.gateway = new YapayValidator(body);
                break;
            case paymentGateways.PAGARME:
                this.gateway = new Pagarme(body.payment);
                break;
            case paymentGateways.JUNO:
                this.gateway = new Juno(body.payment);
                break;
            default:
                this.gateway = { isValid: false, errors: 'The gateway entered is invalid' };
        }
    }

    processPayment() {
        if(typeof this.gateway.errors === 'undefined') {
            transactionResult = this.gateway.doPay();

            //TODO do something with result

            //return data
            return transactionResult;
        }else {
            return this.gateway.errors;
        }
    }
}

module.exports = Payment;
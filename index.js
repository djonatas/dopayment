const YapayValidator = require('./lib/validators/yapayValidator');
const PagarmeValidator = require('./lib/validators/pagarmeValidator');
const JunoValidator = require('./lib/validators/junoValidator');
const Generic = require('./obj/generic');
const paymentGateways = require('./obj/enum/enum');

let transactionResult = { };

class Payment {
    constructor(body) {
        if(!body.gateway) 
        {
            this.gateway = {};
            this.gateway.errors = { isValid: false, errors: 'The gateway entered is invalid' };
        }else {
            let generic = {};
            switch(body.gateway.type){
                case paymentGateways.supportedGateways.YAPAY:
                    generic = new Generic(body).getTransactionGeneric();
                    if(generic.errors)       
                    console.log(JSON.stringify(errors));   

                    this.gateway = new YapayValidator(generic).validateYapayObj();
                    break;
                case paymentGateways.supportedGateways.PAGARME:
                    generic = new Generic(body).getTransactionGeneric();
                    if(generic.errors)       
                    console.log(JSON.stringify(errors));   

                    this.gateway = new PagarmeValidator(generic).validatePagarmeObj();
                    break;
                case paymentGateways.supportedGateways.JUNO:
                    generic = new Generic(body).getTransactionGeneric();
                    if(generic.errors)       
                    console.log(JSON.stringify(errors));   

                    this.gateway = new JunoValidator(generic).validatePagarmeObj();
                    break;
                default:
                    this.gateway.errors = { isValid: false, errors: 'The gateway entered is invalid' };
            }
        }
    }

    async processPayment() {
        if(!this.gateway.errors) {
            try {
                transactionResult = await this.gateway.doTransaction();
                return transactionResult;
            } catch (error) {
                return error;
            }
        }else {
            return this.gateway.errors;
        }
    }
}

module.exports = Payment;
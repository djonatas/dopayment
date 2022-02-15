const CommonValidator = require('../lib/validators/commonValidator');
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
        const { gateway, payment } = obj;
        const { customerInfo, billingInfo } = payment;
        this.gateway = {
            env: !gateway.env ? 'prod' : gateway.env,
            type: gateway.type,
            token: gateway.token
        };

        this.transaction = {
            customerInfo = {
                name: customerInfo.name,
                email: customerInfo.email,
                document: customerInfo.document,
                birthDate = customerInfo.birthDate,
                contactInfo = {
                    phone: customerInfo.phone,
                    cellphone: customerInfo.cellphone
                },
                billingInfo = {
                    street: billingInfo.adress.street,
                    number: billingInfo.adress.number,
                    complement: billingInfo.adress.complement,
                    neighborhood: billingInfo.adress.neighborhood,
                    city: billingInfo.city,
                    state: billingInfo.state,
                    postCode: billingInfo.postCode

                },

            }, 
            payment = {
                
            }
        }        
    }


}

module.exports = Generic;
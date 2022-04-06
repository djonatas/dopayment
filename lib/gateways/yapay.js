const Yapay = require('yapay-node');

class YapayHandler {
    constructor(generic) {
        const { gateway, customerInfo, paymentInfo, products } = generic;
        const { billingInfo, contactInfo } = customerInfo;
        this.gateway = gateway;
        this.customer_ip = generic.customer_ip;
        this.customerInfo = customerInfo;
        this.billingInfo = billingInfo;
        this.contactInfo = contactInfo;
        this.paymentInfo = paymentInfo;
        this.paymentData = paymentInfo.paymentData;
        this.products = products;
        this.yapay = new Yapay({
            token: this.gateway.token,
            sandbox: this.gateway.env === 'prod' ? false : true, 
            //reseller: 'ABCDEFGH12345678ABCDEFGH12345678' //opcional
        });
    }

    setModel() {
        this.yapay.setCustomer({
            email: this.customerInfo.email,
            name: this.customerInfo.name,
            cpf: this.customerInfo.document,
            phone_number: this.contactInfo.cellphone
        });

        //Setting deliver address
        this.yapay.setAddress({
            type_address: 'B', //'B' para Entrega, 'D' para Cobrança
            postal_code: this.billingInfo.postalCode,
            street: this.billingInfo.street,
            number: this.billingInfo.number,
            neighborhood: this.billingInfo.neighborhood,
            city: this.billingInfo.city,
            state: this.billingInfo.state
        });

        //Setting billing address as the same of deliver
        this.yapay.setAddress({
            type_address: 'D', //'B' para Entrega, 'D' para Cobrança
            postal_code: this.billingInfo.postalCode,
            street: this.billingInfo.street,
            number: this.billingInfo.number,
            neighborhood: this.billingInfo.neighborhood,
            city: this.billingInfo.city,
            state: this.billingInfo.state
        });

        this.yapay.setShipping({
            price: 10,
            type: 'Sedex'
        });

        this.yapay.setUrlNotification(this.gateway.notificationUrl);

        this.setProducts();

        //this.yapay.transactionData.affiliates = this.setSplit(this.paymentInfo.split);
    }

    setAdditionalFields() {
        
    }

    setProducts() {
       this.products.forEach(product => {
            this.yapay.addProduct({
                description: product.description,
                quantity: product.quantity,
                price: product.price
            });
       });
    }

    setSplit(rawSplit) {
        let splits = [];
        rawSplit.forEach(split => {
            splits.push({
                email: split.afiliate_identifier,
                percentage: split.percentage
            });
        });

        return splits;
    }

   async doTransaction() {
        this.setModel();
        return new Promise(resolve => {
            this.yapay.payment({
                card_number: this.paymentData.creditCardInfo.card_number,
                card_name: this.paymentData.creditCardInfo.card_name,
                card_expire_month: this.paymentData.creditCardInfo.card_expdate_month,
                card_expire_year: this.paymentData.creditCardInfo.card_expdate_year,
                card_cvv: this.paymentData.creditCardInfo.card_cvv,
                split: this.paymentData.creditCardInfo.card_number
            }, response => resolve(response));
        });
    }
}

module.exports = YapayHandler;
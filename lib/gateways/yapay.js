const Yapay = require('yapay-node');

class YapayHandler {
    constructor(generic) {
        console.log('handler');
        const { gateway, customerInfo, paymentInfo, products } = generic;
        const { billingInfo, contactInfo } = customerInfo;
        this.gateway = gateway;
        this.customer_ip = generic.customer_ip;
        this.customerInfo = customerInfo;
        this.billingInfo = billingInfo;
        this.contactInfo = contactInfo;
        this.paymentInfo = paymentInfo;
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

        this.yapay.setUrlNotification({
            url: this.gateway.notificationUrl
        })

        this.setProducts();

        this.yapay.transactionData.affiliates = this.setSplit(this.paymentInfo.split);
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

    doTransaction() {
        this.setModel();
        let testCartd = {
            card_number: this.paymentInfo.paymentData.card_number,
            card_name: this.paymentInfo.paymentData.card_name,
            card_expire_month: this.paymentInfo.paymentData.card_expdate_month,
            card_expire_year: this.paymentInfo.paymentData.card_expdate_year,
            card_cvv: this.paymentInfo.paymentData.card_cvv,
            split: this.paymentInfo.paymentData.split
        };

        console.log(JSON.stringify(this.yapay.transactionData));
        console.log(JSON.stringify(testCartd));
        
        // yapay.payment({
        //     card_number: this.paymentInfo.paymentData.card_number,
        //     card_name: this.paymentInfo.paymentData.card_name,
        //     card_expire_month: this.paymentInfo.paymentData.card_expdate_month,
        //     card_expire_year: this.paymentInfo.paymentData.card_expdate_year,
        //     card_cvv: this.paymentInfo.paymentData.card_cvv,
        //     split: this.paymentInfo.paymentData.split
        // }, (err, result) => {
        //     return { errors: err, result: result }
        // });
    }
}

module.exports = YapayHandler;
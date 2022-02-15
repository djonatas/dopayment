const https = require('https');

class Yapay {
    constructor(body) {
        switch(body.gateway.env){
            case 'prod':
                this.env = { hostname: 'https://api.intermediador.yapay.com.br/', path: 'api/v3/transactions/payment', port: 443 };
                break;
            case 'sandbox':
                this.env = { hostname: 'https://api.intermediador.sandbox.yapay.com.br/', path: 'api/v3/transactions/payment', port: 443 };
                break;
            default:
                this.env = false;
        }
    }

    doPay() {
        return this.doHttpRequest(JSON.stringify(body.payment));
    }

    doHttpRequest(data) {

        if(typeof this.env.hostname === 'undefined') {
            return { error: 'The entered gateway env is not valid!' };
        }

        const options = {
            hostname: this.env.hostname,
            port: this.env.port,
            path: this.env.path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data
            }
        };

        const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            
            res.on('data', d => {
                process.stdout.write(d)
            })
        });
          
        req.on('error', error => {
        console.error(error)
        });
          
        req.write(data);
        req.end();
    }
}

module.exports = Yapay;
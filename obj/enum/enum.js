const _paymentMethods = {
  CREDIT_CARD: 1,
  DEBIT_CARD: 2,
  BOLETO: 3,
  PIX: 4
};

const _supportedGateways = {
  YAPAY: 1,
  PAGARME: 2,
  JUNO: 3
};

class EnumUtils {

  static get paymentMethods() {
    return _paymentMethods;
  }

  static get supportedGateways() {
    return _supportedGateways;
  }

}

module.exports = EnumUtils;

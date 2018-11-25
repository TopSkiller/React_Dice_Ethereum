import etherollAbi from './etheroll-abi';

// TODO require vs import
const SolidityEvent = require('web3/lib/web3/event.js');

const Networks = Object.freeze({ mainnet: 1, morden: 2, ropsten: 3 });

const contractAddresses = {
  [Networks.mainnet]: '0xA52e014B3f5Cc48287c2D483A3E026C32cc76E6d',
  [Networks.ropsten]: '0xe12c6dEb59f37011d2D9FdeC77A6f1A8f3B8B1e8',
};

const etherscanUrls = {
  [Networks.mainnet]: 'https://etherscan.io',
  [Networks.ropsten]: 'https://ropsten.etherscan.io',
};


class EtherollContract {
  constructor(web3, address) {
    this.web3 = web3;
    this.address = address;
    if (typeof address === 'undefined') {
      this.address = contractAddresses[web3.version.network];
    }
    this.abi = etherollAbi;
    this.web3Contract = web3.eth.contract(etherollAbi).at(this.address);
  }

  getSolidityEvents() {
    const events = {};
    this.abi.forEach((definition) => {
      if (definition.type !== 'event') {
        return;
      }
      events[definition.name] = new SolidityEvent(this.web3, definition, this.address);
    });
    return events;
  }

  // Returns sha3 signature of events, e.g.
  // {'LogResult': '0x6883...5c88', 'LogBet': '0x1cb5...75c4'}
  getEventSignatures() {
    const signatures = {};
    const events = this.getSolidityEvents();
    Object.keys(events).forEach((eventName) => {
      signatures[eventName] = events[eventName].signature;
    });
    return signatures;
  }

  getSolidityEvent(eventSignature) {
    const events = this.getSolidityEvents();
    const matchingEvent = Object.keys(events).filter(key => (
      events[key].signature() === eventSignature.replace('0x', '')
    ));
    return events[matchingEvent];
  }

  decodeEvent(_evnt) {
    // SolidityEvent.decode() seems to be mutating the object, hence the copy
    const evnt = { ..._evnt };
    const solidityEvent = this.getSolidityEvent(evnt.topics[0]);
    const decoded = solidityEvent.decode(evnt);
    return decoded;
  }
}


export {
  EtherollContract, etherscanUrls, Networks, contractAddresses,
};

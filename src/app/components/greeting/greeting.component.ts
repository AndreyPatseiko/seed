import {Component, OnInit} from '@angular/core';
import Web3 from 'web3';
import {greeting} from '../../../assets/contracts/abi';

@Component({
  selector: 'app-greeting',
  templateUrl: './greeting.component.html',
  styleUrls: ['../shared-wallet/shared-wallet.component.sass']
})
export class GreetingComponent implements OnInit {
  public web3: Web3;
  public terminal = [];
  public wallets = {
    first: {
      address: '0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b',
      privateKey: '0xc293f871deab7fc6bc6c21f5ddd76fa529b10a7ca0b1823b95d3a30ecbdd7657',
      balance: 0
    },
    second: {
      address: '0x4fd55f6A8A3b4BbBcBd8e3C129F88A12f4E67C1a',
      privateKey: '0x3981e18719b1401b167d48528674ad8847e8b989912152008bda3a52c993638a',
      balance: 0
    }
  };
  private smartContract;
  public smartContractAddress = '0xA3CF323A6b8858c34d8b81760D3cD20bE71a5504';
  public currentSmartContract;


  constructor() {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546'));
    this.smartContract = new this.web3.eth.Contract(greeting.abi, this.wallets.first.address, {
      from: this.wallets.first.address,
      data: '0x' + greeting.byteCode,
      gas: 5700000
    });
    console.log(this.smartContract);
  }

  ngOnInit(): void {
    this.getWalletBalance();
    this.addListenersForContract();
  }

  onDeployNewSmartContract(): void {
    this.pushTerminalMessage('send new contract into test net');
    // unlock account
    this.web3.eth.accounts.wallet.add(this.wallets.first.privateKey);
    this.smartContract.deploy({
      data: '0x' + greeting.byteCode,
      arguments: ['Placeholder']
    }).send({
      from: this.wallets.first.address,
      gas: 5700000,
      gasPrice: '300000000'
    }).bind(this)
      .then(newContractInstance => this.addListenersForContract(newContractInstance.contractAddress))
      .catch(e => console.log(e.message));
  }

  addListenersForContract(smartContractAddress?: string): void {
    this.smartContractAddress = smartContractAddress ? smartContractAddress : this.smartContractAddress;
    this.pushTerminalMessage('add listen to contract address ' + this.smartContractAddress);

    this.currentSmartContract = new this.web3.eth.Contract(greeting.abi, this.smartContractAddress);

    this.currentSmartContract.events.Sent()
      .on('data', event => this.pushTerminalMessage('Sent event data ' + event))
      .on('changed', event => this.pushTerminalMessage('Sent event data change ' + event))
      .on('error', console.error);

  }

  getContractData(): void {
    this.currentSmartContract.methods.greet().call()
      .then(res => this.pushTerminalMessage('Greeting: ' + res))
      .catch(err => console.log(err.message));
  }

  changeGreetingMessage(target: string): void {
    const message = 'Hi user number ' + (Math.random() * 100).toFixed(0);
    this.pushTerminalMessage('New greeting ' + message + '; Pay for this transaction ' + this.wallets[target].address);
    // unlock account
    this.web3.eth.accounts.wallet.add(this.wallets[target].privateKey);

    this.currentSmartContract.methods.setGreeting(message).send({
      from: this.wallets[target].address,
      gas: 5700000,
      gasPrice: '300000000'
    });
  }

  pushTerminalMessage(message: string) {
    this.terminal.push(message);
  }

  getWalletBalance(): void {
    for (const key in this.wallets) {
      this.web3.eth.getBalance(this.wallets[key].address)
        .then(balance => this.wallets[key].balance = balance / 1e18);
    }
  }


}

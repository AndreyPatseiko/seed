import {Component, OnInit} from '@angular/core';
import Web3 from 'web3';

import {greeting} from '../../contracts/abi'

@Component({
  selector: 'app-shared-wallet',
  templateUrl: './shared-wallet.component.html',
  styleUrls: ['./shared-wallet.component.sass']
})

export class SharedWalletComponent implements OnInit {
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
  }
  private smartContract;
  public smartContractAddress: string;
  public currentSmartContract;

  constructor() {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545'));
    this.smartContract = new this.web3.eth.Contract(greeting.abi, this.wallets.first.address, {
      from: this.wallets.first.address,
      data: greeting.byteCode,
      gas: 5700000
    });

    this.smartContract.deploy({
      data: greeting.byteCode,
      arguments: ['Placeholder Greeting']
    })
  }

  ngOnInit(): void {
    this.getWalletBalance();
    this.addListenersForContract();
  }

  getWalletBalance(): void {
    for (const key in this.wallets) {
      this.web3.eth.getBalance(this.wallets[key].address)
        .then(balance => this.wallets[key].balance = balance / 1e18)
    }
  }

  getContractData(): void {
    this.currentSmartContract.methods.greet().call()
      .then(res => this.pushTerminalMessage(`Greet: ${res}`))
      .catch(err => console.log(err.message));
  }

  onDeployNewSmartContract(): void {
    console.log('send new contract')
    // unlock account
    this.web3.eth.accounts.wallet.add(this.wallets.first.privateKey);

    this.smartContract.send({
      from: this.wallets.first.address,
      gas: 5700000,
      gasPrice: '300000000'
    })
      .then(function (newContractInstance) {
        this.smartContractAddress = newContractInstance.options.addres;
        this.pushTerminalMessage('Contract address : ' + this.smartContractAddress);
        this.addListenersForContract();
      })
      .catch(e => console.log(e.message))


  }

  addListenersForContract(): void {
    this.currentSmartContract = new this.web3.eth.Contract(greeting.abi, '0x108b5626bb87d54FF5C27AbC8A1c82A5693FE5f8');

    this.currentSmartContract.events.Sent()
      .on('data', function (event) {
        console.log('data ', event);
      })
      .on('changed', function (event) {
        console.log('changed ', event)
      })
      .on('error', console.error);
  }

  pushTerminalMessage(message: string) {
    this.terminal.push(message)
  }

  changeContractMessage(target: string): void {
    console.log('Target ', target)
    // unlock account
    this.web3.eth.accounts.wallet.add(this.wallets[target].privateKey);

    const message = 'HI user number ' + (Math.random() * 100).toFixed(0) + `. From target: ${target}`;

    this.currentSmartContract.methods.setGreeting(message).send({
      from: this.wallets[target].address,
      gas: 5700000,
      gasPrice: '300000000'
    })
  }


}

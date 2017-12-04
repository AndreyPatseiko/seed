import {Component, OnInit} from '@angular/core';
import Web3 from 'web3';

import {sharedWallet} from '../../../assets/contracts/abi'

@Component({
  selector: 'app-shared-wallet',
  templateUrl: './shared-wallet.component.html',
  styleUrls: ['./shared-wallet.component.sass']
})

export class SharedWalletComponent implements OnInit {
  public web3: Web3;
  public terminal = [];
  public newOwner: string;
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
  public smartContractAddress = '0x23a9D87F044b95b8406C7C8116eBdb2A0C27f25E';
  public currentSmartContract;

  constructor() {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545'));
    this.smartContract = new this.web3.eth.Contract(sharedWallet.abi, this.wallets.first.address, {
      from: this.wallets.first.address,
      data: '0x' + sharedWallet.byteCode,
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
      data: '0x' + sharedWallet.byteCode,
      arguments: [[this.wallets.first.address], 1, 3]
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
    this.currentSmartContract = new this.web3.eth.Contract(sharedWallet.abi, this.smartContractAddress);

    this.currentSmartContract.events.OwnerAdded()
      .on('data', event => this.pushTerminalMessage('OwnerAdded data ' + event))
      .on('changed', event => this.pushTerminalMessage('OwnerAdded change ' + event))
      .on('error', console.error);
  }

  getContractData(): void {
    this.currentSmartContract.methods.m_numOwners().call()
      .then(res => this.pushTerminalMessage('All owners:' + res))
      .catch(err => console.log(err.message));
  }

  addNewOwner(target: string): void {
    this.pushTerminalMessage('New owner address ' + this.newOwner + '; Pay for this transaction ' + this.wallets[target].address);
    // unlock account
    this.web3.eth.accounts.wallet.add(this.wallets[target].privateKey);

    this.currentSmartContract.methods.addOwner(this.newOwner).send({
      from: this.wallets[target].address,
      gas: 5700000,
      gasPrice: '300000000'
    });
  }

  sendTransaction() {

  }

  confirmTransaction() {

  }

  pushTerminalMessage(message: string) {
    this.terminal.push(message);
  }

  getWalletBalance(): void {
    for (const key in this.wallets) {
      this.web3.eth.getBalance(this.wallets[key].address)
        .then(balance => this.wallets[key].balance = balance / 1e18)
    }
  }

}

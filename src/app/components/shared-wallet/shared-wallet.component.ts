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
  public transactionHash: string;
  public wallets = {
    first: {
      address: '0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b',
      privateKey: '0xc293f871deab7fc6bc6c21f5ddd76fa529b10a7ca0b1823b95d3a30ecbdd7657',
      balance: 0
    },
    second: {
      address: '0xb450F8be8C6941d4E20B587926116b2B31369BF2',
      privateKey: '0x5b1cefb5141e9c140575f231574f7cd201f9066ebf247bbb6e8dc143164fc9b9',
      balance: 0
    },
    third: {
      address: '64A384963B0B2184AE99fd0F37c2Bf5CB079F76B',
      privateKey: '0xdf48655999177484a4c109e93553bc52ae737992b4791015510be5c96aea30b1',
      balance: 0
    }
  };
  private smartContract;
  public smartContractAddress = '0x2d1Da5538599ce96eF6fbA78645d5Fc07D2B125D';
  public currentSmartContract;

  constructor() {
    this.web3 = new Web3('http://192.168.11.214:5145')
    // this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://ethwal.inside.cactussoft.biz:5146'));
    console.log(this.web3);
    this.smartContract = new this.web3.eth.Contract(sharedWallet.abi, this.wallets.second.address, {
      from: this.wallets.second.address,
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
    this.web3.eth.accounts.wallet.add(this.wallets.second.privateKey);

    this.smartContract.deploy({
      data: '0x' + sharedWallet.byteCode,
      arguments: [[], 0, 100] // owners, sign count, transaction without sign from 1day
    }).send({
      from: this.wallets.second.address,
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

    this.currentSmartContract.events.allEvents()
      .on('data', event => {
        console.log('data event ', event)
        this.pushTerminalMessage('event data ' + event)
      })
      .on('changed', event => {
        console.log('change event ', event)
        this.pushTerminalMessage('event change ' + event)
      })
      .on('error', console.error);

    // this.currentSmartContract.events.SingleTransact()
    //   .on('data', event => this.pushTerminalMessage('SingleTransact data ' + event))
    //   .on('changed', event => this.pushTerminalMessage('SingleTransact change ' + event))
    //   .on('error', console.error);
  }

  getContractData(): void {
    this.currentSmartContract.methods.m_numOwners().call()
      .then(res => {
        this.showOwners(res);
        this.pushTerminalMessage('All owners:' + res);
        return false;
      })
      .catch(err => console.log(err.message));
  }

  showOwners(count: number): void {
    for (let i = 0; i < count; i++) {
      this.currentSmartContract.methods.getOwner(i).call()
        .then(res => this.pushTerminalMessage('Owners ' + i + ': ' + res))
        .catch(err => console.log(err.message));
    }
  }

  sendTransaction(initiator: string) {
    this.pushTerminalMessage('Try send transaction');
    // unlock account
    this.web3.eth.accounts.wallet.add(this.wallets[initiator].privateKey);

    this.currentSmartContract.methods.execute(this.wallets['third'].address, 0.1 * 1e18, '0x' + sharedWallet.byteCode).send({
      from: this.wallets[initiator].address,
      gas: 5700000,
      gasPrice: '300000000'
    })
      .then(res => console.log('ADD transaction ', res))
      .catch(err => console.log('err from add transaction  ', err))
  }

  sendSingleTransaction(initiator: string) {
    // this.pushTerminalMessage('Try send single transaction');
    // // unlock account
    // this.web3.eth.accounts.wallet.add(this.wallets[initiator].privateKey);
    //
    // this.currentSmartContract.methods.execute(this.wallets['third'].address, 0.5 * 1e18, '0x' + sharedWallet.byteCode).send({
    //   from: this.wallets['first'].address,
    //   gas: 5700000,
    //   gasPrice: '300000000'
    // })
    //   .then(res => console.log('add transaction ', res))
    //   .catch(err => console.log('err from add transaction  ', err))
  }

  hasConfirmed(initiator: string) {
    console.log('send hash ' + this.transactionHash, 'address ', this.wallets[initiator].address)
    this.currentSmartContract.methods.hasConfirmed(this.transactionHash, this.wallets[initiator].address)
      .call()
      .then(res => console.log('hasConfirmed ', res))
      .catch(err => console.log('err hasConfirmed  ', err))
  }

  confirmTransaction(initiator: string) {
    this.pushTerminalMessage('Confirm hash ' + this.transactionHash);
    // unlock account
    this.web3.eth.accounts.wallet.add(this.wallets[initiator].privateKey);

    this.currentSmartContract.methods.confirm(this.transactionHash)
        .send({
        from: this.wallets[initiator].address,
        gas: 5700000,
        gasPrice: '300000000'
      })
      .then(res => console.log('confirm transaction ', res))
      .catch(err => console.log('err confirm  ', err))
  }

  pushTerminalMessage(message: string) {
    this.terminal.unshift(message);
  }

  getWalletBalance(): void {
    for (const key in this.wallets) {
      this.web3.eth.getBalance(this.wallets[key].address)
        .then(balance => this.wallets[key].balance = balance / 1e18)
    }
  }


  // Owners
  removeOwner(target: string): void {
    this.pushTerminalMessage('remove owner address ' + this.newOwner + '; Pay for this transaction ' + this.wallets[target].address);
    // unlock account
    this.web3.eth.accounts.wallet.add(this.wallets[target].privateKey);

    this.currentSmartContract.methods.removeOwner(this.newOwner).send({
      from: this.wallets[target].address,
      gas: 5700000,
      gasPrice: '300000000'
    });
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

}

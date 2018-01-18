import {Component, OnInit} from '@angular/core';
import Web3 from 'web3';
import {realMultiSingContract} from '../../../assets/contracts/abi'

@Component({
  selector: 'app-simple-smart-transaction',
  templateUrl: './work-shared-wallets.component.html'

})

export class WorkSharedWalletsComponent implements OnInit {
  public contractID = 0;
  public inputData;
  public web3: Web3;
  public terminal = [];
  public newOwner: string;
  public transactionHash: string;
  public contractBalance: number;
  public wallets = {
    first: {
      address: '0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b',
      privateKey: '0xc293f871deab7fc6bc6c21f5ddd76fa529b10a7ca0b1823b95d3a30ecbdd7657',
      balance: 0,
      transactionStatus: undefined
    },
    second: {
      address: '0xb450F8be8C6941d4E20B587926116b2B31369BF2',
      privateKey: '0x5b1cefb5141e9c140575f231574f7cd201f9066ebf247bbb6e8dc143164fc9b9',
      balance: 0,
      transactionStatus: undefined
    },
    third: {
      address: '0xaDDD15dc59DA77cDC8acC79a89d17a463D2c684B',
      privateKey: '0xba8ad4fb09e6449349c7e94c8ea42b63ed14227e4bcf81ab90cfa8d3238a6e7b',
      balance: 0,
      transactionStatus: undefined
    }
  };
  private smartContract;
  public smartContractAddress = '0x6cB349f5aED2497f3483Ac42f8549c73BC9ecf57';
  public currentSmartContract;

  constructor() {
    // this.web3 = new Web3('http://192.168.11.214:5145');
    // this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8546'));
    // this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://ethwal.inside.cactussoft.biz:5146'));
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://192.168.11.214:5146'));
    console.log(this.web3);
    this.smartContract = new this.web3.eth.Contract(realMultiSingContract.abi, this.wallets.first.address, {
      from: this.wallets.first.address,
      data: '0x' + realMultiSingContract.byteCode,
      gas: 57000000 
    });
    console.log(this.smartContract);
  }

  ngOnInit(): void {
    this.getWalletBalance();
    this.addListenersForContract();
    this.checkConfirm();
    this.getContractData();
  }

  getContractData() {
    this.currentSmartContract.methods.getOwners().call()
      .then(res => console.log('owners list', res))
      .catch(err => console.log(err.message));
    this.currentSmartContract.methods.transactionCount().call()
      .then(res => {        
        this.contractID = res;
        console.log('this.contractID ', this.contractID);
        this.checkConfirm();
        for (let i = 0; i <= res; i++) {
          this.currentSmartContract.methods.transactions(i).call()
            .then(res => console.log('transaction '+ i, res))

        }
        return false;
      })
      .catch(err => console.log(err.message));
    this.currentSmartContract.methods.required().call()
      .then(res => console.log('required ', res))
      .catch(err => console.log(err.message));
  }

  confirmTansaction(initiator: string) {

    console.log(this.currentSmartContract)
    const wallet = this.web3.eth.accounts.wallet.add(this.wallets[initiator].privateKey);
    console.log('add', wallet)

    this.currentSmartContract.methods.confirmTransaction(this.contractID -1).send({
      from: this.wallets[initiator].address,
      gas: 5700000,
      gasPrice: '3100000000'
    })
      .then(res => console.log('confirm 111111' + initiator, res))
      .catch(err => console.log('err 22222' + err.message));

    // Second way 

    //   const transfer = contract.methods.confirmTransaction(confirmData.transactionId);
    //   const encodedABI = transfer.encodeABI();
    //   const key = this.encDecService.decryptWalletPrivateKey(confirmData.initiatorAddress, confirmData.jsonPassword);
    //   const tx = {
    //     from: confirmData.initiatorAddress,
    //     to: '0xDe4Ce883F6B393060545A0362bc25Ce96c3D93a7',
    //     gas: 2000000,
    //     data: encodedABI
    //   };
    //   this.approveTransactionModalElement.close();
    //   this.uiService.hidePreloader();
    //
    //   web3.eth.accounts.signTransaction(tx, key).then(signed => {
    //     web3.eth.sendSignedTransaction(signed.rawTransaction);
    //   });
    // }
  }

  addOwner(initiator: string): void {
    this.web3.eth.accounts.wallet.add(this.wallets[initiator].privateKey);
    console.log(this.inputData);
    this.currentSmartContract.methods.addOwner(this.inputData).send({
      from: this.wallets[initiator].address,
      gas: 5700000,
      gasPrice: '20000000000'
    })
      .then(res => {
        console.log('ADD Owner ', res)
      })
      .catch(err => console.log('err from add owner  ', err))
  }

  onDeployNewSmartContract(): void {
    this.pushTerminalMessage('send new contract into test net');
    // unlock account
    this.web3.eth.accounts.wallet.add(this.wallets.first.privateKey); 

    this.smartContract.deploy({
      data: '0x' + realMultiSingContract.byteCode,
      arguments: [[this.wallets.first.address, this.wallets.second.address], 2]
    }).send({
      from: this.wallets.first.address,
      gas: 25139,
      gasPrice: '20000000000'
    }).bind(this)
      .then(newContractInstance => {
        this.addListenersForContract(newContractInstance.contractAddress)
      })
      .catch(e => console.log(e.message));
  }

  sendContractEther() {
    this.web3.eth.accounts.signTransaction({
      to: this.smartContractAddress, 
      value: 1000000000000000000,
      gas: 5700000,
      gasPrice: '300000000'
    }, this.wallets.first.privateKey)
      .then(
        res => {
          this.web3.eth.sendSignedTransaction(res.rawTransaction)
            .then(
              receipt => {
                console.log('receipt = ', receipt);
              }
            );
        });

  }
  

  addListenersForContract(smartContractAddress?: string): void {
    this.smartContractAddress = smartContractAddress ? smartContractAddress : this.smartContractAddress;
    this.contractID = smartContractAddress ? 0 : this.contractID;
    this.pushTerminalMessage('add listen to contract address ' + this.smartContractAddress);
    this.currentSmartContract = new this.web3.eth.Contract(realMultiSingContract.abi, this.smartContractAddress);

    this.currentSmartContract.events.allEvents()
      .on('data', event => {
        console.log('data event ', event);
        if (event.event === 'Confirmation') {
          this.checkConfirm();
        }
      })
      .on('changed', event => {
        console.log('change event ', event);
      })
      .on('error', console.error);
  }

  checkConfirm() {
    for (const key in this.wallets) {
      this.currentSmartContract.methods.confirmations(this.contractID, this.wallets[key].address).call()
        .then(res => this.wallets[key].transactionStatus = res ? 'confirm' : 'pending')
        .catch(err => console.log('confirmations err', err.message));
    }
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
    // unlock account - not working in all account
    this.web3.eth.accounts.wallet.add(this.wallets[initiator].privateKey);
    const sendValue = this.inputData ? Number(this.inputData) * 1e18 : 0.1 * 1e18;
    console.log('sendValue', sendValue)
    this.currentSmartContract.methods.submitTransaction(this.wallets['third'].address, sendValue, '0x').send({
      from: this.wallets[initiator].address,
      gas: 5700000,
      gasPrice: '300000000'
    })
      .then(res => {
        this.contractID++;
        console.log('ADD transaction ', res)
      })
      .catch(err => console.log('err from add transaction  ', err))
  }
  
  pushTerminalMessage(message: string) {
    this.terminal.unshift(message);
  }

  getWalletBalance(): void {
    if (this.smartContractAddress) {
      this.web3.eth.getBalance(this.smartContractAddress)
        .then(balance => this.contractBalance = balance / 1e18)
    }
    for (const key in this.wallets) {
      this.web3.eth.getBalance(this.wallets[key].address)
        .then(balance => this.wallets[key].balance = balance / 1e18)
    }
  }


  // Owners

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


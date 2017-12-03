import {Component} from '@angular/core';
import Web3 from 'web3';
import {tokens} from '../../../assets/contracts/abi';

@Component({
  selector: 'app-tokens',
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.sass']
})

export class TokensComponent {
  public web3: Web3;
  public name = '';
  public symbol = '';
  public decimal = 0;
  public count = '0';
  public owner = '';
  public privateKey = '';
  public tokenAddress = '';
  public isSend = false;
  public transfer = {
    tokenAddress: '',
    count: '',
    whom: ''
  };

  constructor() {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545'));
  }

  createNewToken() {
    this.name = 'Test token N9';
    this.symbol = 'TR9';
    this.count = '1000';
    this.privateKey = '0xc293f871deab7fc6bc6c21f5ddd76fa529b10a7ca0b1823b95d3a30ecbdd7657';
    this.owner = '0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b';
    if (this.name &&
      this.symbol &&
      this.count &&
      this.privateKey &&
      this.owner) {
      // unlock account
      // this.web3.eth.accounts.wallet.add(this.privateKey);

      const contract = new this.web3.eth.Contract(tokens.abi, '0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b',
        {
          from: '0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b',
          gas: 4700000
        });
      console.log(contract)
      this.isSend = true;

      contract.deploy({
        arguments: [1000, 'Token test N9', 0, 'TT9']
      }).send({
        from: '0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b',
        gas: 4700000,
        gasPrice: '300000000'
      })
        .then(newContractInstance => {
          // this.tokenAddress = newContractInstance.contractAddress;
          console.log(newContractInstance);
        })
        .catch(e => console.log(e));
    } else {
      alert('All fields is required');
    }
  }

}

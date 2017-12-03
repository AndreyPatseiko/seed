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
  public name = 'Test token N10';
  public symbol = 'TR10';
  public decimal = 0;
  public count = '1000';
  public owner = '0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b';
  public privateKey = '0xc293f871deab7fc6bc6c21f5ddd76fa529b10a7ca0b1823b95d3a30ecbdd7657';
  public tokenAddress = '';
  public isSend = false;
  public transfer = {
    tokenAddress: '0x1bC48358E30372CFa919000eE4040EBe92A01d1a',
    count: '10',
    whom: '0x4fd55f6A8A3b4BbBcBd8e3C129F88A12f4E67C1a'
  };

  constructor() {
    this.web3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545'));
  }

  createNewToken() {
    if (this.name &&
      this.symbol &&
      this.count &&
      this.privateKey &&
      this.owner) {
      // unlock account
      this.web3.eth.accounts.wallet.add(this.privateKey);

      const contract = new this.web3.eth.Contract(tokens.abi, this.owner,
        {
          from: this.owner,
          data: '0x' + tokens.byteCode,
          gas: 4700000
        });

      this.isSend = true;

      contract.deploy({
        arguments: [this.count, this.name, this.decimal, this.symbol]
      }).send({
        from: this.owner,
        gas: 4700000,
        gasPrice: '30000000'
      })
        .then(newContractInstance => console.log(newContractInstance))
        .catch(e => console.log(e));
    } else {
      alert('All fields is required');
    }
  }

  transferTokens() {
    // unlock account
    this.web3.eth.accounts.wallet.add(this.privateKey);
    console.log(this.transfer)
    const contract = new this.web3.eth.Contract(tokens.abi, this.transfer.tokenAddress,
      {
        from: this.owner,
        gas: 4700000
      }
    );
    console.log('contract ', contract)
    contract.methods.transfer(this.transfer.whom, this.transfer.count).send().then(res => console.log(res))
  }

}

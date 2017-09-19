import {Component, OnInit} from '@angular/core';
import Web3 from 'web3';
import Mnemonic from 'bitcore-mnemonic';
import ethers from 'ethers';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent implements OnInit {
  _ethers = ethers;
  provider = new this._ethers.providers.JsonRpcProvider('http://192.168.11.214:5145', true);
  web3: Web3;
  walletsList = [];
  wordsList = '';
  _balance;

  constructor() {
    this.web3 = new Web3('http://192.168.11.214:5145');
  }

  ngOnInit() {
    if (this.walletsList.length === 0) {
      this.getWallets();
    }

    console.log(this._ethers)
  }

  createSimpleWalet(walletName, words?) {
    if (walletName) {
      if (words) {
        const newAccount = this._ethers.Wallet.fromMnemonic(words);
        console.log("Address: " + newAccount.address);
        // "Address: 0xaC39b311DCEb2A4b2f5d8461c1cdaF756F4F7Ae9"

        // const sha3 = this.web3.utils.sha3(words)
        // console.log('sha3 = ', sha3);
        // const newAccount = this.web3.eth.accounts.create(sha3);
        newAccount['nameWallet'] = walletName;
        newAccount['words'] = words;
        console.log(newAccount)
        localStorage.setItem(walletName, JSON.stringify(newAccount))
      } else {
        // const newAccount = this.web3.eth.accounts.create();
        // newAccount['nameWallet'] = walletName;
        // localStorage.setItem(walletName, JSON.stringify(newAccount))
      }
    } else {
      alert('Forgot name wallet')
    }
  }

  getBalance(address) {
    console.log(address)
    const self = this
    this.provider.getBalance(address.toString()).then(balance => {
      self._balance = balance/ 1e18;
      alert(`balance = ${balance/ 1e18}`)
    });
  }

  createBrainWalet(name, words) {
    this.createSimpleWalet(name, words)
  }

  getWallets() {
    this.walletsList = [];
    const keys = Object.keys(localStorage)
    keys.forEach(el => {
      let wallet = undefined;
      if (el !== 'loglevel') {
        try {
          wallet = JSON.parse(localStorage.getItem(el))
          this.walletsList.push(wallet)
        } catch (e) {
        }
      }
    })
  }

  generatePhrase() {
    const code = new Mnemonic(Mnemonic.Words.ENGLISH);
    const x = code.toHDPrivateKey();
    console.log('x =', x)
    console.log(code)
    this.wordsList = code.toString();
    const seed = this._ethers.HDNode.mnemonicToSeed('insect token opinion desk front motor vault judge knock believe split inner', 'test').slice(2,)
    console.log('seed', seed)
  }
}

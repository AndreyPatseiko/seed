import {Component, OnInit} from '@angular/core';
import Web3 from 'web3';
import Mnemonic from 'bitcore-mnemonic';
import bip39 from 'bip39';
import bip32 from 'ripple-bip32';
import CryptoJS from 'crypto-js';
import * as nacl from 'tweetnacl';
import base64 from 'base-64';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent implements OnInit {
  web3: Web3;
  walletsList = [];
  wordsList = '';
  _balance;
  bip32 = bip32;
  bip39 = bip39;
  nacl = nacl;

  constructor() {
    this.web3 = new Web3('http://192.168.11.214:5145');
  }

  ngOnInit() {
    if (this.walletsList.length === 0) {
      this.getWallets();
    }

    // hide elements in hash functions
    const phrase = 'demise outdoor lesson swing birth century spike only chef owner lend embody'
    const key = 'EthWall'
    let hash = CryptoJS.SHA256(phrase);
    // console.log('hash = ' , hash.toString(CryptoJS.enc.Hex));
    let hash2 = CryptoJS.HmacSHA256(phrase, key);
    // console.log('hash2 = ' , hash2.toString(CryptoJS.enc.Hex));

    // =====    phrase to entropy and return frase    ========
    // console.log('bip39 ', this.bip39)
    // const mnemonicEntropy = this.bip39.mnemonicToEntropy(phrase);
    // const praseFromEntropy = this.bip39.entropyToMnemonic(mnemonicEntropy);
    // console.log('mnemonicEntropy = ', mnemonicEntropy);
    // console.log('praseFromEntropy = ', praseFromEntropy);

    // Шифрование фразы в файл
      const _password = 'qweqweQ1'
      const _mnemonicEntropy =  '3a53a601ee016a4af474d82753c5ffa4'
      const _praseFromEntropy =  'demise outdoor lesson swing birth century spike only chef owner lend embody'

      const _key = CryptoJS.SHA256(_password);
      const _nonce = this.nacl.randomBytes(24)
      // const _nonceStr = CryptoJS.enc.Base64.stringify(_nonce)

      // const _cipher = this.nacl.secretbox(_mnemonicEntropy, _nonce, _key)

      console.log('testPassword = ', _password, 'testKey 32 bytes =', _key, 'nonce = ', _nonce )
      // console.log('nonceStr = ', _nonceStr, 'cipher =',  )

      const finishNonce = "+Gyeghrvh6EtZXh7rKYLtHhJYfkRunrk";
      const finishCipher = "JP9Kj7cCOCvY1EUVlvRPLpbvNuvD5sQkti+6uXX9aZDAkTDivp0KLGx8VLjWiLWdXlQCqpkqUE1kPBxpeFsGh9aiuPIZ0cso0C7DnQx1Yk2db/Eo4eMNx0c="

      console.log(CryptoJS)
      const cipher = base64.decode(finishCipher)
      const nonce = base64.decode(finishNonce)
      const _entropy = this.nacl.secretbox(cipher, nonce, _key)
      console.log('cipher ', cipher, 'nonce ', nonce, '_entropy ', _entropy)

  }

  createSimpleWalet(walletName) {
    if (walletName) {
      const newAccount = this.web3.eth.accounts.create();
      newAccount['nameWallet'] = walletName;
      localStorage.setItem(walletName, JSON.stringify(newAccount))
    } else {
      alert('Forgot name wallet')
    }
  }

  getBalance(address) {
    if (address) {
      const self = this
      this.web3.eth.getBalance(address.toString()).then(balance => {
        self._balance = balance / 1e18;
        alert(`balance = ${balance / 1e18}`)
      });
    } else {
      alert('Insert address in field')
    }
  }

  createBrainWalet(walletName, words, password?) {
    if (walletName && words) {
      const derivePath = 'm/44\'/60\'/0\'/0/0';
      const mnemonic = words;
      const seed = this.bip39.mnemonicToSeed(mnemonic, password);
      const generateWallet = this.bip32.fromSeedBuffer(seed);
      const keyPar = generateWallet.derivePath(derivePath).keyPair.getKeyPairs()
      const privKey = '0x' + keyPar.privateKey.toLowerCase().slice(2);
      console.log('public key = 0x' + keyPar.publicKey.toLowerCase());
      console.log('privateKey key =', privKey);

      const newAccount = this.web3.eth.accounts.privateKeyToAccount(privKey);
      if (password) newAccount['password'] = password;
      newAccount['nameWallet'] = walletName;
      newAccount['words'] = words;
      console.log(newAccount)
      localStorage.setItem(walletName, JSON.stringify(newAccount))
    } else {
      alert('Forgot name wallet or wallets phrase')
    }
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
    this.wordsList = code.toString();
  }
}

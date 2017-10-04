import {AfterViewInit, Component, OnInit} from '@angular/core';

declare const Buffer;
import Web3 from 'web3';
import Mnemonic from 'bitcore-mnemonic';
import bip39 from 'bip39';
import bip32 from 'ripple-bip32';
import CryptoJS from 'crypto-js';
import * as nacl from 'tweetnacl';

// import base64 from 'base-64';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent implements OnInit, AfterViewInit {
  msSupportDownload: boolean = false;
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

  ngAfterViewInit() {
    this.msSupportDownload = !!window.navigator.msSaveOrOpenBlob; // From save file in all browsers
  }

  // Save only IE
  saveFile(img, canvasForImg) {
    try {
      const canvas = canvasForImg;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      window.navigator.msSaveBlob(canvas.msToBlob(), 'qr-code.png');
    } catch (e) {
      throw e;
    }
  }

  ngOnInit() {
    if (this.walletsList.length === 0) {
      this.getWallets();
    }
    // Encrypte entropy into file
    const pass2 = '123Qwe';
    const random24 = this.nacl.randomBytes(24);
    const nonce = new Uint8Array(random24);
    const nonceStr = Buffer.from(nonce).toString('base64');
    console.log('nonceStr =', nonceStr);

    const encrypteKey = CryptoJS.HmacSHA256(pass2, 'EthWall').toString(CryptoJS.enc.Hex); // Encrypte password custom password
    const key = Buffer.from(encrypteKey, 'hex');
    console.log('key', key);
    const keyStr = Buffer.from(encrypteKey, 'hex').toString('base64');
    // console.log('key transform = ', Buffer.from([27, 51, -41, -91, -23, -76, 11, 88, -80, -27, -90, 55, -4, -78, 27, -122, -64, -14, -31, -115, -126, 22, 68, -23, 68, -59, 42, -39, -114, -64, -119, 35]).toString('base64'))
    console.log('keyStr  = ', keyStr);  //keyStr: = GzPXpem0C1iw5aY3/LIbhsDy4Y2CFkTpRMUq2Y7AiSM=

    const mnemonicPhrase = 'blush topple dove invest firm black narrow rapid wish science doll interest';
    const mnemonicEntropy = this.bip39.mnemonicToEntropy(mnemonicPhrase);
    // console.log('mnemonicEntropy ', mnemonicEntropy)
    const mnemonicEntropyBytes = new Uint8Array(Buffer.from(mnemonicEntropy, 'hex'));
    console.log('mnemonicEntropy = ', mnemonicEntropy, '|| mnemonicEntropyBytes = ', mnemonicEntropyBytes);

    const chiper = this.nacl.secretbox(mnemonicEntropyBytes, nonce, key);
    const cipherStr = Buffer.from(chiper).toString('base64');
    console.log('cipherStr =', cipherStr);

    console.log('================ Decode ========================');
    const _nonceStr = nonceStr;
    // const _nonceStr = '8RyMa5LN59rTpO+72QmjIbXZTeMmVNOA';
    const _cipherStr = cipherStr;
    // const _cipherStr = 'yBxlSOlnB8mEDxRkLyTffq3QBfx+oxf/NBr+nxaHTLE=';
    console.log('_cipherStr =', _cipherStr);
    const _chiper = Buffer.from(_cipherStr, 'base64');
    console.log('_chiper ', _chiper);
    const _nonce = Buffer.from(_nonceStr, 'base64');

    const decryptedMsg3 = this.nacl.secretbox.open(new Uint8Array(_chiper), new Uint8Array(_nonce), new Uint8Array(key))
    console.log('decryptedMsg3 = ', decryptedMsg3);
    const _entropy = Buffer.from(decryptedMsg3).toString('hex');
    console.log('_message = ', _entropy);
    console.log('phrase = ', this.bip39.entropyToMnemonic(_entropy))

    // =====    phrase to entropy and return phrase    ========
    // console.log('bip39 ', this.bip39)
    // const mnemonicEntropy = this.bip39.mnemonicToEntropy(mnemonicPhrase);
    // const praseFromEntropy = this.bip39.entropyToMnemonic(mnemonicEntropy);
    // console.log('mnemonicEntropy = ', mnemonicEntropy);
    // console.log('praseFromEntropy = ', praseFromEntropy);
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

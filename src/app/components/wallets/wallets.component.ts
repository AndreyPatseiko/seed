import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';

import Web3 from 'web3';
import Mnemonic from 'bitcore-mnemonic';
import bip39 from 'bip39';
import bip32 from 'ripple-bip32';
import * as nacl from 'tweetnacl';

@Component({
  selector: 'app-wallets',
  templateUrl: './wallets.component.html',
  styleUrls: ['./wallets.component.sass']
})

export class WalletsComponent {
  msSupportDownload = false;
  web3: Web3;
  outWeb3: Web3;
  walletsList = [];
  wordsList = '';
  _balance;
  bip32 = bip32;
  bip39 = bip39;
  nacl = nacl;
  ballance;
  tokens;
  tokensImageList;
  tokenContract;
  convertString;
  convertBytes;

  constructor(private http: Http) {
    this.web3 = new Web3('http://192.168.11.214:5145');
    // this.web3 = this.outWeb3 = new Web3('http://localhost:8545');
    // console.log(new WebSocket('ws://127.0.0.1:8545'))

    // this.web3 = this.outWeb3 = new Web3(new Web3.providers.WebsocketProvider('ws://127.0.0.1:8545'));
    // this.outWeb3 = this.web3 = new Web3('https://geth.ethwal.inside.cactussoft.biz');

    // const addressContract = '0x86Fa049857E0209aa7D9e616F7eb3b3B78ECfdb0'
    // this.http.get(`https://api.etherscan.io/api?module=contract&action=getabi&address=${addressContract}&apikey=AWTZAXGI342YVASQMSITZS7QWA2PSD8GFB`).subscribe(
    //   res => {
    //     const parsingRes = res.json();
    //     // console.log(parsingRes.result)
    //     this.abi = parsingRes.result;
    //     this.initContract()
    //   }
    // )
    console.log('WEB3 =', this.web3)
    // console.log('solc =', solc)
    // Token
    // this.http.get('https://api.ethplorer.io/getTopTokens?apiKey=freekey').subscribe(
    //   res => {
    //     this.tokens = res.json().tokens;
    //     console.log('tokens = ', this.tokens)
    //   }
    // );
    // this.http.get('https://www.cryptocompare.com/api/data/coinlist/').subscribe(
    //   res => {
    //     this.tokensImageList = res.json();
    //     console.log('tokensImageList ', this.tokensImageList)
    //   })
    // this.initContract();
  }


  convertToByte(val: string): void {
    this.convertBytes = this.web3.utils.stringToHex(val);
    const obj = {
      in: 't',
      v: '1eth',
      f: '0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b',
      t: '0xb450F8be8C6941d4E20B587926116b2B31369BF2',
      d: 1515146517094,
      s: 0
    }

  }

  convertToString(val: string): void {
    this.convertString = this.web3.utils.hexToUtf8(val);
  }

  // createNewWallet() {
  //   console.log(this.web3.eth.accounts.privateKeyToAccount('0x177fd46d0d3f5aaa3d6ff6737fa7a7aae86a8a86cb3c7d17bd45d547a5eb535e'))
  // }
  //
  // getWalletBallance() {
  //   console.log('get ballance')
  //   this.web3.eth.getBalance('0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b').then(res => console.log('ws', res / 1e18))
  // }
  //
  // // getBallance() {
  // //   // (0) 0xa5c2602e05c33ed6963d9b8130e95ecf7435fafd
  // //   // (1) 0x3fb8fe79cd1297819832a72aa24ede816cb69763
  // //
  // //   // address contract
  // //   // 0x8871D1244123EcCddE360d6B78a6a34B86D9dD24
  // //   const tokenContract = new this.web3.eth.Contract(this.abi, '0x8871D1244123EcCddE360d6B78a6a34B86D9dD24');
  // //   console.log('contract =', tokenContract)
  // //   // this.web3.eth.getAccounts().then(res => console.log('(0) = ', res[0]));
  // //   // this.web3.eth.getAccounts().then(res => console.log('(1) = ', res[1]));
  // //   let currency = {
  // //     name: '',
  // //     symbol: '',
  // //     decimals: ''
  // //   }
  // //   tokenContract.methods.name().call().then(res => currency.name = res);
  // //   tokenContract.methods.symbol().call().then(res => currency.symbol = res);
  // //   tokenContract.methods.decimals().call().then(res => currency.decimals = res)
  // //   tokenContract.methods.balanceOf('0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b').call().then(res => console.log('Currency ', currency.name + '| balanceOf (0) = ', res, currency.symbol))
  // //   tokenContract.methods.balanceOf('0x4C47Bfe01f28f4697f28cbf9f8DFCe6c68Cad3eB').call().then(res => console.log('Currency ', currency.name + '| balanceOf (1) = ', res, currency.symbol))
  // // }
  //
  // // transfer() {
  // //   const address = this.web3.eth.accounts.wallet.add('0xc293f871deab7fc6bc6c21f5ddd76fa529b10a7ca0b1823b95d3a30ecbdd7657')
  // //   console.log('address =', address)
  // //   const contract = new this.web3.eth.Contract(this.abi, '0x8871D1244123EcCddE360d6B78a6a34B86D9dD24',
  // //     {
  // //       from: '0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b',
  // //       gas: 1500000,
  // //       gasPrice: '300000000000'
  // //     });
  // //   console.log('contract ', contract)
  // //   contract.methods.transfer('0x4C47Bfe01f28f4697f28cbf9f8DFCe6c68Cad3eB', 150).send().then(res => console.log(res))
  // // }
  // //
  //
  // // initContract() {
  // //
  // //   const contractAddress = '0x8a87e541f12e1aa851aa3d75a1ac5d940ab0dcb0'
  // //   this.tokenContract = new this.web3.eth.Contract((this.abi), contractAddress, {
  // //     from: '0xb7919030054CAB72a3915e1C54C3A5cD584B6e5B',
  // //     gas: 100000
  // //   });
  // //   let currency = {
  // //     name: '',
  // //     symbol: '',
  // //     decimals: ''
  // //   }
  // //   this.tokenContract.methods.name().call().then(res => currency.name = res);
  // //   this.tokenContract.methods.symbol().call().then(res => currency.symbol = res);
  // //   this.tokenContract.methods.decimals().call().then(res => currency.decimals = res)
  // //   this.tokenContract.methods.balanceOf('0xb7919030054CAB72a3915e1C54C3A5cD584B6e5B').call().then(res => console.log('Currency ', currency.name + '| balanceOf = ', res / 1e18, currency.symbol))
  // //
  // //   const secondEalletToken = new this.web3.eth.Contract((this.abi), contractAddress);
  // //   secondEalletToken.methods.balanceOf('0x4C47Bfe01f28f4697f28cbf9f8DFCe6c68Cad3eB').call().then(res => console.log('!!! 2 balance = ', res))
  // //   console.log('token kontract1  = ', this.tokenContract);
  // // }
  //
  // ngAfterViewInit() {
  //   this.msSupportDownload = !!window.navigator.msSaveOrOpenBlob; // From save file in all browsers
  // }
  //
  // getImageUrl(token) {
  //   try {
  //     return this.tokensImageList.BaseImageUrl + this.tokensImageList.Data[token.symbol.toUpperCase()].ImageUrl
  //   } catch (e) {
  //     console.log('not found image')
  //   }
  // }
  //
  // async ngOnInit() {
  //
  //
  //   if (this.walletsList.length === 0) {
  //     this.getWallets();
  //   }
  //   // Encrypte entropy into file
  //   // const pass2 = '123Qwe';
  //   // const random24 = this.nacl.randomBytes(24);
  //   // const nonce = new Uint8Array(random24);
  //   // const nonceStr = Buffer.from(nonce).toString('base64');
  //   // console.log('nonceStr =', nonceStr);
  //
  //   // const encrypteKey = CryptoJS.HmacSHA256(pass2, 'EthWall').toString(CryptoJS.enc.Hex); // Encrypte password custom password
  //   // const key = Buffer.from(encrypteKey, 'hex');
  //   // console.log('key', key);
  //   // const keyStr = Buffer.from(encrypteKey, 'hex').toString('base64');
  //   // console.log('key transform = ', Buffer.from([27, 51, -41, -91, -23, -76, 11, 88, -80, -27, -90, 55, -4, -78, 27, -122, -64, -14, -31, -115, -126, 22, 68, -23, 68, -59, 42, -39, -114, -64, -119, 35]).toString('base64'))
  //   // console.log('keyStr  = ', keyStr);  //keyStr: = GzPXpem0C1iw5aY3/LIbhsDy4Y2CFkTpRMUq2Y7AiSM=
  //
  //   // const mnemonicPhrase = 'blush topple dove invest firm black narrow rapid wish science doll interest';
  //   // const mnemonicEntropy = this.bip39.mnemonicToEntropy(mnemonicPhrase);
  //   // console.log('mnemonicEntropy ', mnemonicEntropy)
  //   // const mnemonicEntropyBytes = new Uint8Array(Buffer.from(mnemonicEntropy, 'hex'));
  //   // console.log('mnemonicEntropy = ', mnemonicEntropy, '|| mnemonicEntropyBytes = ', mnemonicEntropyBytes);
  //
  //   // const chiper = this.nacl.secretbox(mnemonicEntropyBytes, nonce, key);
  //   // const cipherStr = Buffer.from(chiper).toString('base64');
  //   // console.log('cipherStr =', cipherStr);
  //
  //   // console.log('================ Decode ========================');
  //   // const _nonceStr = nonceStr;
  //   // const _nonceStr = '8RyMa5LN59rTpO+72QmjIbXZTeMmVNOA';
  //   // const _cipherStr = cipherStr;
  //   // const _cipherStr = 'yBxlSOlnB8mEDxRkLyTffq3QBfx+oxf/NBr+nxaHTLE=';
  //   // console.log('_cipherStr =', _cipherStr);
  //   // const _chiper = Buffer.from(_cipherStr, 'base64');
  //   // console.log('_chiper ', _chiper);
  //   // const _nonce = Buffer.from(_nonceStr, 'base64');
  //
  //   // const decryptedMsg3 = this.nacl.secretbox.open(new Uint8Array(_chiper), new Uint8Array(_nonce), new Uint8Array(key))
  //   // console.log('decryptedMsg3 = ', decryptedMsg3);
  //   // const _entropy = Buffer.from(decryptedMsg3).toString('hex');
  //   // console.log('_message = ', _entropy);
  //   // console.log('phrase = ', this.bip39.entropyToMnemonic(_entropy))
  //
  //   // =====    phrase to entropy and return phrase    ========
  //   // console.log('bip39 ', this.bip39)
  //   // const mnemonicEntropy = this.bip39.mnemonicToEntropy(mnemonicPhrase);
  //   // const praseFromEntropy = this.bip39.entropyToMnemonic(mnemonicEntropy);
  //   // console.log('mnemonicEntropy = ', mnemonicEntropy);
  //   // console.log('praseFromEntropy = ', praseFromEntropy);
  //
  //   // this.walletsList.forEach(el => {
  //   //   this.web3.eth.getBalance(el.address.toString()).then(res => {
  //   //       el['ballance'] = res / 1e18;
  //   //     }
  //   //   )
  //   //
  //   // })
  // }
  //
  //
  // createSimpleWalet(walletName) {
  //   if (walletName) {
  //     const newAccount = this.web3.eth.accounts.create();
  //     newAccount['nameWallet'] = walletName;
  //     localStorage.setItem(walletName, JSON.stringify(newAccount))
  //   } else {
  //     alert('Forgot name wallet')
  //   }
  // }
  //
  // getBalance(address) {
  //   // if (address) {
  //   //   const self = this
  //   //   this.web3.eth.getBalance(address.toString()).then(balance => {
  //   //     self._balance = balance / 1e18;
  //   //     alert(`balance = ${balance / 1e18}`)
  //   //   });
  //   // } else {
  //   //   alert('Insert address in field')
  //   // }
  // }
  //
  // createBrainWalet(walletName, words, password?) {
  //   if (walletName && words) {
  //     const derivePath = 'm/44\'/60\'/0\'/0/0';
  //     const mnemonic = words;
  //     const seed = this.bip39.mnemonicToSeed(mnemonic, password);
  //     const generateWallet = this.bip32.fromSeedBuffer(seed);
  //     const keyPar = generateWallet.derivePath(derivePath).keyPair.getKeyPairs()
  //     const privKey = '0x' + keyPar.privateKey.toLowerCase().slice(2);
  //     console.log('public key = 0x' + keyPar.publicKey.toLowerCase());
  //     console.log('privateKey key =', privKey);
  //
  //     const newAccount = this.web3.eth.accounts.privateKeyToAccount(privKey);
  //     if (password) newAccount['password'] = password;
  //     newAccount['nameWallet'] = walletName;
  //     newAccount['words'] = words;
  //     console.log(newAccount)
  //     localStorage.setItem(walletName, JSON.stringify(newAccount))
  //   } else {
  //     alert('Forgot name wallet or wallets phrase')
  //   }
  // }
  //
  // getWallets() {
  //   this.walletsList = [];
  //   const keys = Object.keys(localStorage)
  //   keys.forEach(el => {
  //     let wallet = undefined;
  //     if (el !== 'loglevel') {
  //       try {
  //         wallet = JSON.parse(localStorage.getItem(el))
  //         this.walletsList.push(wallet)
  //       } catch (e) {
  //       }
  //     }
  //   })
  // }
  //
  // generatePhrase() {
  //   const code = new Mnemonic(Mnemonic.Words.ENGLISH);
  //   this.wordsList = code.toString();
  // }


}

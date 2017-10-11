import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Http} from '@angular/http';

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
  ballance;
  tokens;
  tokensImageList;
  abi =
    [
      {
        'constant': true,
        'inputs': [],
        'name': 'name',
        'outputs': [{'name': '', 'type': 'string'}],
        'payable': false,
        'type': 'function'
      }, {
      'constant': false,
      'inputs': [{'name': '_spender', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}],
      'name': 'approve',
      'outputs': [],
      'payable': false,
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [],
      'name': 'totalSupply',
      'outputs': [{'name': '', 'type': 'uint256'}],
      'payable': false,
      'type': 'function'
    }, {
      'constant': false,
      'inputs': [{'name': '_from', 'type': 'address'}, {'name': '_to', 'type': 'address'}, {
        'name': '_value',
        'type': 'uint256'
      }],
      'name': 'transferFrom',
      'outputs': [],
      'payable': false,
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [],
      'name': 'INITIAL_SUPPLY',
      'outputs': [{'name': '', 'type': 'uint256'}],
      'payable': false,
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [],
      'name': 'decimals',
      'outputs': [{'name': '', 'type': 'uint256'}],
      'payable': false,
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [{'name': '_owner', 'type': 'address'}],
      'name': 'balanceOf',
      'outputs': [{'name': 'balance', 'type': 'uint256'}],
      'payable': false,
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [],
      'name': 'symbol',
      'outputs': [{'name': '', 'type': 'string'}],
      'payable': false,
      'type': 'function'
    }, {
      'constant': false,
      'inputs': [{'name': '_to', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}],
      'name': 'transfer',
      'outputs': [],
      'payable': false,
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [{'name': '_owner', 'type': 'address'}, {'name': '_spender', 'type': 'address'}],
      'name': 'allowance',
      'outputs': [{'name': 'remaining', 'type': 'uint256'}],
      'payable': false,
      'type': 'function'
    }, {'inputs': [], 'payable': false, 'type': 'constructor'}, {
      'anonymous': false,
      'inputs': [{'indexed': true, 'name': 'owner', 'type': 'address'}, {
        'indexed': true,
        'name': 'spender',
        'type': 'address'
      }, {'indexed': false, 'name': 'value', 'type': 'uint256'}],
      'name': 'Approval',
      'type': 'event'
    }, {
      'anonymous': false,
      'inputs': [{'indexed': true, 'name': 'from', 'type': 'address'}, {
        'indexed': true,
        'name': 'to',
        'type': 'address'
      }, {'indexed': false, 'name': 'value', 'type': 'uint256'}],
      'name': 'Transfer',
      'type': 'event'
    }]

  // abi =
  //   [
  //     {
  //   "constant": true,
  //   "inputs": [],
  //   "name": "name",
  //   "outputs": [{"name": "", "type": "string"}],
  //   "payable": false,
  //   "type": "function"
  // }, {
  //   "constant": false,
  //   "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}],
  //   "name": "approve",
  //   "outputs": [{"name": "success", "type": "bool"}],
  //   "payable": false,
  //   "type": "function"
  // }, {
  //   "constant": true,
  //   "inputs": [],
  //   "name": "totalSupply",
  //   "outputs": [{"name": "", "type": "uint256"}],
  //   "payable": false,
  //   "type": "function"
  // }, {
  //   "constant": false,
  //   "inputs": [{"name": "_from", "type": "address"}, {"name": "_to", "type": "address"}, {
  //     "name": "_value",
  //     "type": "uint256"
  //   }],
  //   "name": "transferFrom",
  //   "outputs": [{"name": "success", "type": "bool"}],
  //   "payable": false,
  //   "type": "function"
  // }, {
  //   "constant": true,
  //   "inputs": [],
  //   "name": "decimals",
  //   "outputs": [{"name": "", "type": "uint8"}],
  //   "payable": false,
  //   "type": "function"
  // }, {
  //   "constant": true,
  //   "inputs": [],
  //   "name": "version",
  //   "outputs": [{"name": "", "type": "string"}],
  //   "payable": false,
  //   "type": "function"
  // }, {
  //   "constant": true,
  //   "inputs": [{"name": "_owner", "type": "address"}],
  //   "name": "balanceOf",
  //   "outputs": [{"name": "balance", "type": "uint256"}],
  //   "payable": false,
  //   "type": "function"
  // }, {
  //   "constant": true,
  //   "inputs": [],
  //   "name": "symbol",
  //   "outputs": [{"name": "", "type": "string"}],
  //   "payable": false,
  //   "type": "function"
  // }, {
  //   "constant": false,
  //   "inputs": [{"name": "_to", "type": "address"}, {"name": "_value", "type": "uint256"}],
  //   "name": "transfer",
  //   "outputs": [{"name": "success", "type": "bool"}],
  //   "payable": false,
  //   "type": "function"
  // }, {
  //   "constant": false,
  //   "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}, {
  //     "name": "_extraData",
  //     "type": "bytes"
  //   }],
  //   "name": "approveAndCall",
  //   "outputs": [{"name": "success", "type": "bool"}],
  //   "payable": false,
  //   "type": "function"
  // }, {
  //   "constant": true,
  //   "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}],
  //   "name": "allowance",
  //   "outputs": [{"name": "remaining", "type": "uint256"}],
  //   "payable": false,
  //   "type": "function"
  // }, {
  //   "inputs": [{"name": "_initialAmount", "type": "uint256"}, {
  //     "name": "_tokenName",
  //     "type": "string"
  //   }, {"name": "_decimalUnits", "type": "uint8"}, {"name": "_tokenSymbol", "type": "string"}],
  //   "payable": false,
  //   "type": "constructor"
  // }, {"payable": false, "type": "fallback"}, {
  //   "anonymous": false,
  //   "inputs": [{"indexed": true, "name": "_from", "type": "address"}, {
  //     "indexed": true,
  //     "name": "_to",
  //     "type": "address"
  //   }, {"indexed": false, "name": "_value", "type": "uint256"}],
  //   "name": "Transfer",
  //   "type": "event"
  // }, {
  //   "anonymous": false,
  //   "inputs": [{"indexed": true, "name": "_owner", "type": "address"}, {
  //     "indexed": true,
  //     "name": "_spender",
  //     "type": "address"
  //   }, {"indexed": false, "name": "_value", "type": "uint256"}],
  //   "name": "Approval",
  //   "type": "event"
  // }]
  tokenContract;

  constructor(private http: Http) {
    this.web3 = new Web3('http://192.168.11.214:5145');
    // this.web3 = new Web3('http://localhost:8545');

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
    this.initContract();
  }

  transferToken() {
    console.log('token kontract = ', this.tokenContract.options.address);
    const sendWalletAddress = '0x4C47Bfe01f28f4697f28cbf9f8DFCe6c68Cad3eB';
    // this.tokenContract.methods.transfer('0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b', 300).send({from: '0xb7919030054CAB72a3915e1C54C3A5cD584B6e5B'}, res => console.log(res))
    this.tokenContract.methods.transfer('0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b', 300).send().then(res => console.log(res))
    // console.log(this.tokenContract.methods.transfer())

  }

  initContract() {

    const contractAddress = '0x8a87e541f12e1aa851aa3d75a1ac5d940ab0dcb0'
    this.tokenContract = new this.web3.eth.Contract((this.abi), contractAddress, {
      from: '0xb7919030054CAB72a3915e1C54C3A5cD584B6e5B',
      gas: 100000
    });
    let currency = {
      name: '',
      symbol: '',
      decimals: ''
    }
    this.tokenContract.methods.name().call().then(res => currency.name = res);
    this.tokenContract.methods.symbol().call().then(res => currency.symbol = res);
    this.tokenContract.methods.decimals().call().then(res => currency.decimals = res)
    this.tokenContract.methods.balanceOf('0xb7919030054CAB72a3915e1C54C3A5cD584B6e5B').call().then(res => console.log('Currency ',currency.name +  '| balanceOf = ', res / 1e18, currency.symbol))

    const secondEalletToken = new this.web3.eth.Contract((this.abi), contractAddress);
    secondEalletToken.methods.balanceOf('0x4C47Bfe01f28f4697f28cbf9f8DFCe6c68Cad3eB').call().then(res => console.log('!!! 2 balance = ', res))
    console.log('token kontract1  = ', this.tokenContract);
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

  getImageUrl(token) {
    try {
      return this.tokensImageList.BaseImageUrl + this.tokensImageList.Data[token.symbol.toUpperCase()].ImageUrl
    } catch (e) {
      console.log('not found image')
    }
  }

  sendContract() {
    console.log('send');
    console.log(this.fooContract)
  }

  fooContract;

  async ngOnInit() {


    if (this.walletsList.length === 0) {
      this.getWallets();
    }
    // Encrypte entropy into file
    // const pass2 = '123Qwe';
    // const random24 = this.nacl.randomBytes(24);
    // const nonce = new Uint8Array(random24);
    // const nonceStr = Buffer.from(nonce).toString('base64');
    // console.log('nonceStr =', nonceStr);

    // const encrypteKey = CryptoJS.HmacSHA256(pass2, 'EthWall').toString(CryptoJS.enc.Hex); // Encrypte password custom password
    // const key = Buffer.from(encrypteKey, 'hex');
    // console.log('key', key);
    // const keyStr = Buffer.from(encrypteKey, 'hex').toString('base64');
    // console.log('key transform = ', Buffer.from([27, 51, -41, -91, -23, -76, 11, 88, -80, -27, -90, 55, -4, -78, 27, -122, -64, -14, -31, -115, -126, 22, 68, -23, 68, -59, 42, -39, -114, -64, -119, 35]).toString('base64'))
    // console.log('keyStr  = ', keyStr);  //keyStr: = GzPXpem0C1iw5aY3/LIbhsDy4Y2CFkTpRMUq2Y7AiSM=

    // const mnemonicPhrase = 'blush topple dove invest firm black narrow rapid wish science doll interest';
    // const mnemonicEntropy = this.bip39.mnemonicToEntropy(mnemonicPhrase);
    // console.log('mnemonicEntropy ', mnemonicEntropy)
    // const mnemonicEntropyBytes = new Uint8Array(Buffer.from(mnemonicEntropy, 'hex'));
    // console.log('mnemonicEntropy = ', mnemonicEntropy, '|| mnemonicEntropyBytes = ', mnemonicEntropyBytes);

    // const chiper = this.nacl.secretbox(mnemonicEntropyBytes, nonce, key);
    // const cipherStr = Buffer.from(chiper).toString('base64');
    // console.log('cipherStr =', cipherStr);

    // console.log('================ Decode ========================');
    // const _nonceStr = nonceStr;
    // const _nonceStr = '8RyMa5LN59rTpO+72QmjIbXZTeMmVNOA';
    // const _cipherStr = cipherStr;
    // const _cipherStr = 'yBxlSOlnB8mEDxRkLyTffq3QBfx+oxf/NBr+nxaHTLE=';
    // console.log('_cipherStr =', _cipherStr);
    // const _chiper = Buffer.from(_cipherStr, 'base64');
    // console.log('_chiper ', _chiper);
    // const _nonce = Buffer.from(_nonceStr, 'base64');

    // const decryptedMsg3 = this.nacl.secretbox.open(new Uint8Array(_chiper), new Uint8Array(_nonce), new Uint8Array(key))
    // console.log('decryptedMsg3 = ', decryptedMsg3);
    // const _entropy = Buffer.from(decryptedMsg3).toString('hex');
    // console.log('_message = ', _entropy);
    // console.log('phrase = ', this.bip39.entropyToMnemonic(_entropy))

    // =====    phrase to entropy and return phrase    ========
    // console.log('bip39 ', this.bip39)
    // const mnemonicEntropy = this.bip39.mnemonicToEntropy(mnemonicPhrase);
    // const praseFromEntropy = this.bip39.entropyToMnemonic(mnemonicEntropy);
    // console.log('mnemonicEntropy = ', mnemonicEntropy);
    // console.log('praseFromEntropy = ', praseFromEntropy);

    this.walletsList.forEach(el => {
      this.web3.eth.getBalance(el.address.toString()).then(res => {
          el['ballance'] = res / 1e18;
        }
      )

    })
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

  // Drag&Drop
  borderDropArea = false;
  accountFileName = 'Json file name';

  openFile(event) {
    let input = event.target;
    this.getTextFromFile(input);
  }

  onDrop(event) {
    const input = event.dataTransfer;
    this.getTextFromFile(input);
    event.stopPropagation();
    event.preventDefault();
  }

  onDragOver(event) {
    if (!this.borderDropArea) this.borderDropArea = true;
    event.stopPropagation();
    event.preventDefault();
  }

  onDragOut(event) {
    if (this.borderDropArea) this.borderDropArea = false;
    event.stopPropagation();
    event.preventDefault();
  }

  getTextFromFile(input) {
    this.accountFileName = input.files[0].name;
    for (var index = 0; index < input.files.length; index++) {
      let reader = new FileReader();
      reader.onload = () => {
        var text = reader.result;
        console.log(text)
      }
      reader.readAsText(input.files[index]);
    }
  }

}

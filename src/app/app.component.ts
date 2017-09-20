import {Component, OnInit} from '@angular/core';
import Web3 from 'web3';
import Mnemonic from 'bitcore-mnemonic';
import ethers from 'ethers';
import lightwallet from 'eth-lightwallet';
import bip39 from 'bip39';
import bip32 from 'ripple-bip32';
import hdkey from 'ethereumjs-wallet/hdkey';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})

export class AppComponent implements OnInit {
  _ethers = ethers;
  _lightwallet = lightwallet;
  _hdkey = hdkey;
  provider = new this._ethers.providers.JsonRpcProvider('http://192.168.11.214:5145', true);
  web3: Web3;
  walletsList = [];
  wordsList = '';
  _balance;
  bip32 = bip32;
  bip39 = bip39;

  constructor() {
    this.web3 = new Web3('http://192.168.11.214:5145');
  }

  ngOnInit() {
    if (this.walletsList.length === 0) {
      this.getWallets();
    }

    // console.log(this._ethers.HDNode)
    // const words = 'loud frame design siren symbol supreme orbit vast enough chase master since'
    // const seed = this._ethers.HDNode.mnemonicToSeed(words).slice(2)
    // console.log('seed not password = ', seed)
    // const seedWithPass = this._ethers.HDNode.mnemonicToSeed(words, 'test').slice(2)
    // console.log('seed with password = ', seedWithPass)
    // console.log(this._ethers.HDNode.fromSeed())

    // =================== BIP =====================
    // console.log('bip 32 =',bip32)
    const mnemonic = 'loud frame design siren symbol supreme orbit vast enough chase master since'
    const password = 'test'
    // console.log(mnemonic)
    const seed = bip39.mnemonicToSeed(mnemonic)
    const mnemonicToSeed = this._ethers.HDNode.mnemonicToSeed(mnemonic)
    const seedLib = this.web3.utils.hexToBytes(mnemonicToSeed)

    // console.log(this._hdkey.fromMasterSeed(seedLib).derivePath("m/44'/0'/0/0") )
    // console.log('seed hex bip39  = ', bip39.mnemonicToSeedHex(mnemonic))
    // console.log('seed 2 lib  hex = ', mnemonicToSeed)

    const m2 = bip32.fromSeedBuffer(seed)
    console.log(m2.derivePath("m/44'/144'/0'").toBase58())
    console.log(m2.derivePath("m/44'/144'/0'").neutered().toBase58())
    console.log(m2.derivePath("m/44'/144'/0'/0/0").getAddress())
    console.log(m2.derivePath("m/44'/144'/0'/0/0").keyPair.getKeyPairs())

    // 001B8CA8668E3DC188464E3018FD77CDD5795305C8FD0B0E16A1BBCCBB539E7E01

    // console.log('reale bip39 seed = ', seed)
    // console.log('reale        Lib = ', seedLib)
    // console.log('reale seed 2 = ', this._ethers.HDNode.fromSeed(seedLib))

    // console.log(this._ethers.HDNode)


    const m = bip32.fromSeedBuffer(seed)
    // // console.log('m = ', m);
    // // console.log('1 ' , m.derivePath("m/44'/0'").toBase58())
    // // console.log('2 ' , m.derivePath("m/44'/0'").neutered().toBase58())
    // console.log('3 - m/44"/0"/0"/0/0' , m.derivePath("m/44'/0'/0'/0/0").getAddress())
    // console.log('4 - m/44"/0"/0"/0/0' , m.derivePath("m/44'/0'/0'/0/0").keyPair.getKeyPairs())
    // console.log(this.web3.utils.toHex(m.derivePath("m/44'/0'/0'/0/0").keyPair.getKeyPairs().publicKey))
    // console.log('3 - m/0/0 ' , m.derivePath("m/0/0").getAddress())
    // console.log('4 - m/0/0 ' , m.derivePath("m/0/0").keyPair.getKeyPairs())
    // console.log('3 - m/0\'/0\'/0 ' , m.derivePath("m/0'/0'/0").getAddress())
    // console.log('4 - m/0\'/0\'/0 ' , m.derivePath("m/0'/0'/0").keyPair.getKeyPairs())
    // console.log('3 - m/44\'/144\'/0\'/0/0' , m.derivePath("m/44'/144'/0'/0/0").getAddress())
    // console.log('4 - m/44\'/144\'/0\'/0/0 ' , m.derivePath("m/44'/144'/0'/0/0").keyPair.getKeyPairs())
    //
    // console.log(this._ethers.utils)
    // console.log(this._ethers.HDNode)
    // const path =  m.derivePath("m/44'/60'/0'/0/0").keyPair;
    // console.log('3 - m/44\'/60\'/0\'/0/0' , m.derivePath("m/44'/60'/0'/0/0").getAddress())
    console.log('1',  m.derivePath("m/0'/0'").toBase58())
    console.log('2',  m.derivePath("m/0'/0'").neutered().toBase58())
    console.log('3',  m.derivePath("m/0'/0'/0/0").getAddress())
    console.log('4',  m.derivePath("m/0'/0'/0/0").keyPair.getKeyPairs())

    // console.log('4 - m/44\'/60\'/0\'/0/0 --- 0x' ,  m.derivePath("m/44'/60'/0'/0/0").keyPair.)
    // ========  Light wallet ====
//     console.log('_lightwallet', this._lightwallet)
//     const password = 'test'
//     this._lightwallet.keystore.createVault({
//       password: password,
//       // seedPhrase: seed, // Optionally provide a 12-word seed phrase
//       // salt: fixture.salt,     // Optionally provide a salt.
//       // A unique salt will be generated otherwise.
//       // hdPathString: hdPath    // Optional custom HD Path String
//     }, function (err, ks) {
//       console.log('ks = ', ks)
//       // Some methods will require providing the `pwDerivedKey`,
//       // Allowing you to only decrypt private keys on an as-needed basis.
//       // You can generate that value with this convenient method:
//       ks.keyFromPassword(password, function (err, pwDerivedKey) {
//         if (err) throw err;
//
//         // generate five new address/private key pairs
//         // the corresponding private keys are also encrypted
//         ks.generateNewAddress(pwDerivedKey, 1);
//         console.log('address =',  ks.getAddresses());
//
//         ks.passwordProvider = function (callback) {
//           var pw = prompt("Please enter password", "Password");
//           callback(null, pw);
//         };
//
//       // Now set ks as transaction_signer in the hooked web3 provider
//       // and you can start using web3 using the keys/addresses in ks!
//       });
//     });
//
//
//     // the seed is stored encrypted by a user-defined password
//     const lightwallet = this._lightwallet
//     // generate a new BIP32 12-word seed
//     const secretSeed = lightwallet.keystore.generateRandomSeed();
//     console.log('secretSeed = ', secretSeed)
// // the seed is stored encrypted by a user-defined password
//     lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {
//       console.log('pwDerivedKey = ', pwDerivedKey)
//       var ks = new lightwallet.keystore(secretSeed, pwDerivedKey);
//
// // generate five new address/private key pairs
// // the corresponding private keys are also encrypted
//       ks.generateNewAddress(pwDerivedKey, 1);
//       console.log('address 2 = ', ks.getAddresses())
//
// // Create a custom passwordProvider to prompt the user to enter their
// // password whenever the hooked web3 provider issues a sendTransaction
// // call.
//       ks.passwordProvider = function (callback) {
//         var pw = prompt("Please enter password", "Password");
//         callback(null, pw);
//       };
//
// // Now set ks as transaction_signer in the hooked web3 provider
// // and you can start using web3 using the keys/addresses in ks!
//     });
//     // ===========================================
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
      self._balance = balance / 1e18;
      alert(`balance = ${balance / 1e18}`)
    });
  }

  createBrainWalet(name, words) {
    this.createSimpleWalet(name, words)
  }

  test() {
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

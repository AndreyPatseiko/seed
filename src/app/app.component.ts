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
  abi = [
    {
      'constant': true,
      'inputs': [],
      'name': 'name',
      'outputs': [{'name': '', 'type': 'string'}],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    }, {
      'constant': false,
      'inputs': [{'name': '_spender', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}],
      'name': 'approve',
      'outputs': [{'name': 'success', 'type': 'bool'}],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [],
      'name': 'totalSupply',
      'outputs': [{'name': '', 'type': 'uint256'}],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    }, {
      'constant': false,
      'inputs': [{'name': '_from', 'type': 'address'}, {'name': '_to', 'type': 'address'}, {
        'name': '_value',
        'type': 'uint256'
      }],
      'name': 'transferFrom',
      'outputs': [{'name': 'success', 'type': 'bool'}],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [],
      'name': 'decimals',
      'outputs': [{'name': '', 'type': 'uint8'}],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    }, {
      'constant': false,
      'inputs': [{'name': '_value', 'type': 'uint256'}],
      'name': 'burn',
      'outputs': [{'name': 'success', 'type': 'bool'}],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [],
      'name': 'standard',
      'outputs': [{'name': '', 'type': 'string'}],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [{'name': '', 'type': 'address'}],
      'name': 'balanceOf',
      'outputs': [{'name': '', 'type': 'uint256'}],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    }, {
      'constant': false,
      'inputs': [{'name': '_from', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}],
      'name': 'burnFrom',
      'outputs': [{'name': 'success', 'type': 'bool'}],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [],
      'name': 'symbol',
      'outputs': [{'name': '', 'type': 'string'}],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    }, {
      'constant': false,
      'inputs': [{'name': '_to', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}],
      'name': 'transfer',
      'outputs': [],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    }, {
      'constant': false,
      'inputs': [{'name': '_spender', 'type': 'address'}, {'name': '_value', 'type': 'uint256'}, {
        'name': '_extraData',
        'type': 'bytes'
      }],
      'name': 'approveAndCall',
      'outputs': [{'name': 'success', 'type': 'bool'}],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'function'
    }, {
      'constant': true,
      'inputs': [{'name': '', 'type': 'address'}, {'name': '', 'type': 'address'}],
      'name': 'allowance',
      'outputs': [{'name': '', 'type': 'uint256'}],
      'payable': false,
      'stateMutability': 'view',
      'type': 'function'
    }, {
      'inputs': [{'name': 'initialSupply', 'type': 'uint256'}, {
        'name': 'tokenName',
        'type': 'string'
      }, {'name': 'decimalUnits', 'type': 'uint8'}, {'name': 'tokenSymbol', 'type': 'string'}],
      'payable': false,
      'stateMutability': 'nonpayable',
      'type': 'constructor'
    }, {
      'anonymous': false,
      'inputs': [{'indexed': true, 'name': 'from', 'type': 'address'}, {
        'indexed': true,
        'name': 'to',
        'type': 'address'
      }, {'indexed': false, 'name': 'value', 'type': 'uint256'}],
      'name': 'Transfer',
      'type': 'event'
    }, {
      'anonymous': false,
      'inputs': [{'indexed': true, 'name': 'from', 'type': 'address'}, {
        'indexed': false,
        'name': 'value',
        'type': 'uint256'
      }],
      'name': 'Burn',
      'type': 'event'
    }];

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
    // this.initContract();
  }

  createSmartContract() {
    // var browser_first_sol_basicstorageContract = this.web3.eth.contract(this.abi);
    // this.web3.eth.getAccounts().then(res => console.log('(0) = ', res[0]));
    const walletAddress = '0xe49B009Ad164D84D768325a1984Ba392B35D8564'
    const walletPrivateKey = '0x9c8fa83f49a4e8d2c3c17a2314366fc7c7fa4d2c259d06de66c56d6913591abe'
    // const walletAddress = '0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b'
    // const walletPrivateKey = '0xc293f871deab7fc6bc6c21f5ddd76fa529b10a7ca0b1823b95d3a30ecbdd7657'
    this.web3.eth.getBalance(walletAddress).then(res => console.log('(1) = ', res / 1e18));
    const address = this.web3.eth.accounts.wallet.add(walletPrivateKey)
    console.log('address =', address)

    const contract = new this.web3.eth.Contract(this.abi, walletAddress,
      {
        from: walletAddress,
        data: '0x60606040526040805190810160405280600981526020017f546f6b656e20302e3100000000000000000000000000000000000000000000008152506000908051906020019062000051929190620001f9565b506040805190810160405280600c81526020017f5465737420746f6b656e20320000000000000000000000000000000000000000815250600190805190602001906200009f929190620001f9565b506040805190810160405280600381526020017f545432000000000000000000000000000000000000000000000000000000000081525060029080519060200190620000ed929190620001f9565b506000600360006101000a81548160ff021916908360ff1602179055506302faf08060045534156200011e57600080fd5b60405162001438380380620014388339810160405280805190602001909190805182019190602001805190602001909190805182019190505083600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550836004819055508260019080519060200190620001ba929190620001f9565b508060029080519060200190620001d3929190620001f9565b5081600360006101000a81548160ff021916908360ff16021790555050505050620002a8565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200023c57805160ff19168380011785556200026d565b828001600101855582156200026d579182015b828111156200026c5782518255916020019190600101906200024f565b5b5090506200027c919062000280565b5090565b620002a591905b80821115620002a157600081600090555060010162000287565b5090565b90565b61118080620002b86000396000f300606060405236156100c3576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100c8578063095ea7b31461015657806318160ddd146101b057806323b872dd146101d9578063313ce5671461025257806342966c68146102815780635a3b7e42146102bc57806370a082311461034a57806379cc67901461039757806395d89b41146103f1578063a9059cbb1461047f578063cae9ca51146104c1578063dd62ed3e1461055e575b600080fd5b34156100d357600080fd5b6100db6105ca565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561011b578082015181840152602081019050610100565b50505050905090810190601f1680156101485780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561016157600080fd5b610196600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610668565b604051808215151515815260200191505060405180910390f35b34156101bb57600080fd5b6101c36106f5565b6040518082815260200191505060405180910390f35b34156101e457600080fd5b610238600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506106fb565b604051808215151515815260200191505060405180910390f35b341561025d57600080fd5b6102656109f2565b604051808260ff1660ff16815260200191505060405180910390f35b341561028c57600080fd5b6102a26004808035906020019091905050610a05565b604051808215151515815260200191505060405180910390f35b34156102c757600080fd5b6102cf610afe565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561030f5780820151818401526020810190506102f4565b50505050905090810190601f16801561033c5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561035557600080fd5b610381600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610b9c565b6040518082815260200191505060405180910390f35b34156103a257600080fd5b6103d7600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610bb4565b604051808215151515815260200191505060405180910390f35b34156103fc57600080fd5b610404610d2e565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610444578082015181840152602081019050610429565b50505050905090810190601f1680156104715780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561048a57600080fd5b6104bf600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610dcc565b005b34156104cc57600080fd5b610544600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610fb1565b604051808215151515815260200191505060405180910390f35b341561056957600080fd5b6105b4600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061112f565b6040518082815260200191505060405180910390f35b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106605780601f1061063557610100808354040283529160200191610660565b820191906000526020600020905b81548152906001019060200180831161064357829003601f168201915b505050505081565b600081600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506001905092915050565b60045481565b6000808373ffffffffffffffffffffffffffffffffffffffff16145081600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541050600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054011050600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482115081600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555081600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b600360009054906101000a900460ff1681565b600081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054105081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550816004600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5836040518082815260200191505060405180910390a260019050919050565b60008054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610b945780601f10610b6957610100808354040283529160200191610b94565b820191906000526020600020905b815481529060010190602001808311610b7757829003601f168201915b505050505081565b60056020528060005260406000206000915090505481565b600081600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541050600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482115081600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550816004600082825403925050819055508273ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5836040518082815260200191505060405180910390a26001905092915050565b60028054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610dc45780601f10610d9957610100808354040283529160200191610dc4565b820191906000526020600020905b815481529060010190602001808311610da757829003601f168201915b505050505081565b60008273ffffffffffffffffffffffffffffffffffffffff16145080600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541050600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205481600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401105080600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555080600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35050565b600080849050610fc18585610668565b15611126578073ffffffffffffffffffffffffffffffffffffffff16638f4ffcb1338630876040518563ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b838110156110bb5780820151818401526020810190506110a0565b50505050905090810190601f1680156110e85780820380516001836020036101000a031916815260200191505b5095505050505050600060405180830381600087803b151561110957600080fd5b6102c65a03f1151561111a57600080fd5b50505060019150611127565b5b509392505050565b60066020528160005260406000206020528060005260406000206000915091505054815600a165627a7a723058202631f619442d5eca77c442f84447d004fe49a2abf43b11648d78bd51687650800029',
        gas: 4700000
      });

    contract.deploy({
      data: '0x60606040526040805190810160405280600981526020017f546f6b656e20302e3100000000000000000000000000000000000000000000008152506000908051906020019062000051929190620001f9565b506040805190810160405280600c81526020017f5465737420746f6b656e20320000000000000000000000000000000000000000815250600190805190602001906200009f929190620001f9565b506040805190810160405280600381526020017f545432000000000000000000000000000000000000000000000000000000000081525060029080519060200190620000ed929190620001f9565b506000600360006101000a81548160ff021916908360ff1602179055506302faf08060045534156200011e57600080fd5b60405162001438380380620014388339810160405280805190602001909190805182019190602001805190602001909190805182019190505083600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550836004819055508260019080519060200190620001ba929190620001f9565b508060029080519060200190620001d3929190620001f9565b5081600360006101000a81548160ff021916908360ff16021790555050505050620002a8565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200023c57805160ff19168380011785556200026d565b828001600101855582156200026d579182015b828111156200026c5782518255916020019190600101906200024f565b5b5090506200027c919062000280565b5090565b620002a591905b80821115620002a157600081600090555060010162000287565b5090565b90565b61118080620002b86000396000f300606060405236156100c3576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100c8578063095ea7b31461015657806318160ddd146101b057806323b872dd146101d9578063313ce5671461025257806342966c68146102815780635a3b7e42146102bc57806370a082311461034a57806379cc67901461039757806395d89b41146103f1578063a9059cbb1461047f578063cae9ca51146104c1578063dd62ed3e1461055e575b600080fd5b34156100d357600080fd5b6100db6105ca565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561011b578082015181840152602081019050610100565b50505050905090810190601f1680156101485780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561016157600080fd5b610196600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610668565b604051808215151515815260200191505060405180910390f35b34156101bb57600080fd5b6101c36106f5565b6040518082815260200191505060405180910390f35b34156101e457600080fd5b610238600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff169060200190919080359060200190919050506106fb565b604051808215151515815260200191505060405180910390f35b341561025d57600080fd5b6102656109f2565b604051808260ff1660ff16815260200191505060405180910390f35b341561028c57600080fd5b6102a26004808035906020019091905050610a05565b604051808215151515815260200191505060405180910390f35b34156102c757600080fd5b6102cf610afe565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561030f5780820151818401526020810190506102f4565b50505050905090810190601f16801561033c5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561035557600080fd5b610381600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610b9c565b6040518082815260200191505060405180910390f35b34156103a257600080fd5b6103d7600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610bb4565b604051808215151515815260200191505060405180910390f35b34156103fc57600080fd5b610404610d2e565b6040518080602001828103825283818151815260200191508051906020019080838360005b83811015610444578082015181840152602081019050610429565b50505050905090810190601f1680156104715780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561048a57600080fd5b6104bf600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610dcc565b005b34156104cc57600080fd5b610544600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190803590602001908201803590602001908080601f01602080910402602001604051908101604052809392919081815260200183838082843782019150505050505091905050610fb1565b604051808215151515815260200191505060405180910390f35b341561056957600080fd5b6105b4600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190505061112f565b6040518082815260200191505060405180910390f35b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156106605780601f1061063557610100808354040283529160200191610660565b820191906000526020600020905b81548152906001019060200180831161064357829003601f168201915b505050505081565b600081600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506001905092915050565b60045481565b6000808373ffffffffffffffffffffffffffffffffffffffff16145081600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541050600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054011050600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482115081600560008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254019250508190555081600660008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b600360009054906101000a900460ff1681565b600081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054105081600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550816004600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5836040518082815260200191505060405180910390a260019050919050565b60008054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610b945780601f10610b6957610100808354040283529160200191610b94565b820191906000526020600020905b815481529060010190602001808311610b7757829003601f168201915b505050505081565b60056020528060005260406000206000915090505481565b600081600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541050600660008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482115081600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008282540392505081905550816004600082825403925050819055508273ffffffffffffffffffffffffffffffffffffffff167fcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5836040518082815260200191505060405180910390a26001905092915050565b60028054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610dc45780601f10610d9957610100808354040283529160200191610dc4565b820191906000526020600020905b815481529060010190602001808311610da757829003601f168201915b505050505081565b60008273ffffffffffffffffffffffffffffffffffffffff16145080600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541050600560008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205481600560008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205401105080600560003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555080600560008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508173ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a35050565b600080849050610fc18585610668565b15611126578073ffffffffffffffffffffffffffffffffffffffff16638f4ffcb1338630876040518563ffffffff167c0100000000000000000000000000000000000000000000000000000000028152600401808573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018481526020018373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200180602001828103825283818151815260200191508051906020019080838360005b838110156110bb5780820151818401526020810190506110a0565b50505050905090810190601f1680156110e85780820380516001836020036101000a031916815260200191505b5095505050505050600060405180830381600087803b151561110957600080fd5b6102c65a03f1151561111a57600080fd5b50505060019150611127565b5b509392505050565b60066020528160005260406000206020528060005260406000206000915091505054815600a165627a7a723058202631f619442d5eca77c442f84447d004fe49a2abf43b11648d78bd51687650800029',
      arguments: [10, 'Test token XL', 0, 'XL']
    }).send({
      from: walletAddress,
      gas: 1500000,
      gasPrice: '3000000000'
    })
      .then(function (newContractInstance) {
        // console.log(newContractInstance.options.address) // instance with the new contract address
        console.log(newContractInstance) // instance with the new contract address
      });
  }

  getBallance() {
    // (0) 0xa5c2602e05c33ed6963d9b8130e95ecf7435fafd
    // (1) 0x3fb8fe79cd1297819832a72aa24ede816cb69763

    // address contract
    // 0x8871D1244123EcCddE360d6B78a6a34B86D9dD24
    const tokenContract = new this.web3.eth.Contract(this.abi, '0x8871D1244123EcCddE360d6B78a6a34B86D9dD24');
    console.log('contract =', tokenContract)
    // this.web3.eth.getAccounts().then(res => console.log('(0) = ', res[0]));
    // this.web3.eth.getAccounts().then(res => console.log('(1) = ', res[1]));
    let currency = {
      name: '',
      symbol: '',
      decimals: ''
    }
    tokenContract.methods.name().call().then(res => currency.name = res);
    tokenContract.methods.symbol().call().then(res => currency.symbol = res);
    tokenContract.methods.decimals().call().then(res => currency.decimals = res)
    tokenContract.methods.balanceOf('0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b').call().then(res => console.log('Currency ', currency.name + '| balanceOf (0) = ', res, currency.symbol))
    tokenContract.methods.balanceOf('0x4C47Bfe01f28f4697f28cbf9f8DFCe6c68Cad3eB').call().then(res => console.log('Currency ', currency.name + '| balanceOf (1) = ', res, currency.symbol))
  }

  transfer() {
    const address = this.web3.eth.accounts.wallet.add('0xc293f871deab7fc6bc6c21f5ddd76fa529b10a7ca0b1823b95d3a30ecbdd7657')
    console.log('address =', address)
    const contract = new this.web3.eth.Contract(this.abi, '0x8871D1244123EcCddE360d6B78a6a34B86D9dD24',
      {
        from: '0xb508cD0de817411097dB7e5d6f5beF22C7D9e32b',
        gas: 1500000,
        gasPrice: '300000000000'
      });
    console.log('contract ', contract)
    contract.methods.transfer('0x4C47Bfe01f28f4697f28cbf9f8DFCe6c68Cad3eB', 150).send().then(res => console.log(res))
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
    this.tokenContract.methods.balanceOf('0xb7919030054CAB72a3915e1C54C3A5cD584B6e5B').call().then(res => console.log('Currency ', currency.name + '| balanceOf = ', res / 1e18, currency.symbol))

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

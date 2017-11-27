import {Component, OnInit} from '@angular/core';
import Web3 from 'web3';

// import SharedWalletContract from '../../contracts/shared-wallet.sol'

@Component({
  selector: 'app-shared-wallet',
  templateUrl: './shared-wallet.component.html',
  styleUrls: ['./shared-wallet.component.sass']
})
export class SharedWalletComponent implements OnInit {
  sharedWalletContract = 'contract SimpleStorage {uint storedData;function set(uint x) {storedData = x;} function get() constant returns (uint) {return storedData;}}';
  public web3: Web3;

  constructor() {
    this.web3 = new Web3('http://192.168.11.214:5145');
  }

  ngOnInit() {
  }

  onDeployNewSmartContract(): void {
    // var greeterCompiled = this.web3.eth.compile.solidity(this.sharedWalletContract).then(console.log)
    var source = "" +
      "contract test {\n" +
      "   function multiply(uint a) returns(uint d) {\n" +
      "       return a * 7;\n" +
      "   }\n" +
      "}\n"; 
    this.web3.eth.compile.solidity(source)
      .then(console.log);
    // const contractAddress = '0x8a87e541f12e1aa851aa3d75a1ac5d940ab0dcb0'
    // this.sharedWalletContract = new this.web3.eth.Contract((this.abi), contractAddress, {
    //   from: '0xb7919030054CAB72a3915e1C54C3A5cD584B6e5B',
    //   gas: 100000
    // });
    console.log('deploy new contract ')
  }

  signContractFirst(): void {
    console.log('sign first ')
  }

  signContractSecond(): void {
    console.log('sign secont ')
  }

}

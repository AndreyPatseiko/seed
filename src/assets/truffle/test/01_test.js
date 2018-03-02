var Greeting = artifacts.require("./Greeting.sol");

contract("Test the Demo contract", function (Greeting) {
  it("deployed", function() {
    return Greeting.deployed().then(function(instance){
      return instance.greeting.call()
    }).then(function(value){

    })
  });

  // describe("Deploy the demo smart contract", function () {
  //   it("Cathe an instanse of the Demo contract", function () {
  //     return Greeting.new().then(function (instanse) {
  //       greetingContract = instanse;
  //       // return greetingContract.greeting().then(function (res) {
  //       //   expect(res.toString()).to.be.equal("Andrey");
  //       // });
  //     })
  //   });
  // });

  // describe("Check the contracts variables", function () {
  //   it("The name variable is Andrey", function () {
  //     return greetingContract.greeting().then(function (res) {
  //       expect(res.toString()).to.be.equal("Andrey");
  //     });
  //   });
  // });
});

const { expect } = require("chai");
const { ethers } = require("hardhat");

// describe("Greeter", function () {
//   it("Should return the new greeting once it's changed", async function () {
//     const Greeter = await ethers.getContractFactory("Greeter");
//     const greeter = await Greeter.deploy("Hello, world!");
//     await greeter.deployed();
//
//     expect(await greeter.greet()).to.equal("Hello, world!");
//
//     const setGreetingTx = await greeter.setGreeting("Hola, mundo!");
//
//     // wait until the transaction is mined
//     await setGreetingTx.wait();
//
//     expect(await greeter.greet()).to.equal("Hola, mundo!");
//   });
// });

describe("DerzhNFT", function(){
  it("Should mint and transfer an NFT to someone", async function(){
    const DerzhNFT = await ethers.getContractFactory("DerzhNFT");
    const derzhnft = await DerzhNFT.deploy();
    await derzhnft.deployed();

    const recipient = '0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e'; //use public key. To create fake wallets use: npx hardhat node
    const metadataURI = 'cid/test.png';

    let balance = await derzhnft.balanceOf(recipient);
    expect(balance).to.equal(0);
    const newlyMintedToken = await derzhnft.payToMint(recipient, metadataURI, { value: ethers.utils.parseEther('0.01')});

    //wait until the transaction is minted
    await newlyMintedToken.wait();

    balance = await derzhnft.balanceOf(recipient);
    expect(balance).to.equal(1);

    expect(await derzhnft.isContentOwned(metadataURI)).to.equal(true);

  });
});
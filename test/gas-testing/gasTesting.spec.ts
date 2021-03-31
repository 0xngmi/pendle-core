import { assert, expect } from "chai";
import GasTesting from "../../build/artifacts/contracts/mock/GasTesting.sol/GasTesting.json";
import { Contract, Wallet, BigNumber as BN } from "ethers";

const { waffle } = require("hardhat");
const { provider, deployContract } = waffle;
const hre = require("hardhat");

describe("Gas testing playground", async () => {
  const wallets = provider.getWallets();
  const [alice, bob, charlie, dave, eve] = wallets;
  let gasTester: Contract;
  let gasTesterWeb3: any;

  before(async () => {
    gasTester = await deployContract(alice, GasTesting, []);
    gasTesterWeb3 = new hre.web3.eth.Contract(
      GasTesting.abi,
      gasTester.address
    );
  });

  it("Updating uint256 vars", async () => {
    const gasUsed:number[] = [];

    for (let i=0;i<10;i++) {
      const tx = await gasTesterWeb3.methods.change256_vars(i).send({ from: alice.address });
      gasUsed.push(tx.gasUsed);
      console.log(`Setting ${i} uint256 takes ${tx.gasUsed}, diff compared to i-1:${ i > 0 ? tx.gasUsed - gasUsed[i-1] : ""}`);
    }
  });
  it("Updating uint256 mapping", async () => {
    const gasUsed:number[] = [];

    for (let i=0;i<10;i++) {
      const tx = await gasTesterWeb3.methods.change256_mapping(i).send({ from: alice.address });
      gasUsed.push(tx.gasUsed);
      console.log(`Setting ${i} uint256 takes ${tx.gasUsed}, diff compared to i-1:${ i > 0 ? tx.gasUsed - gasUsed[i-1] : ""}`);
    }
  });
  it("Updating uint128 mapping", async () => {
    const gasUsed:number[] = [];

    for (let i=0;i<10;i++) {
      const tx = await gasTesterWeb3.methods.change128_mapping(i).send({ from: alice.address });
      gasUsed.push(tx.gasUsed);
      console.log(`Setting ${i} uint128 takes ${tx.gasUsed}, diff compared to i-1:${ i > 0 ? tx.gasUsed - gasUsed[i-1] : ""}`);
    }
  });
  it("Updating uint32 mapping", async () => {
    const gasUsed:number[] = [];

    for (let i=0;i<10;i++) {
      const tx = await gasTesterWeb3.methods.change32_mapping(i).send({ from: alice.address });
      gasUsed.push(tx.gasUsed);
      console.log(`Setting ${i} uint32 takes ${tx.gasUsed}, diff compared to i-1:${ i > 0 ? tx.gasUsed - gasUsed[i-1] : ""}`);
    }
  });

});

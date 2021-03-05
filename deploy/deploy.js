/**
 * @dev Steps to run:
 * 1. Run hardhat node with the following command:
 *    npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/<API_KEY>
 * 
 * 2. In a separate terminal run:
 *    npx hardhat run --network development deploy/deploy.js
 */

const Web3 = require("web3");
const {
  devConstants,
  kovanConstants,
} = require("../deploy_helpers/Constants.ts");

const {
  IATokenArtifact,
  IUSDTArtifact,
} = require("../deploy_helpers/exports");

const TEST_AMOUNT_TO_MINT = 100000000000;
const TEST_AMOUNT_TO_TOKENIZE = 1500000000;
const TEST_AMOUNT_TO_BOOTSTRAP = 1000000000;

async function main() {
  const chainId = 1
  const constants = chainId == 42 ? kovanConstants : devConstants;
  const [alice] = await ethers.getSigners()
  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:8545")
  );

  console.log("\n========== Deploying Core Contracts");
  // We get the contract to deploy
  const PendleRouter = await ethers.getContractFactory("PendleRouter");
  const pendleRouter = await PendleRouter.deploy(alice.address,
    constants.tokens.WETH.address);

  console.log("PendleRouter deployed to:", pendleRouter.address);

  const PendleTreasury = await ethers.getContractFactory("PendleTreasury");
  const pendleTreasury = await PendleTreasury.deploy(alice.address);
  console.log("PendleTreasury deployed to:", pendleTreasury.address);

  const PendleAaveForge = await ethers.getContractFactory("PendleAaveForge");
  const pendleAaveForge = await PendleAaveForge.deploy(pendleRouter.address, pendleRouter.address,
    constants.misc.AAVE_LENDING_POOL_CORE_ADDRESS,
    constants.misc.FORGE_AAVE);
  console.log("PendleAaveForge deployed to:", pendleAaveForge.address);

  const PendleMarketFactory = await ethers.getContractFactory("PendleMarketFactory");
  const pendleMarketFactory = await PendleMarketFactory.deploy(alice.address, constants.misc.FORGE_AAVE);
  console.log("PendleMarketFactory deployed to:", pendleMarketFactory.address);

  const PendleData = await ethers.getContractFactory("PendleData");
  const pendleData = await PendleData.deploy(alice.address, pendleTreasury.address);
  console.log("PendleData deployed to:", pendleData.address);

  console.log("\n========== Initialising core contracts");
  await pendleData.initialize(pendleRouter.address);
  await pendleMarketFactory.initialize(pendleRouter.address);

  await pendleRouter.initialize(pendleData.address);
  await pendleRouter.addMarketFactory(
    constants.misc.FORGE_AAVE,
    pendleMarketFactory.address
  );
  await pendleData.setForgeFactoryValidity(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    true
  );

  await pendleRouter.addForge(constants.misc.FORGE_AAVE, pendleAaveForge.address);
  // await pendleData.setReentrancyWhitelist([pendleAMarketAddress, pendleCMarketAddress, pendleEthMarketAddress], [true, true, true]);
  await pendleData.setLockParams(constants.misc.LOCK_NUMERATOR, constants.misc.LOCK_DENOMINATOR); // lock market
  console.log("Initialising completed")
  /**Transferring ausdt and usdt to Alice */
  if (chainId != 42) {
    console.log("\n========== Transferring ausdt and usdt to Alice");
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [constants.tokens.USDT.owner]
    }).catch(err => {
      console.error(err)
    })
    let signer = await ethers.provider.getSigner(constants.tokens.USDT.owner);

    const USDTToken = new ethers.Contract(
      constants.tokens.USDT.address,
      IATokenArtifact.abi,
      signer
    );

    // Transferring USDT
    // const ethBalance = await web3.eth.getBalance(constants.tokens.USDT.owner);
    const usdtBalance = await USDTToken
      .balanceOf(constants.tokens.USDT.owner);
    // console.log(`Eth balance of usdt owner = ${ethBalance}`);
    console.log(`usdt balance of usdt owner = ${usdtBalance.toString()}`);
    await USDTToken.transfer(alice.address, TEST_AMOUNT_TO_MINT)
    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [constants.tokens.USDT.owner,]
    })

    // Transferring aUSDT
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [constants.tokens.AUSDT.owner]
    })
    signer = await ethers.provider.getSigner(constants.tokens.AUSDT.owner);
    const aUSDTToken = new ethers.Contract(
      constants.tokens.AUSDT.address,
      IATokenArtifact.abi,
      signer
    );

    // const ethBalance2 = await web3.eth.getBalance(constants.tokens.AUSDT.owner);
    const ausdtBalance = await aUSDTToken
      .balanceOf(constants.tokens.AUSDT.owner);
    // console.log(`Eth balance of ausdt owner = ${ethBalance2}`);
    console.log(
      `ausdt balance of ausdt owner = ${ausdtBalance.toString()}`
    );

    await aUSDTToken
      .transfer(alice.address, TEST_AMOUNT_TO_MINT / 2);

    const aUSDTBalance = await aUSDTToken.balanceOf(alice.address);

    console.log("Minted USDT and AUSDT to alice");
    console.log("AUSDT balance: " + aUSDTBalance);

    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [constants.tokens.AUSDT.owner,]
    })
  }

  console.log("\n========== Creating Yield contracts and minting XYT/OTs");
  await pendleRouter.newYieldContracts(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY,
    { gasLimit: 8000000 }
  );

  await pendleRouter.newYieldContracts(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_2,
    { gasLimit: 8000000 }
  );

  await pendleRouter.newYieldContracts(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_3,
    { gasLimit: 8000000 }
  );

  let xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY
  );

  const otAddress = await pendleData.otTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY
  );
  console.log(`XYT contract deployed, address = ${xytAddress}`);
  console.log(`OT contract deployed, address = ${otAddress}`);
  const usdtContract = new ethers.Contract(
    constants.tokens.USDT.address,
    IATokenArtifact.abi,
    alice
  );

  const ausdtContract = new ethers.Contract(
    constants.tokens.AUSDT.address,
    IATokenArtifact.abi,
    alice
  );

  let xytContract = new ethers.Contract(
    xytAddress,
    IATokenArtifact.abi,
    alice
  );

  await ausdtContract.approve(pendleRouter.address, constants.misc.MAX_ALLOWANCE);
  console.log(`Approved PendleRouter to spend aUSDT`);

  await pendleRouter.tokenizeYield(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY,
    TEST_AMOUNT_TO_TOKENIZE,
    alice.address
  );
  console.log(`Minted: ${TEST_AMOUNT_TO_TOKENIZE} XYT and OT`);

  console.log("\n========== Creating Test Pendle Market");
  await pendleRouter.createMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address
  );

  let pendleMarketAddress = await pendleData.getMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address
  );

  console.log(`Deployed a XYT/USDT market at ${pendleMarketAddress}`);

  await xytContract.approve(pendleRouter.address, constants.misc.MAX_ALLOWANCE);
  await usdtContract.approve(pendleRouter.address, constants.misc.MAX_ALLOWANCE);
  console.log(`Approved PendleRouter to spend xyt and usdt`);

  await pendleRouter.bootstrapMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP,
    { gasLimit: 8000000 }
  );
  console.log(`Bootstrapped Market`);

  await pendleRouter.swapExactIn(
    xytAddress,
    constants.tokens.USDT.address,
    TEST_AMOUNT_TO_BOOTSTRAP / 10,
    0,
    constants.misc.MAX_ALLOWANCE,
    constants.misc.FORGE_AAVE,
    { gasLimit: 8000000 }
  );
  console.log(`Did a test trade`);

  console.log("\n========== Creating Test Pendle Market 2");
  xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_2
  );
  console.log("xytAddress:", xytAddress);
  xytContract = new ethers.Contract(xytAddress, IATokenArtifact.abi, alice);
  await xytContract.approve(pendleRouter.address, constants.misc.MAX_ALLOWANCE);
  console.log(`Approved PendleRouter to spend xyt`);

  await pendleRouter.createMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address
  );


  await pendleRouter.tokenizeYield(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_2,
    TEST_AMOUNT_TO_TOKENIZE,
    alice.address
  );

  pendleMarketAddress = await pendleData.getMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address
  );

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress}`);
  await pendleRouter.bootstrapMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP,
    { gasLimit: 8000000 }
  );
  console.log(`Bootstrapped Market`);

  console.log("\n========== Creating Test Pendle Market 3");
  xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_3
  );
  console.log("\txytAddress:", xytAddress);
  await pendleRouter.createMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address
  );

  pendleMarketAddress = await pendleData.getMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address
  );

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress}`);

  await pendleRouter.tokenizeYield(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_3,
    TEST_AMOUNT_TO_TOKENIZE,
    alice.address
  );

  xytContract = new ethers.Contract(xytAddress, IATokenArtifact.abi, alice);

  await xytContract.approve(pendleRouter.address, constants.misc.MAX_ALLOWANCE);
  // await usdtContract.approve(pendleRouter.address, constants.misc.MAX_ALLOWANCE);
  console.log(`\tApproved PendleRouter to spend xyt and usdt`);

  await pendleRouter.bootstrapMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP,
    { gasLimit: 8000000 }
  );
  console.log(`\tBootstrapped Market`);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
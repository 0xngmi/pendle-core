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

  const PendleData = await ethers.getContractFactory("PendleData");
  const pendleData = await PendleData.deploy(alice.address, pendleTreasury.address);
  console.log("PendleData deployed to:", pendleData.address);

  const PendleMarketReader = await ethers.getContractFactory("PendleMarketReader");
  const pendleMarketReader = await PendleMarketReader.deploy(pendleData.address);
  console.log("PendleMarketReader deployed to:", pendleMarketReader.address);

  console.log("\n========== Initialising core contracts");
  await pendleData.initialize(pendleRouter.address);
  await pendleRouter.initialize(pendleData.address);

  console.log("\n========== Deploying Aave & Compound Forge and Market Factories");
  const PendleAaveForge = await ethers.getContractFactory("PendleAaveForge");
  const pendleAaveForge = await PendleAaveForge.deploy(pendleRouter.address, pendleRouter.address,
    constants.misc.AAVE_LENDING_POOL_CORE_ADDRESS,
    constants.misc.FORGE_AAVE);
  console.log("PendleAaveForge deployed to:", pendleAaveForge.address);

  const PendleMarketFactory = await ethers.getContractFactory("PendleMarketFactory");
  const pendleAMarketFactory = await PendleMarketFactory.deploy(alice.address, constants.misc.FORGE_AAVE);
  console.log("PendleAMarketFactory deployed to:", pendleAMarketFactory.address);

  const PendleCompoundForge = await ethers.getContractFactory("PendleCompoundForge");
  const pendleCompoundForge = await PendleCompoundForge.deploy(alice.address, pendleRouter.address, constants.misc.COMPOUND_COMPTROLLER_ADDRESS, constants.misc.FORGE_COMPOUND);
  console.log("PendleCompoundForge deployed to:", pendleCompoundForge.address);

  const pendleCMarketFactory = await PendleMarketFactory.deploy(alice.address, constants.misc.FORGE_COMPOUND);
  console.log("PendleCMarketFactory deployed to:", pendleCMarketFactory.address);

  console.log("\n========== Initialising Markets and Forges");
  await pendleAMarketFactory.initialize(pendleRouter.address);
  console.log("test 1")
  await pendleCMarketFactory.initialize(pendleRouter.address);
  console.log("test 2")

  await pendleRouter.addMarketFactory(
    constants.misc.FORGE_AAVE,
    pendleAMarketFactory.address
  );
  console.log("test 3")
  await pendleData.setForgeFactoryValidity(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    true
  );
  console.log("test 4")

  await pendleRouter.addForge(constants.misc.FORGE_AAVE, pendleAaveForge.address);
  console.log("test 5")

  await pendleRouter.addMarketFactory(
    constants.misc.FORGE_COMPOUND,
    pendleCMarketFactory.address
  );
  console.log("test 6")
  await pendleData.setForgeFactoryValidity(
    constants.misc.FORGE_COMPOUND,
    constants.misc.FORGE_COMPOUND,
    true
  );
  console.log("test 7")

  await pendleRouter.addForge(constants.misc.FORGE_COMPOUND, pendleCompoundForge.address);
  console.log("test 8")

  await pendleCompoundForge.registerCTokens([constants.tokens.USDT.address], [constants.tokens.USDT.compound]);
  console.log("test 9")

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

  console.log("\n========== Creating Aave Yield contracts and minting XYT/OTs");
  await pendleRouter.newYieldContracts(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY
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

  let otAddress = await pendleData.otTokens(
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

  let pendleMarketAddress1 = await pendleData.getMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address
  );
  await pendleData.setReentrancyWhitelist([pendleMarketAddress1], [true]);

  console.log(`Deployed a XYT/USDT market at ${pendleMarketAddress1}`);

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
  otAddress = await pendleData.otTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_2
  );
  console.log("xytAddress:", xytAddress);
  console.log("otAddress:", otAddress);
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

  let pendleMarketAddress2 = await pendleData.getMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address
  );
  await pendleData.setReentrancyWhitelist([pendleMarketAddress1, pendleMarketAddress2], [true, true]);

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress2}`);
  await pendleRouter.bootstrapMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP,
    { gasLimit: 8000000 }
  );
  console.log(`Bootstrapped Market`);
  let lpTokenContract = new ethers.Contract(pendleMarketAddress2, IATokenArtifact.abi, alice);

  await lpTokenContract.approve(pendleRouter.address, constants.misc.MAX_ALLOWANCE);

  await pendleRouter.removeMarketLiquidityAll(
    constants.misc.FORGE_AAVE,
    xytAddress,
    usdtContract.address,
    ethers.utils.parseEther('0.1'),
    0,
    0,
    { gasLimit: 8000000 }
  );
  console.log(`Removed liquidity from Market`);

  console.log("\n========== Creating Test Pendle Market 3");
  xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_3
  );
  otAddress = await pendleData.otTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_3
  );
  console.log("\txytAddress:", xytAddress);
  console.log("\otAddress:", otAddress);
  await pendleRouter.createMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address
  );

  let pendleMarketAddress3 = await pendleData.getMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address
  );

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress3}`);
  await pendleData.setReentrancyWhitelist([pendleMarketAddress1, pendleMarketAddress2, pendleMarketAddress3], [true, true, true]);

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

  /** COMPOUND MARKET DEPLOYMENT */

  console.log("\n========== Creating Compound Yield contracts and minting XYT/OTs");
  await pendleRouter.newYieldContracts(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY,
    { gasLimit: 8000000 }
  );

  await pendleRouter.newYieldContracts(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_2,
    { gasLimit: 8000000 }
  );

  await pendleRouter.newYieldContracts(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_3,
    { gasLimit: 8000000 }
  );

  xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY
  );

  otAddress = await pendleData.otTokens(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY
  );
  console.log(`XYT contract deployed, address = ${xytAddress}`);
  console.log(`OT contract deployed, address = ${otAddress}`);

  xytContract = new ethers.Contract(
    xytAddress,
    IATokenArtifact.abi,
    alice
  );

  await pendleRouter.tokenizeYield(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY,
    TEST_AMOUNT_TO_TOKENIZE,
    alice.address
  );
  console.log(`Minted: ${TEST_AMOUNT_TO_TOKENIZE} XYT and OT`);

  console.log("\n========== Creating Test Pendle Market");
  await pendleRouter.createMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    constants.tokens.USDT.address
  );

  let pendleMarketAddress4 = await pendleData.getMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    constants.tokens.USDT.address
  );
  await pendleData.setReentrancyWhitelist([pendleMarketAddress1, pendleMarketAddress2, pendleMarketAddress3, pendleMarketAddress4], [true, true, true, true]);

  console.log(`Deployed a XYT/USDT market at ${pendleMarketAddress4}`);

  await xytContract.approve(pendleRouter.address, constants.misc.MAX_ALLOWANCE);
  console.log(`Approved PendleRouter to spend xyt`);

  await pendleRouter.bootstrapMarket(
    constants.misc.FORGE_COMPOUND,
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
    constants.misc.FORGE_COMPOUND,
    { gasLimit: 8000000 }
  );
  console.log(`Did a test trade`);

  console.log("\n========== Creating Test Pendle Market 2");
  xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_2
  );
  otAddress = await pendleData.otTokens(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_2
  );
  console.log("xytAddress:", xytAddress);
  console.log("otAddress:", otAddress);
  xytContract = new ethers.Contract(xytAddress, IATokenArtifact.abi, alice);
  await xytContract.approve(pendleRouter.address, constants.misc.MAX_ALLOWANCE);
  console.log(`Approved PendleRouter to spend xyt`);

  await pendleRouter.createMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    constants.tokens.USDT.address
  );


  await pendleRouter.tokenizeYield(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_2,
    TEST_AMOUNT_TO_TOKENIZE,
    alice.address
  );

  let pendleMarketAddress5 = await pendleData.getMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    constants.tokens.USDT.address
  );
  await pendleData.setReentrancyWhitelist([pendleMarketAddress1, pendleMarketAddress2, pendleMarketAddress3, pendleMarketAddress4, pendleMarketAddress5], [true, true, true, true, true]);

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress5}`);
  await pendleRouter.bootstrapMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP,
    { gasLimit: 8000000 }
  );
  console.log(`Bootstrapped Market`);
  lpTokenContract = new ethers.Contract(pendleMarketAddress5, IATokenArtifact.abi, alice);

  await lpTokenContract.approve(pendleRouter.address, constants.misc.MAX_ALLOWANCE);

  await pendleRouter.removeMarketLiquidityAll(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    usdtContract.address,
    ethers.utils.parseEther('0.1'),
    0,
    0,
    { gasLimit: 8000000 }
  );
  console.log(`Removed liquidity from Market`);

  console.log("\n========== Creating Test Pendle Market 3");
  xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_3
  );
  otAddress = await pendleData.otTokens(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_3
  );
  console.log("\txytAddress:", xytAddress);
  console.log("\otAddress:", otAddress);
  await pendleRouter.createMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    constants.tokens.USDT.address
  );

  let pendleMarketAddress6 = await pendleData.getMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    constants.tokens.USDT.address
  );

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress6}`);
  await pendleData.setReentrancyWhitelist([pendleMarketAddress1, pendleMarketAddress2, pendleMarketAddress3, pendleMarketAddress4, pendleMarketAddress5, pendleMarketAddress6], [true, true, true, true, true, true]);

  await pendleRouter.tokenizeYield(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_3,
    TEST_AMOUNT_TO_TOKENIZE,
    alice.address
  );

  xytContract = new ethers.Contract(xytAddress, IATokenArtifact.abi, alice);

  await xytContract.approve(pendleRouter.address, constants.misc.MAX_ALLOWANCE);
  console.log(`\tApproved PendleRouter to spend xyt and usdt`);

  await pendleRouter.bootstrapMarket(
    constants.misc.FORGE_COMPOUND,
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
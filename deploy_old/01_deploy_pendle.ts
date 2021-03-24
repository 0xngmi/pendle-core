/**
 * Steps to use:
 * 1. Start your local blockchain with yarn ganache
 * 2. Replace the private key below with a wallet containing ETH
 * 3. Run yarn deploy:dev
 */
const Web3 = require("web3");
const HDWalletProvider = require("@truffle/hdwallet-provider");
const { ethers } = require("ethers");
const {
  devConstants,
  kovanConstants,
} = require("../deploy_helpers/Constants.ts");
const {
  PendleArtifact,
  PendleMarketArtifact,
  PendleTreasuryArtifact,
  PendleAaveForgeArtifact,
  PendleCompoundForgeArtifact,
  PendleMarketFactoryArtifact,
  PendleDataArtifact,
  IATokenArtifact,
  IUSDTArtifact,
  PendleMarketReaderArtifact,
} = require("../deploy_helpers/exports");

const TEST_AMOUNT_TO_MINT = 100000000000;
const TEST_AMOUNT_TO_TOKENIZE = 1500000000;
const TEST_AMOUNT_TO_BOOTSTRAP = 1000000000;
const privateKey =
  "a3237e736cc13bf91e38c50636593727a6b16d077ca4bb0ff627290b104fa93c";

const func = async function () {
  const httpProvider = new ethers.providers.AlchemyProvider(
    "kovan",
    "5cJkGtY8aUGF3Goy2X9KsH10NmJDcepZ"
  );
  //new ethers.providers.JsonRpcProvider()

  // new ethers.providers.InfuraProvider(
  //   "kovan",
  //   "e0836ade2a3643ffb71a30e4c48078d5"
  // );

  const signer = new ethers.Wallet(privateKey, httpProvider);
  // const web3Provider = new HDWalletProvider({
  //   providerOrUrl:,
  // });

  // const web3 = new Web3(
  //   new Web3.providers.HttpProvider("http://localhost:8545")
  // );

  const deployer = signer.address;
  const chainId = await httpProvider
    .getNetwork()
    .then((network) => network.chainId);

  // const { deployments, getNamedAccounts, getChainId } = hre;
  // const { deploy } = deployments;

  // const { deployer } = await getNamedAccounts();

  console.log(`\tDeployer = ${deployer}`);
  // const chainId = await getChainId();
  console.log(`\tChainId = ${chainId}`);

  const constants = chainId == 42 ? kovanConstants : devConstants;
  const pendleFactory = new ethers.ContractFactory(
    PendleArtifact.abi,
    PendleArtifact.bytecode,
    signer
  );
  const pendle = await pendleFactory.deploy(
    deployer,
    constants.tokens.WETH.address
  );

  let tx = pendle.deployTransaction;
  await httpProvider.waitForTransaction(tx.hash);

  console.log(`Deployed Pendle Contract at: ${pendle.address}`);

  const pendleTreasuryContractFactory = new ethers.ContractFactory(
    PendleTreasuryArtifact.abi,
    PendleTreasuryArtifact.bytecode,
    signer
  );
  const pendleTreasury = await pendleTreasuryContractFactory.deploy(deployer);
  tx = pendleTreasury.deployTransaction;
  await httpProvider.waitForTransaction(tx.hash);

  console.log(
    `Deployed Pendle Treasury Contract at: ${pendleTreasury.address}`
  );

  const pendleDataContractFactory = new ethers.ContractFactory(
    PendleDataArtifact.abi,
    PendleDataArtifact.bytecode,
    signer
  );
  const pendleData = await pendleDataContractFactory.deploy(
    deployer,
    pendleTreasury.address
  );
  tx = pendleData.deployTransaction;
  await httpProvider.waitForTransaction(tx.hash);
  console.log(`Deployed PendleData Contract at: ${pendleData.address}`);

  const pendleMarketReaderContractFactory = new ethers.ContractFactory(
    PendleMarketReaderArtifact.abi,
    PendleMarketReaderArtifact.bytecode,
    signer
  );
  const pendleMarketReader = await pendleMarketReaderContractFactory.deploy(
    pendleData.address
  );
  tx = pendleMarketReader.deployTransaction;
  await httpProvider.waitForTransaction(tx.hash);
  console.log(
    `Deployed PendleMarketReader Contract at: ${pendleMarketReader.address}`
  );

  // =============================================================================
  console.log("----- Initialising core contracts");

  tx = await pendleData.initialize(pendle.address);
  await httpProvider.waitForTransaction(tx.hash);

  tx = await pendle.initialize(pendleData.address);
  await httpProvider.waitForTransaction(tx.hash);

  console.log(
    "\n========== Deploying Aave & Compound Forge and Market Factories"
  );
  const pendleAaveForgeContractFactory = new ethers.ContractFactory(
    PendleAaveForgeArtifact.abi,
    PendleAaveForgeArtifact.bytecode,
    signer
  );
  const pendleAaveForge = await pendleAaveForgeContractFactory.deploy(
    pendle.address,
    pendle.address,
    constants.misc.AAVE_LENDING_POOL_CORE_ADDRESS,
    constants.misc.FORGE_AAVE
  );
  tx = pendleAaveForge.deployTransaction;
  await httpProvider.waitForTransaction(tx.hash);
  console.log(
    `Deployed Pendle Aave Forge Contract at: ${pendleAaveForge.address}`
  );

  const pendleAaveMarketFactoryContractFactory = new ethers.ContractFactory(
    PendleMarketFactoryArtifact.abi,
    PendleMarketFactoryArtifact.bytecode,
    signer
  );
  const pendleAaveMarketFactory = await pendleAaveMarketFactoryContractFactory.deploy(
    deployer,
    constants.misc.FORGE_AAVE
  );
  tx = pendleAaveMarketFactory.deployTransaction;
  await httpProvider.waitForTransaction(tx.hash);
  console.log(
    `Deployed Pendle Aave Market Factory Contract at: ${pendleAaveMarketFactory.address}`
  );

  const pendleCompoundForgeContractFactory = new ethers.ContractFactory(
    PendleCompoundForgeArtifact.abi,
    PendleCompoundForgeArtifact.bytecode,
    signer
  );

  const pendleCompoundForge = await pendleCompoundForgeContractFactory.deploy(
    signer.address,
    pendle.address,
    constants.misc.COMPOUND_COMPTROLLER_ADDRESS,
    constants.misc.FORGE_COMPOUND
  );
  tx = pendleCompoundForge.deployTransaction;
  await httpProvider.waitForTransaction(tx.hash);
  console.log(
    `Deployed Pendle Compound Forge Contract at: ${pendleCompoundForge.address}`
  );

  const pendleCompoundMarketFactory = await pendleAaveMarketFactoryContractFactory.deploy(
    deployer,
    constants.misc.FORGE_COMPOUND
  );
  tx = pendleCompoundMarketFactory.deployTransaction;
  await httpProvider.waitForTransaction(tx.hash);
  console.log(
    `Deployed Pendle Compound Market Factory Contract at: ${pendleCompoundMarketFactory.address}`
  );

  console.log("\n========== Initialising Markets and Forges");
  tx = await pendleAaveMarketFactory.initialize(pendle.address);
  await httpProvider.waitForTransaction(tx.hash);

  console.log("test 1");

  tx = await pendleCompoundMarketFactory.initialize(pendle.address);
  await httpProvider.waitForTransaction(tx.hash);
  console.log("test 2");

  tx = await pendle.addMarketFactory(
    constants.misc.FORGE_AAVE,
    pendleAaveMarketFactory.address
  );
  await httpProvider.waitForTransaction(tx.hash);
  console.log("test 3");

  tx = await pendleData.setForgeFactoryValidity(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    true
  );
  await httpProvider.waitForTransaction(tx.hash);
  console.log("test 4");

  tx = await pendle.addForge(
    constants.misc.FORGE_AAVE,
    pendleAaveForge.address
  );
  await httpProvider.waitForTransaction(tx.hash);
  console.log("test 5");

  tx = await pendle.addMarketFactory(
    constants.misc.FORGE_COMPOUND,
    pendleCompoundMarketFactory.address
  );
  await httpProvider.waitForTransaction(tx.hash);
  console.log("test 6");

  tx = await pendleData.setForgeFactoryValidity(
    constants.misc.FORGE_COMPOUND,
    constants.misc.FORGE_COMPOUND,
    true
  );
  await httpProvider.waitForTransaction(tx.hash);
  console.log("test 7");

  tx = await pendle.addForge(
    constants.misc.FORGE_COMPOUND,
    pendleCompoundForge.address
  );
  await httpProvider.waitForTransaction(tx.hash);
  console.log("test 8");

  tx = await pendleCompoundForge.registerCTokens(
    [constants.tokens.USDT_COMPOUND.address],
    [constants.tokens.USDT_COMPOUND.compound]
  );
  await httpProvider.waitForTransaction(tx.hash);
  console.log("test 9");

  tx = await pendleData.setLockParams(
    constants.misc.LOCK_NUMERATOR,
    constants.misc.LOCK_DENOMINATOR
  ); // lock market

  await httpProvider.waitForTransaction(tx.hash);

  // accounts[0] is assumed to have USDTs and AUSDTs already
  // if (chainId != 42) {
  //   const aUSDTToken = new web3.eth.Contract(
  //     IATokenArtifact.abi,
  //     constants.tokens.AUSDT.address
  //   );

  //   const USDTToken = new web3.eth.Contract(
  //     IUSDTArtifact.abi,
  //     constants.tokens.USDT.address
  //   );

  //   const ethBalance = await web3.eth.getBalance(constants.tokens.USDT.owner);
  //   const usdtBalance = await USDTToken.methods
  //     .balanceOf(constants.tokens.USDT.owner)
  //     .call();
  //   console.log(`\t\tEth balance of usdt owner = ${ethBalance}`);
  //   console.log(`\t\tusdt balance of usdt owner = ${usdtBalance.toString()}`);
  //   await USDTToken.methods
  //     .transfer(deployer, TEST_AMOUNT_TO_MINT)
  //     .send({ from: constants.tokens.USDT.owner });

  //   const ethBalance2 = await web3.eth.getBalance(constants.tokens.AUSDT.owner);
  //   const ausdtBalance = await aUSDTToken.methods
  //     .balanceOf(constants.tokens.AUSDT.owner)
  //     .call();
  //   console.log(`\t\tEth balance of ausdt owner = ${ethBalance2}`);
  //   console.log(
  //     `\t\tausdt balance of ausdt owner = ${ausdtBalance.toString()}`
  //   );

  //   await aUSDTToken.methods
  //     .transfer(deployer, TEST_AMOUNT_TO_MINT / 2)
  //     .send({ from: constants.tokens.AUSDT.owner, gas: 900000 });

  //   const aUSDTBalance = await aUSDTToken.methods.balanceOf(deployer).call();

  //   console.log("\t\tMinted USDT and AUSDT to deployer");
  //   console.log("\t\tAUSDT balance: " + aUSDTBalance);
  // }

  // =============================================================================
  console.log("----- Creating Aave Yield contracts and minting XYT/OTs");
  tx = await pendle.newYieldContracts(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT_AAVE.address,
    constants.misc.TEST_EXPIRY
  );
  await httpProvider.waitForTransaction(tx.hash);

  tx = await pendle.newYieldContracts(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT_AAVE.address,
    constants.misc.TEST_EXPIRY_2
  );
  await httpProvider.waitForTransaction(tx.hash);

  tx = await pendle.newYieldContracts(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT_AAVE.address,
    constants.misc.TEST_EXPIRY_3
  );
  await httpProvider.waitForTransaction(tx.hash);

  let xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT_AAVE.address,
    constants.misc.TEST_EXPIRY
  );

  let otAddress = await pendleData.otTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT_AAVE.address,
    constants.misc.TEST_EXPIRY
  );
  console.log(`\tXYT contract deployed, address = ${xytAddress}`);
  console.log(`\tOT contract deployed, address = ${otAddress}`);

  const usdtContract = new ethers.Contract(
    constants.tokens.USDT_AAVE.address,
    IATokenArtifact.abi,
    signer
  );

  const ausdtContract = new ethers.Contract(
    constants.tokens.AUSDT.address,
    IATokenArtifact.abi,
    signer
  );

  let xytContract = new ethers.Contract(
    xytAddress,
    IATokenArtifact.abi,
    signer
  );

  tx = await ausdtContract.approve(
    pendle.address,
    constants.misc.MAX_ALLOWANCE
  );
  await httpProvider.waitForTransaction(tx.hash);
  console.log(`\tApproved Aave forge to spend aUSDT`);

  // const aUSDT = new ethers.Contract(aUSDTAddress, IUSDTArtifact.abi, signer)
  tx = await pendle.tokenizeYield(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT_AAVE.address,
    constants.misc.TEST_EXPIRY,
    TEST_AMOUNT_TO_TOKENIZE,
    deployer
  );
  await httpProvider.waitForTransaction(tx.hash);

  // =============================================================================
  console.log("----- Creating Aave Test Pendle market");
  tx = await pendle.createMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT_AAVE.address
  );
  await httpProvider.waitForTransaction(tx.hash);

  let pendleMarketAddress1 = await pendleData.getMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT_AAVE.address
  );

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress1}`);

  tx = await xytContract.approve(pendle.address, constants.misc.MAX_ALLOWANCE);
  await httpProvider.waitForTransaction(tx.hash);

  tx = await usdtContract.approve(pendle.address, constants.misc.MAX_ALLOWANCE);
  await httpProvider.waitForTransaction(tx.hash);

  console.log(`\tApproved PendleRouter to spend xyt and usdt`);

  tx = await pendle.bootstrapMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP,
    { gasLimit: 8000000 }
  );
  await httpProvider.waitForTransaction(tx.hash);
  console.log(`\tBootstrapped Market`);

  tx = await pendle.swapExactIn(
    xytAddress,
    constants.tokens.USDT_AAVE.address,
    TEST_AMOUNT_TO_BOOTSTRAP / 10,
    0,
    constants.misc.MAX_ALLOWANCE,
    constants.misc.FORGE_AAVE,
    { gasLimit: 8000000 }
  );
  await httpProvider.waitForTransaction(tx.hash);
  console.log(`\tDid a test trade`);

  // =============================================================================
  console.log("----- Creating Test Pendle market 2");
  xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT_AAVE.address,
    constants.misc.TEST_EXPIRY_2
  );
  otAddress = await pendleData.otTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT_AAVE.address,
    constants.misc.TEST_EXPIRY_2
  );
  console.log("\txytAddress:", xytAddress);
  console.log("otAddress:", otAddress);

  tx = await pendle.createMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT_AAVE.address
  );
  await httpProvider.waitForTransaction(tx.hash);

  let pendleMarketAddress2 = await pendleData.getMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT_AAVE.address
  );

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress2}`);

  tx = await pendle.tokenizeYield(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT_AAVE.address,
    constants.misc.TEST_EXPIRY_2,
    TEST_AMOUNT_TO_TOKENIZE,
    deployer
  );
  await httpProvider.waitForTransaction(tx.hash);

  xytContract = new ethers.Contract(xytAddress, IATokenArtifact.abi, signer);

  tx = await xytContract.approve(pendle.address, constants.misc.MAX_ALLOWANCE);
  await httpProvider.waitForTransaction(tx.hash);
  // await usdtContract.approve(pendle.address, constants.misc.MAX_ALLOWANCE);
  console.log(`\tApproved PendleRouter to spend xyt`);

  tx = await pendle.bootstrapMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP,
    { gasLimit: 8000000 }
  );
  await httpProvider.waitForTransaction(tx.hash);

  console.log(`\tBootstrapped Market`);

  // =============================================================================
  console.log("----- Creating Test Pendle market 3");
  xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT_AAVE.address,
    constants.misc.TEST_EXPIRY_3
  );
  otAddress = await pendleData.otTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT_AAVE.address,
    constants.misc.TEST_EXPIRY_3
  );
  console.log("\txytAddress:", xytAddress);
  console.log("otAddress:", otAddress);

  tx = await pendle.createMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT_AAVE.address
  );
  await httpProvider.waitForTransaction(tx.hash);

  let pendleMarketAddress3 = await pendleData.getMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT_AAVE.address
  );

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress3}`);

  tx = await pendle.tokenizeYield(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT_AAVE.address,
    constants.misc.TEST_EXPIRY_3,
    TEST_AMOUNT_TO_TOKENIZE,
    deployer
  );
  await httpProvider.waitForTransaction(tx.hash);

  xytContract = new ethers.Contract(xytAddress, IATokenArtifact.abi, signer);

  tx = await xytContract.approve(pendle.address, constants.misc.MAX_ALLOWANCE);
  await httpProvider.waitForTransaction(tx.hash);
  // await usdtContract.approve(pendle.address, constants.misc.MAX_ALLOWANCE);
  console.log(`\tApproved PendleRouter to spend xyt and usdt`);

  tx = await pendle.bootstrapMarket(
    constants.misc.FORGE_AAVE,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP,
    { gasLimit: 8000000 }
  );
  await httpProvider.waitForTransaction(tx.hash);

  console.log(`\tBootstrapped Market`);

  // =============================================================================
  console.log("----- Creating Compound Yield contracts and minting XYT/OTs");
  tx = await pendle.newYieldContracts(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT_COMPOUND.address,
    constants.misc.TEST_EXPIRY
  );
  await httpProvider.waitForTransaction(tx.hash);

  tx = await pendle.newYieldContracts(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT_COMPOUND.address,
    constants.misc.TEST_EXPIRY_2
  );
  await httpProvider.waitForTransaction(tx.hash);

  tx = await pendle.newYieldContracts(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT_COMPOUND.address,
    constants.misc.TEST_EXPIRY_3
  );
  await httpProvider.waitForTransaction(tx.hash);

  xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT_COMPOUND.address,
    constants.misc.TEST_EXPIRY
  );

  otAddress = await pendleData.otTokens(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT_COMPOUND.address,
    constants.misc.TEST_EXPIRY
  );
  console.log(`\tXYT contract deployed, address = ${xytAddress}`);
  console.log(`\tOT contract deployed, address = ${otAddress}`);

  xytContract = new ethers.Contract(xytAddress, IATokenArtifact.abi, signer);

  // const aUSDT = new ethers.Contract(aUSDTAddress, IUSDTArtifact.abi, signer)
  tx = await pendle.tokenizeYield(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT_COMPOUND.address,
    constants.misc.TEST_EXPIRY,
    TEST_AMOUNT_TO_TOKENIZE,
    deployer
  );
  await httpProvider.waitForTransaction(tx.hash);

  // =============================================================================
  console.log("----- Creating Compound Test Pendle market");
  tx = await pendle.createMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    constants.tokens.USDT_COMPOUND.address
  );
  await httpProvider.waitForTransaction(tx.hash);

  let pendleMarketAddress4 = await pendleData.getMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    constants.tokens.USDT_COMPOUND.address
  );

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress4}`);

  tx = await xytContract.approve(pendle.address, constants.misc.MAX_ALLOWANCE);
  await httpProvider.waitForTransaction(tx.hash);

  tx = await usdtContract.approve(pendle.address, constants.misc.MAX_ALLOWANCE);
  await httpProvider.waitForTransaction(tx.hash);

  console.log(`\tApproved PendleRouter to spend xyt and usdt`);

  tx = await pendle.bootstrapMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP,
    { gasLimit: 8000000 }
  );
  await httpProvider.waitForTransaction(tx.hash);
  console.log(`\tBootstrapped Market`);

  tx = await pendle.swapExactIn(
    xytAddress,
    constants.tokens.USDT_COMPOUND.address,
    TEST_AMOUNT_TO_BOOTSTRAP / 10,
    0,
    constants.misc.MAX_ALLOWANCE,
    constants.misc.FORGE_COMPOUND,
    { gasLimit: 8000000 }
  );
  await httpProvider.waitForTransaction(tx.hash);
  console.log(`\tDid a test trade`);

  // =============================================================================
  console.log("----- Creating Test Pendle market 2");
  xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT_COMPOUND.address,
    constants.misc.TEST_EXPIRY_2
  );
  otAddress = await pendleData.otTokens(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT_COMPOUND.address,
    constants.misc.TEST_EXPIRY_2
  );
  console.log("\txytAddress:", xytAddress);
  console.log("otAddress:", otAddress);

  tx = await pendle.createMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    constants.tokens.USDT_COMPOUND.address
  );
  await httpProvider.waitForTransaction(tx.hash);

  let pendleMarketAddress5 = await pendleData.getMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    constants.tokens.USDT_COMPOUND.address
  );

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress5}`);

  tx = await pendle.tokenizeYield(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT_COMPOUND.address,
    constants.misc.TEST_EXPIRY_2,
    TEST_AMOUNT_TO_TOKENIZE,
    deployer
  );
  await httpProvider.waitForTransaction(tx.hash);

  xytContract = new ethers.Contract(xytAddress, IATokenArtifact.abi, signer);

  tx = await xytContract.approve(pendle.address, constants.misc.MAX_ALLOWANCE);
  await httpProvider.waitForTransaction(tx.hash);
  // await usdtContract.approve(pendle.address, constants.misc.MAX_ALLOWANCE);
  console.log(`\tApproved PendleRouter to spend xyt`);

  tx = await pendle.bootstrapMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP,
    { gasLimit: 8000000 }
  );
  await httpProvider.waitForTransaction(tx.hash);

  console.log(`\tBootstrapped Market`);

  // =============================================================================
  console.log("----- Creating Test Pendle market 3");
  xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT_COMPOUND.address,
    constants.misc.TEST_EXPIRY_3
  );
  otAddress = await pendleData.otTokens(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT_COMPOUND.address,
    constants.misc.TEST_EXPIRY_3
  );
  console.log("\txytAddress:", xytAddress);
  console.log("otAddress:", otAddress);

  tx = await pendle.createMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    constants.tokens.USDT_COMPOUND.address
  );
  await httpProvider.waitForTransaction(tx.hash);

  let pendleMarketAddress6 = await pendleData.getMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    constants.tokens.USDT_COMPOUND.address
  );

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress6}`);

  tx = await pendle.tokenizeYield(
    constants.misc.FORGE_COMPOUND,
    constants.tokens.USDT_COMPOUND.address,
    constants.misc.TEST_EXPIRY_3,
    TEST_AMOUNT_TO_TOKENIZE,
    deployer
  );
  await httpProvider.waitForTransaction(tx.hash);

  xytContract = new ethers.Contract(xytAddress, IATokenArtifact.abi, signer);

  tx = await xytContract.approve(pendle.address, constants.misc.MAX_ALLOWANCE);
  await httpProvider.waitForTransaction(tx.hash);
  // await usdtContract.approve(pendle.address, constants.misc.MAX_ALLOWANCE);
  console.log(`\tApproved PendleRouter to spend xyt and usdt`);

  tx = await pendle.bootstrapMarket(
    constants.misc.FORGE_COMPOUND,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP,
    { gasLimit: 8000000 }
  );
  await httpProvider.waitForTransaction(tx.hash);

  console.log(`\tBootstrapped Market`);

  tx = await pendleData.setReentrancyWhitelist(
    [
      pendleMarketAddress1,
      pendleMarketAddress2,
      pendleMarketAddress3,
      pendleMarketAddress4,
      pendleMarketAddress5,
      pendleMarketAddress6,
    ],
    [true, true, true, true, true, true]
  );

  await httpProvider.waitForTransaction(tx.hash);
};
func();

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
  PendleAaveMarketFactoryArtifact,
  PendleDataArtifact,
  IATokenArtifact,
  IUSDTArtifact,
} = require("../deploy_helpers/exports");

const TEST_AMOUNT_TO_MINT = 100000000000;
const TEST_AMOUNT_TO_TOKENIZE = 1500000000;
const TEST_AMOUNT_TO_BOOTSTRAP = 1000000000;
const privateKey =
  "a3237e736cc13bf91e38c50636593727a6b16d077ca4bb0ff627290b104fa93c";

const func = async function () {
  const httpProvider = new ethers.providers.JsonRpcProvider();
  const signer = new ethers.Wallet(privateKey, httpProvider);
  // const web3Provider = new HDWalletProvider({
  //   providerOrUrl:,
  // });

  const web3 = new Web3(
    new Web3.providers.HttpProvider("http://localhost:8545")
  );

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

  console.log(`Deployed Pendle Contract at: ${pendle.address}`);

  const pendleTreasuryContractFactory = new ethers.ContractFactory(
    PendleTreasuryArtifact.abi,
    PendleTreasuryArtifact.bytecode,
    signer
  );
  const pendleTreasury = await pendleTreasuryContractFactory.deploy(deployer);

  console.log(
    `Deployed Pendle Treasury Contract at: ${pendleTreasury.address}`
  );

  const pendleAaveForgeContractFactory = new ethers.ContractFactory(
    PendleAaveForgeArtifact.abi,
    PendleAaveForgeArtifact.bytecode,
    signer
  );
  const pendleAaveForge = await pendleAaveForgeContractFactory.deploy(
    pendle.address,
    constants.misc.AAVE_LENDING_POOL_CORE_ADDRESS,
    constants.misc.FORGE_AAVE
  );

  console.log(
    `Deployed Pendle Aave Forge Contract at: ${pendleAaveForge.address}`
  );

  const pendleAaveMarketFactoryContractFactory = new ethers.ContractFactory(
    PendleAaveMarketFactoryArtifact.abi,
    PendleAaveMarketFactoryArtifact.bytecode,
    signer
  );
  const pendleAaveMarketFactory = await pendleAaveMarketFactoryContractFactory.deploy(
    deployer,
    constants.misc.FORGE_AAVE
  );

  console.log(
    `Deployed Pendle Aave Market Factory Contract at: ${pendleAaveMarketFactory.address}`
  );

  const pendleDataContractFactory = new ethers.ContractFactory(
    PendleDataArtifact.abi,
    PendleDataArtifact.bytecode,
    signer
  );
  const pendleData = await pendleDataContractFactory.deploy(deployer);

  console.log(`Deployed Pendle Contract at: ${pendleData.address}`);

  // =============================================================================
  console.log("----- Initialising core contracts");

  await pendleData.initialize(pendle.address);
  await pendleAaveMarketFactory.initialize(pendle.address);

  await pendle.initialize(pendleData.address, pendleTreasury.address);
  await pendle.addMarketFactory(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    pendleAaveMarketFactory.address
  );
  // =============================================================================
  console.log("----- Adding Aave Forge");
  await pendle.addForge(constants.misc.FORGE_AAVE, pendleAaveForge.address);

  // accounts[0] is assumed to have USDTs and AUSDTs already
  if (chainId != 42) {
    const aUSDTToken = new web3.eth.Contract(
      IATokenArtifact.abi,
      constants.tokens.AUSDT.address
    );

    const USDTToken = new web3.eth.Contract(
      IUSDTArtifact.abi,
      constants.tokens.USDT.address
    );

    const ethBalance = await web3.eth.getBalance(constants.tokens.USDT.owner);
    console.log(`\t\tEth balance of usdt owner = ${ethBalance}`);
    await USDTToken.methods
      .transfer(deployer, TEST_AMOUNT_TO_MINT)
      .send({ from: constants.tokens.USDT.owner });

    const ethBalance2 = await web3.eth.getBalance(constants.tokens.AUSDT.owner);
    console.log(`\t\tEth balance of usdt owner = ${ethBalance2}`);

    await aUSDTToken.methods
      .transfer(deployer, TEST_AMOUNT_TO_MINT / 2)
      .send({ from: constants.tokens.AUSDT.owner, gas: 900000 });

    const aUSDTBalance = await aUSDTToken.methods.balanceOf(deployer).call();

    console.log("\t\tMinted USDT and AUSDT to deployer");
    console.log("\t\tAUSDT balance: " + aUSDTBalance);
  }

  // =============================================================================
  console.log("----- Creating Yield contracts and minting XYT/OTs");
  await pendle.newYieldContracts(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY
  );

  await pendle.newYieldContracts(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_2
  );

  await pendle.newYieldContracts(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_3
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
  console.log(`\tXYT contract deployed, address = ${xytAddress}`);
  console.log(`\tOT contract deployed, address = ${otAddress}`);

  const usdtContract = new ethers.Contract(
    constants.tokens.USDT.address,
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

  await ausdtContract.approve(
    pendleAaveForge.address,
    constants.misc.MAX_ALLOWANCE
  );
  console.log(`\tApproved Aave forge to spend aUSDT`);

  // const aUSDT = new ethers.Contract(aUSDTAddress, IUSDTArtifact.abi, signer)
  await pendle.tokenizeYield(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY,
    TEST_AMOUNT_TO_TOKENIZE,
    deployer
  );

  // =============================================================================
  console.log("----- Creating Test Pendle market");
  await pendle.createMarket(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY
  );

  console.log("test");

  let pendleMarketAddress = await pendleData.getMarket(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address
  );

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress}`);

  await xytContract.approve(pendleMarketAddress, constants.misc.MAX_ALLOWANCE);
  await usdtContract.approve(pendleMarketAddress, constants.misc.MAX_ALLOWANCE);
  console.log(`\tApproved pendleMarket to spend xyt and usdt`);

  await pendle.bootStrapMarket(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP
  );
  console.log(`\tBootstrapped Market`);

  await pendle.swapXytFromToken(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address,
    TEST_AMOUNT_TO_BOOTSTRAP / 10,
    constants.misc.MAX_ALLOWANCE,
    constants.misc.MAX_ALLOWANCE,
    { gasLimit: 8000000 }
  );
  console.log(`\tDid a test trade`);

  // =============================================================================
  console.log("----- Creating Test Pendle market 2");
  xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_2
  );
  console.log("\txytAddress:", xytAddress);

  await pendle.createMarket(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_2
  );

  pendleMarketAddress = await pendleData.getMarket(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address
  );

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress}`);

  await pendle.tokenizeYield(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_2,
    TEST_AMOUNT_TO_TOKENIZE,
    deployer
  );

  xytContract = new ethers.Contract(xytAddress, IATokenArtifact.abi, signer);

  await xytContract.approve(pendleMarketAddress, constants.misc.MAX_ALLOWANCE);
  await usdtContract.approve(pendleMarketAddress, constants.misc.MAX_ALLOWANCE);
  console.log(`\tApproved pendleMarket to spend xyt and usdt`);

  await pendle.bootStrapMarket(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP
  );
  console.log(`\tBootstrapped Market`);

  // =============================================================================
  console.log("----- Creating Test Pendle market 3");
  xytAddress = await pendleData.xytTokens(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_3
  );
  console.log("\txytAddress:", xytAddress);
  await pendle.createMarket(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_3
  );

  pendleMarketAddress = await pendleData.getMarket(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    xytAddress,
    constants.tokens.USDT.address
  );

  console.log(`\tDeployed a XYT/USDT market at ${pendleMarketAddress}`);

  await pendle.tokenizeYield(
    constants.misc.FORGE_AAVE,
    constants.tokens.USDT.address,
    constants.misc.TEST_EXPIRY_3,
    TEST_AMOUNT_TO_TOKENIZE,
    deployer
  );

  xytContract = new ethers.Contract(xytAddress, IATokenArtifact.abi, signer);

  await xytContract.approve(pendleMarketAddress, constants.misc.MAX_ALLOWANCE);
  await usdtContract.approve(pendleMarketAddress, constants.misc.MAX_ALLOWANCE);
  console.log(`\tApproved pendleMarket to spend xyt and usdt`);

  await pendle.bootStrapMarket(
    constants.misc.FORGE_AAVE,
    constants.misc.FORGE_AAVE,
    xytAddress,
    usdtContract.address,
    TEST_AMOUNT_TO_BOOTSTRAP,
    TEST_AMOUNT_TO_BOOTSTRAP
  );
  console.log(`\tBootstrapped Market`);
};
func();

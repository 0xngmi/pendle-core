const hre = require("hardhat");
import fs from "fs";
import path from "path";
const { execSync } = require("child_process");

import { Deployment, DeployedContract } from "../helpers/deployHelpers";
async function main() {
  const network = hre.network.name;
  const filePath = path.resolve(__dirname, `../../deployments/${network}.json`);

  // const tenderlyNetwork = network == "kovantest" ? "kovan" : network;

  console.log(
    `\n\tNetwork = ${network}`
  );
  console.log(`\tDeployment's filePath = ${filePath}`);

  const existingDeploymentJson = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const deployment = existingDeploymentJson as Deployment;

  // console.log(`ecosystemFundContract address from deployment = ${deployment.contracts.PendleEcosystemFund.address}`);
  // const ecosystemFundContract = await (await hre.ethers.getContractFactory("PendleTokenDistribution")).attach(deployment.contracts.PendleEcosystemFund.address);
  // console.log(`ecosystemFundContract address = ${ecosystemFundContract.address}`);
  // const tx = await ecosystemFundContract.initialize("0x808507121B80c02388fAd14726482e061B8da827");
  // console.log(JSON.stringify(tx, null, "  "));
  // const pendleTokenInContract = await ecosystemFundContract.pendleToken();
  // console.log(`Pendle token initialised in PendleEcosystemFund contract  = ${pendleTokenInContract}`);


  console.log(`teamTokensContract address from deployment = ${deployment.contracts.PendleTeamTokens.address}`);
  const teamTokensContract = await (await hre.ethers.getContractFactory("PendleTokenDistribution")).attach(deployment.contracts.PendleTeamTokens.address);
  console.log(`teamTokensContract address = ${teamTokensContract.address}`);
  // const tx = await teamTokensContract.initialize("0x808507121B80c02388fAd14726482e061B8da827");
  // console.log(JSON.stringify(tx, null, "  "));

  const pendleTokenInContract = await teamTokensContract.pendleToken();
  console.log(`Pendle token initialised in PendleTeamTokens contract  = ${pendleTokenInContract}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

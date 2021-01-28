
import { providers, Contract, Wallet, BigNumber as BN } from 'ethers';
import PendleAaveForge from '../../../build/artifacts/contracts/core/PendleAaveForge.sol/PendleAaveForge.json';
import PendleFutureYieldToken from "../../../build/artifacts/contracts/tokens/PendleFutureYieldToken.sol/PendleFutureYieldToken.json";
import PendleOwnershipToken from '../../../build/artifacts/contracts/tokens/PendleOwnershipToken.sol/PendleOwnershipToken.json';
import { consts, tokens, setT0, setTime, setTimeNextBlock } from "../../helpers";
import { PendleCoreFixture } from "./pendleCore.fixture";

const { waffle } = require("hardhat");
const { deployContract } = waffle;

export interface PendleAaveFixture {
    pendleAaveForge: Contract
    pendleOwnershipToken: Contract
    pendleFutureYieldToken: Contract
}

export async function pendleAaveForgeFixture(
    wallet: Wallet,
    provider: providers.Web3Provider,
    { pendle, pendleData }: PendleCoreFixture,
    useFixedTime: boolean
): Promise<PendleAaveFixture> {
    const pendleAaveForge = await deployContract(wallet, PendleAaveForge, [pendle.address, consts.AAVE_LENDING_POOL_CORE_ADDRESS, consts.FORGE_AAVE]);

    await pendle.addForge(consts.FORGE_AAVE, pendleAaveForge.address)

    if (useFixedTime == true) {
        setT0(BN.from(4000000000));
        setTimeNextBlock(provider, consts.T0);
        console.log("block number after setTime", await provider.getBlockNumber());
    }

    await pendleAaveForge.newYieldContracts(tokens.USDT.address, consts.T0.add(consts.SIX_MONTH));
    const otTokenAddress = await pendleData.otTokens(
        consts.FORGE_AAVE,
        tokens.USDT.address,
        consts.T0.add(consts.SIX_MONTH)
    );

    const xytTokenAddress = await pendleData.xytTokens(
        consts.FORGE_AAVE,
        tokens.USDT.address,
        consts.T0.add(consts.SIX_MONTH)
    );

    const pendleOwnershipToken = new Contract(otTokenAddress, PendleOwnershipToken.abi, wallet);
    const pendleFutureYieldToken = new Contract(xytTokenAddress, PendleFutureYieldToken.abi, wallet);

    return { pendleAaveForge, pendleOwnershipToken, pendleFutureYieldToken, };
}

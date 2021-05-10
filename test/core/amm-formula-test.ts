import { expect } from "chai";
import { BigNumber as BN, Contract, Wallet } from "ethers";
import {
  mintOtAndXyt,
  amountToWei,
  consts,
  setTimeNextBlock,
  Token,
  approxBigNumber,
} from "../helpers";

const { waffle } = require("hardhat");
const { provider } = waffle;

export async function AMMTest(
  router: Contract,
  market: Contract,
  tokenUSDT: Token,
  testToken: Contract,
  xyt: Contract,
  bootstrapSampleMarket: Function,
  useSwapIn: boolean // if this is true, use swapExactIn. use swapExactOut otherwise.
) {
  async function swapExactInTokenToXyt(inAmount: BN) {
    await router.swapExactIn(
      testToken.address,
      xyt.address,
      inAmount,
      BN.from(0),
      consts.MARKET_FACTORY_AAVE
    );
  }

  async function swapExactInXytToToken(inAmount: BN) {
    await router.swapExactIn(
      xyt.address,
      testToken.address,
      inAmount,
      BN.from(0),
      consts.MARKET_FACTORY_AAVE
    );
  }

  async function swapExactOutTokenToXyt(outAmount: BN, inAmountLimit: BN) {
    await router.swapExactOut(
      testToken.address,
      xyt.address,
      outAmount,
      inAmountLimit,
      consts.MARKET_FACTORY_AAVE
    );
  }

  async function swapExactOutXytToToken(outAmount: BN, inAmountLimit: BN) {
    await router.swapExactOut(
      xyt.address,
      testToken.address,
      outAmount,
      inAmountLimit,
      consts.MARKET_FACTORY_AAVE
    );
  }

  async function runTestTokenToXyt(time: BN, tokenIn: BN, xytOut: BN) {
    var {
      xytBalance: initialXytBalance,
      tokenBalance: initialTokenBalance,
    } = await market.getReserves();

    await setTimeNextBlock(provider, time);
    if (useSwapIn) {
      await swapExactInTokenToXyt(tokenIn);
    } else {
      // tokenIn.mul(2): double the expected rate to make sure the transaction is successful.
      await swapExactOutTokenToXyt(xytOut, tokenIn.mul(2));
    }
    var { xytBalance, tokenBalance } = await market.getReserves();

    var actualXytOut = initialXytBalance.sub(xytBalance);
    var actualTokenIn = tokenBalance.sub(initialTokenBalance);

    expect(tokenIn.toNumber()).to.be.approximately(
      actualTokenIn.toNumber(),
      consts.TEST_TOKEN_DELTA.toNumber()
    );
    expect(xytOut.toNumber()).to.be.approximately(
      actualXytOut.toNumber(),
      consts.TEST_TOKEN_DELTA.toNumber()
    );
  }

  async function runTestXytToToken(time: BN, xytIn: BN, tokenOut: BN) {
    var {
      xytBalance: initialXytBalance,
      tokenBalance: initialTokenBalance,
    } = await market.getReserves();

    await setTimeNextBlock(provider, time);
    if (useSwapIn) {
      await swapExactInXytToToken(xytIn);
    } else {
      // tokenIn.mul(2): double the expected rate to make sure the transaction is successful.
      await swapExactOutXytToToken(tokenOut, xytIn.mul(2));
    }
    var { xytBalance, tokenBalance } = await market.getReserves();

    var actualXytIn: BN = xytBalance.sub(initialXytBalance);
    var actualTokenOut: BN = initialTokenBalance.sub(tokenBalance);

    expect(tokenOut.toNumber()).to.be.approximately(
      actualTokenOut.toNumber(),
      consts.TEST_TOKEN_DELTA.toNumber()
    );
    expect(xytIn.toNumber()).to.be.approximately(
      actualXytIn.toNumber(),
      consts.TEST_TOKEN_DELTA.toNumber()
    );
  }

  /*-------------------------------------------------------------*/
  const amount = amountToWei(BN.from(1000), 6);
  await bootstrapSampleMarket(amount);
  await testToken.approve(market.address, consts.INF);

  await runTestTokenToXyt(
    consts.T0.add(3600),
    BN.from(20405615),
    BN.from(20000000)
  );
  await runTestXytToToken(
    consts.T0.add(3660),
    BN.from(120000000),
    BN.from(111303781)
  );
  await runTestTokenToXyt(
    consts.T0.add(43200),
    BN.from(300000000),
    BN.from(273280448)
  );
  await runTestXytToToken(
    consts.T0.add(43210),
    BN.from(74655258),
    BN.from(100000000)
  );
  await runTestXytToToken(
    consts.T0.add(2592030),
    BN.from(100000000),
    BN.from(100716340)
  );
  await runTestXytToToken(
    consts.T0.add(14515300),
    BN.from(200000000),
    BN.from(24266823)
  );
  await runTestTokenToXyt(
    consts.T0.add(14861000),
    BN.from(26338047),
    BN.from(300000000)
  );
  await runTestXytToToken(
    consts.T0.add(15120300),
    BN.from(400000000),
    BN.from(21595046)
  );
  await runTestTokenToXyt(
    consts.T0.add(15120360),
    BN.from(3696839),
    BN.from(80000000)
  );
  await runTestXytToToken(
    consts.T0.add(15379200),
    BN.from(800000016),
    BN.from(11997610)
  );
}

export async function MarketFeesTest(
  router: Contract,
  market: Contract,
  tokenUSDT: Token,
  testToken: Contract,
  xyt: Contract,
  bootstrapSampleMarket: Function,
  useSwapIn: boolean // if this is true, use swapExactIn. use swapExactOut otherwise.
) {
  async function swapExactInTokenToXyt(inAmount: BN) {
    await router.swapExactIn(
      testToken.address,
      xyt.address,
      inAmount,
      BN.from(0),
      consts.MARKET_FACTORY_AAVE
    );
  }

  async function swapExactInXytToToken(inAmount: BN) {
    await router.swapExactIn(
      xyt.address,
      testToken.address,
      inAmount,
      BN.from(0),
      consts.MARKET_FACTORY_AAVE
    );
  }

  async function swapExactOutTokenToXyt(outAmount: BN, inAmountLimit: BN) {
    await router.swapExactOut(
      testToken.address,
      xyt.address,
      outAmount,
      inAmountLimit,
      consts.MARKET_FACTORY_AAVE
    );
  }

  async function swapExactOutXytToToken(outAmount: BN, inAmountLimit: BN) {
    await router.swapExactOut(
      xyt.address,
      testToken.address,
      outAmount,
      inAmountLimit,
      consts.MARKET_FACTORY_AAVE
    );
  }

  async function runTestTokenToXyt(time: BN, tokenIn: BN, xytOut: BN) {
    var {
      xytBalance: initialXytBalance,
      tokenBalance: initialTokenBalance,
    } = await market.getReserves();

    await setTimeNextBlock(provider, time);
    if (useSwapIn) {
      await swapExactInTokenToXyt(tokenIn);
    } else {
      // tokenIn.mul(2): double the expected rate to make sure the transaction is successful.
      await swapExactOutTokenToXyt(xytOut, tokenIn.mul(2));
    }
    var { xytBalance, tokenBalance } = await market.getReserves();

    var actualXytOut = initialXytBalance.sub(xytBalance);
    var actualTokenIn = tokenBalance.sub(initialTokenBalance);

    expect(tokenIn.toNumber()).to.be.approximately(
      actualTokenIn.toNumber(),
      consts.TEST_TOKEN_DELTA.toNumber()
    );
    expect(xytOut.toNumber()).to.be.approximately(
      actualXytOut.toNumber(),
      consts.TEST_TOKEN_DELTA.toNumber()
    );
  }

  async function runTestXytToToken(time: BN, xytIn: BN, tokenOut: BN) {
    var {
      xytBalance: initialXytBalance,
      tokenBalance: initialTokenBalance,
    } = await market.getReserves();

    await setTimeNextBlock(provider, time);
    if (useSwapIn) {
      await swapExactInXytToToken(xytIn);
    } else {
      // tokenIn.mul(2): double the expected rate to make sure the transaction is successful.
      await swapExactOutXytToToken(tokenOut, xytIn.mul(2));
    }
    var { xytBalance, tokenBalance } = await market.getReserves();

    var actualXytIn: BN = xytBalance.sub(initialXytBalance);
    var actualTokenOut: BN = initialTokenBalance.sub(tokenBalance);

    expect(tokenOut.toNumber()).to.be.approximately(
      actualTokenOut.toNumber(),
      consts.TEST_TOKEN_DELTA.toNumber()
    );
    expect(xytIn.toNumber()).to.be.approximately(
      actualXytIn.toNumber(),
      consts.TEST_TOKEN_DELTA.toNumber()
    );
  }

  /*-------------------------------------------------------------*/
  const amount = amountToWei(BN.from(1000), 6);
  await bootstrapSampleMarket(amount);
  await testToken.approve(market.address, consts.INF);

  await runTestTokenToXyt(
    consts.T0.add(3600),
    BN.from(20405615),
    BN.from(19931395)
  );

  await runTestTokenToXyt(
    consts.T0.add(21600),
    BN.from(20405615),
    BN.from(19162864)
  );

  await runTestTokenToXyt(
    consts.T0.add(93600),
    BN.from(14832741),
    BN.from(13498154)
  );

  await runTestXytToToken(
    consts.T0.add(205200),
    BN.from(12731281),
    BN.from(13851215)
  );

  await runTestXytToToken(
    consts.T0.add(720000),
    BN.from(11241212),
    BN.from(11713770)
  );

  await runTestTokenToXyt(
    consts.T0.add(900000),
    BN.from(112411212),
    BN.from(98219316)
  );
}

export async function ProtocolFeeTest(
  router: Contract,
  market: Contract,
  tokenUSDT: Token,
  testToken: Contract,
  xyt: Contract,
  bootstrapSampleMarket: Function,
  useSwapIn: boolean, // if this is true, use swapExactIn. use swapExactOut otherwise.
  treasury: string,
  bob: Wallet,
  alice: Wallet,
  addLiquidityDual: Function
) {
  async function swapExactInTokenToXyt(inAmount: BN) {
    await router.swapExactIn(
      testToken.address,
      xyt.address,
      inAmount,
      BN.from(0),
      consts.MARKET_FACTORY_AAVE,
      consts.HIGH_GAS_OVERRIDE
    );
  }

  async function swapExactInXytToToken(inAmount: BN) {
    await router.swapExactIn(
      xyt.address,
      testToken.address,
      inAmount,
      BN.from(0),
      consts.MARKET_FACTORY_AAVE,
      consts.HIGH_GAS_OVERRIDE
    );
  }

  async function swapExactOutTokenToXyt(outAmount: BN, inAmountLimit: BN) {
    await router.swapExactOut(
      testToken.address,
      xyt.address,
      outAmount,
      inAmountLimit,
      consts.MARKET_FACTORY_AAVE
    );
  }

  async function swapExactOutXytToToken(outAmount: BN, inAmountLimit: BN) {
    await router.swapExactOut(
      xyt.address,
      testToken.address,
      outAmount,
      inAmountLimit,
      consts.MARKET_FACTORY_AAVE
    );
  }

  async function runTestTokenToXyt(time: BN, tokenIn: BN, xytOut: BN) {
    var {
      xytBalance: initialXytBalance,
      tokenBalance: initialTokenBalance,
    } = await market.getReserves();

    await setTimeNextBlock(provider, time);
    if (useSwapIn) {
      await swapExactInTokenToXyt(tokenIn);
    } else {
      // tokenIn.mul(2): double the expected rate to make sure the transaction is successful.
      await swapExactOutTokenToXyt(xytOut, tokenIn.mul(2));
    }
    var { xytBalance, tokenBalance } = await market.getReserves();

    var actualXytOut = initialXytBalance.sub(xytBalance);
    var actualTokenIn = tokenBalance.sub(initialTokenBalance);

    expect(tokenIn.toNumber()).to.be.approximately(
      actualTokenIn.toNumber(),
      consts.TEST_TOKEN_DELTA.toNumber()
    );
    expect(xytOut.toNumber()).to.be.approximately(
      actualXytOut.toNumber(),
      consts.TEST_TOKEN_DELTA.toNumber()
    );
  }

  async function runTestXytToToken(time: BN, xytIn: BN, tokenOut: BN) {
    var {
      xytBalance: initialXytBalance,
      tokenBalance: initialTokenBalance,
    } = await market.getReserves();

    await setTimeNextBlock(provider, time);
    if (useSwapIn) {
      await swapExactInXytToToken(xytIn);
    } else {
      // tokenIn.mul(2): double the expected rate to make sure the transaction is successful.
      await swapExactOutXytToToken(tokenOut, xytIn.mul(2));
    }
    var { xytBalance, tokenBalance } = await market.getReserves();

    var actualXytIn: BN = xytBalance.sub(initialXytBalance);
    var actualTokenOut: BN = initialTokenBalance.sub(tokenBalance);

    expect(tokenOut.toNumber()).to.be.approximately(
      actualTokenOut.toNumber(),
      consts.TEST_TOKEN_DELTA.toNumber()
    );
    expect(xytIn.toNumber()).to.be.approximately(
      actualXytIn.toNumber(),
      consts.TEST_TOKEN_DELTA.toNumber()
    );
  }

  async function swapXytToToken(xytIn: BN) {
    await swapExactInXytToToken(xytIn);
  }

  async function swapTokenToXyt(tokenIn: BN) {
    await swapExactInTokenToXyt(tokenIn);
  }

  async function logBalance() {
    console.log((await market.getReserves()).xytBalance.toString());
    console.log((await market.getReserves()).tokenBalance.toString());
  }

  /// Run a lot of swaps so that the treasury lp is significant enough to test
  async function runSwap(time: BN, swapTime: number) {
    await setTimeNextBlock(provider, time);
    for (let i = 0; i < swapTime; ++i) {
      let amount = BN.from(40000000 + 5000000 * i);
      if (i % 3 == 0) {
        await swapTokenToXyt(amount);
      } else {
        await swapXytToToken(amount);
      }
      await addLiquidityDual(amount);
    }
  }

  async function testConstantK(expected: BN) {
    approxBigNumber(
      await market.balanceOf(treasury),
      expected,
      BN.from(3000),
      false
    );
  }

  async function printMarketData() {
    let marketData = await market.getReserves();
    console.log("");
    console.log("====================MARKET-DATA====================");
    console.log("xytWeight: ", marketData.xytWeight.toString());
    console.log("tokenWeight: ", marketData.tokenWeight.toString());
    console.log("xytBalance: ", marketData.xytBalance.toString());
    console.log("tokenBalance: ", marketData.tokenBalance.toString());
    console.log("===================================================");
    console.log("");
  }

  /*-------------------------------------------------------------*/

  const amount = BN.from(10000000000);
  const constSwapAmount = BN.from(1500500 * 15);
  let treasuryEarned = BN.from(0);

  async function checkTreasuryLP(expectedLP: BN) {
    let currentTreasuryLP = BN.from(await market.balanceOf(treasury));
    approxBigNumber(
      currentTreasuryLP,
      expectedLP,
      consts.TEST_TOKEN_DELTA.toNumber() * 2
    );
  }

  await bootstrapSampleMarket(amount);
  await testToken.approve(market.address, consts.INF);

  setTimeNextBlock(provider, consts.T0.add(3600));
  await xyt
    .connect(bob)
    .transfer(alice.address, BN.from(10000000000), consts.HIGH_GAS_OVERRIDE);
  await testToken
    .connect(bob)
    .transfer(alice.address, BN.from(10000000000), consts.HIGH_GAS_OVERRIDE);
  await swapTokenToXyt(constSwapAmount);
  await swapXytToToken(constSwapAmount);
  await addLiquidityDual(constSwapAmount);
  await checkTreasuryLP(BN.from(7860));

  setTimeNextBlock(provider, consts.T0.add(3600 * 10));
  await swapTokenToXyt(constSwapAmount.mul(2));
  await swapXytToToken(constSwapAmount.mul(3));
  await addLiquidityDual(constSwapAmount.mul(4));
  await checkTreasuryLP(BN.from(31431));

  setTimeNextBlock(provider, consts.T0.add(3600 * 100));
  await swapTokenToXyt(constSwapAmount.mul(5));
  await swapXytToToken(constSwapAmount.mul(6));
  await addLiquidityDual(constSwapAmount.mul(7));
  await checkTreasuryLP(BN.from(94281));

  setTimeNextBlock(provider, consts.T0.add(3600 * 300));
  await swapTokenToXyt(constSwapAmount.mul(8));
  await swapXytToToken(constSwapAmount.mul(9));
  await addLiquidityDual(constSwapAmount.mul(10));
  await checkTreasuryLP(BN.from(204450));

  setTimeNextBlock(provider, consts.T0.add(3600 * 500));
  await swapTokenToXyt(constSwapAmount.mul(11));
  await swapXytToToken(constSwapAmount.mul(12));
  await addLiquidityDual(constSwapAmount.mul(13));
  await checkTreasuryLP(BN.from(361534));
}

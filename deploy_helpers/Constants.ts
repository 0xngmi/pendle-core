const { BigNumber, utils } = require("ethers");

// export type Token = {
//   address: string;
//   decimal: number;
//   owner?: string;
// };

// type TokenMap = Record<string, Token>;

// export type Constants = {
//   tokens: TokenMap;
//   misc: Record<string, any>;
// };

module.exports.devConstants = {
  misc: {
    DUMMY_GOVERNANCE_ADDRESS: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    AAVE_LENDING_POOL_CORE_ADDRESS:
      "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3",
    AAVE_LENDING_POOL_ADDRESS: "0x398ec7346dcd622edc5ae82352f02be94c62d119",
    AAVE_DUMMY_REFERRAL_CODE: 0,
    COMPOUND_COMPTROLLER_ADDRESS: "0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b",
    USDT_OWNER_ADDRESS: "0xC6CDE7C39eB2f0F0095F41570af89eFC2C1Ea828",
    FORGE_AAVE: utils.formatBytes32String("Aave"),
    FORGE_COMPOUND: utils.formatBytes32String("Compound"),
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    MAX_ALLOWANCE: BigNumber.from(2)
      .pow(BigNumber.from(256))
      .sub(BigNumber.from(1)),
    ONE_DAY: BigNumber.from(86400),
    ONE_MONTH: BigNumber.from(2592000),
    TEST_EXPIRY: 1623500719,
    TEST_EXPIRY_2: 1618230319,
    TEST_EXPIRY_3: 1620822319,
    ONE_YEAR: BigNumber.from(31536000),
    LOCK_NUMERATOR: BigNumber.from(1),
    LOCK_DENOMINATOR: BigNumber.from(180),
  },
  tokens: {
    USDT: {
      address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      decimal: 6,
      owner: "0xC6CDE7C39eB2f0F0095F41570af89eFC2C1Ea828",
      compound: "0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9",
    },
    WETH: {
      address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      decimal: 18,
    },
    USDC: {
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      decimal: 6,
      compound: "0x39aa39c021dfbae8fac545936693ac917d5e7563",
    },
    AUSDT: {
      address: "0x71fc860F7D3A592A4a98740e39dB31d25db65ae8",
      decimal: 6,
      owner: "0x4188a7dca2757ebc7d9a5bd39134a15b9f3c6402",
    },
  },
};

module.exports.kovanConstants = {
  misc: {
    AAVE_LENDING_POOL_CORE_ADDRESS:
      "0x95D1189Ed88B380E319dF73fF00E479fcc4CFa45",
    AAVE_LENDING_POOL_ADDRESS: "0x580D4Fdc4BF8f9b5ae2fb9225D584fED4AD5375c",
    AAVE_DUMMY_REFERRAL_CODE: 0,
    COMPOUND_COMPTROLLER_ADDRESS: "0x5eae89dc1c671724a672ff0630122ee834098657",
    FORGE_AAVE: utils.formatBytes32String("Aave"),
    FORGE_COMPOUND: utils.formatBytes32String("Compound"),
    ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
    MAX_ALLOWANCE: BigNumber.from(2)
      .pow(BigNumber.from(256))
      .sub(BigNumber.from(1)),
    ONE_DAY: BigNumber.from(86400),
    ONE_MONTH: BigNumber.from(2592000),
    TEST_EXPIRY: 1623500719,
    TEST_EXPIRY_2: 1618230319,
    TEST_EXPIRY_3: 1620822319,
    ONE_YEAR: BigNumber.from(31536000),
    LOCK_NUMERATOR: BigNumber.from(1),
    LOCK_DENOMINATOR: BigNumber.from(180),
  },
  tokens: {
    USDT_AAVE: {
      address: "0x13512979ade267ab5100878e2e0f485b568328a4",
      decimal: 6,
      owner: "0xC6CDE7C39eB2f0F0095F41570af89eFC2C1Ea828",
      compound: "0x3f0a0ea2f86bae6362cf9799b523ba06647da018",
    },
    USDT_COMPOUND: {
      address: "0x07de306ff27a2b630b1141956844eb1552b956b5",
      decimal: 6,
      owner: "0xC6CDE7C39eB2f0F0095F41570af89eFC2C1Ea828",
      compound: "0x3f0a0ea2f86bae6362cf9799b523ba06647da018",
    },
    WETH: {
      address: "0xa1c74a9a3e59ffe9bee7b85cd6e91c0751289ebd",
      decimal: 18,
    },
    USDC: {
      address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      decimal: 6,
      compound: "0x4a92e71227d294f041bd82dd8f78591b75140d63",
    },
    AUSDT: {
      address: "0xA01bA9fB493b851F4Ac5093A324CB081A909C34B",
      decimal: 6,
      // owner: "0x81dfbbaF5011e3b86383f72A24793EE44ea547C5"
    },
  },
};

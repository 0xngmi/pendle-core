import { BigNumber as BN, utils } from 'ethers';
const ONE_E_18 = BN.from(10).pow(18);
const RONE = BN.from(2).pow(40);

const common = {
  ONE_E_18,
  FORGE_AAVE_V2: utils.formatBytes32String('AaveV2'),
  MARKET_FACTORY_AAVE: utils.formatBytes32String('Aave'),
  FORGE_COMPOUND: utils.formatBytes32String('Compound'),
  MARKET_FACTORY_COMPOUND: utils.formatBytes32String('Compound'),
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  MAX_ALLOWANCE: BN.from(2).pow(BN.from(256)).sub(BN.from(1)),
  ONE_DAY: BN.from(86400),
  TEST_EXPIRY: 1624147200,
  LIQ_MINING_ALLOCATION_DENOMINATOR: 1000000000,
  HIGH_GAS_OVERRIDE: { gasLimit: 80000000 }
}

export const devConstants = {
  common,
  misc: {
    AAVE_LENDING_POOL_CORE_ADDRESS: '0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3',
    AAVE_LENDING_POOL_ADDRESS: '0x398ec7346dcd622edc5ae82352f02be94c62d119',
    COMPOUND_COMPTROLLER_ADDRESS: '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b',
    AAVE_V2_LENDING_POOL_ADDRESS: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
    LOCK_NUMERATOR: BN.from(1),
    LOCK_DENOMINATOR: BN.from(20),

    // Pendle token distribution
    INVESTOR_AMOUNT: BN.from(36959981).mul(ONE_E_18),
    ADVISOR_AMOUNT: BN.from(2500000).mul(ONE_E_18),
    TEAM_AMOUNT: BN.from(55000000).mul(ONE_E_18),
    TEAM_INVESTOR_ADVISOR_AMOUNT: BN.from(94917125).mul(ONE_E_18),
    ECOSYSTEM_FUND_TOKEN_AMOUNT: BN.from(46 * 10 ** 6).mul(ONE_E_18),
    PUBLIC_SALES_TOKEN_AMOUNT: BN.from(16582875).mul(ONE_E_18),
    INITIAL_LIQUIDITY_EMISSION: BN.from(1200000).mul(ONE_E_18),
    CONFIG_DENOMINATOR: BN.from(72000000000),
    CONFIG_CHANGES_TIME_LOCK: BN.from(7 * 24 * 3600),
    PENDLE_START_TIME: BN.from(4000000000),
    INITIAL_WEEKLY_EMISSION: BN.from(1200000).mul(ONE_E_18),
    ONE_QUARTER: BN.from(7884000),

    INTEREST_UPDATE_RATE_DELTA_FOR_MARKET: BN.from(2).pow(40).mul(277754).div(1e9), // 0.0277754 %

    // OT rewards
    STKAAVE_ADDRESS: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
    COMP_ADDRESS: '0xc00e94cb662c3520282e6f5717214004a7f26888',
    AAVE_INCENTIVES_CONTROLLER: '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',

    // Fee
    FORGE_FEE: RONE.mul(3).div(100), // 3% forge fee
    SWAP_FEE: RONE.mul(35).div(10000), // 0.35%
    PROTOCOL_SWAP_FEE: RONE.div(7), // 1/7 * 0.35% = 0.05%
  },
  tokens: {
    USDT_AAVE: {
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      decimal: 6,
      owner: '0xC6CDE7C39eB2f0F0095F41570af89eFC2C1Ea828',
      compound: '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
    },
    USDT_COMPOUND: {
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      decimal: 6,
      owner: '0xC6CDE7C39eB2f0F0095F41570af89eFC2C1Ea828',
      compound: '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
    },
    WETH: {
      address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      decimal: 18,
      compound: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
    },
    USDC: {
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      decimal: 6,
      compound: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
    },
    AUSDT: {
      address: '0x71fc860F7D3A592A4a98740e39dB31d25db65ae8',
      decimal: 6,
      owner: '0x4188a7dca2757ebc7d9a5bd39134a15b9f3c6402',
    },
  },
};

export const kovanConstants = {
  common,
  misc: {
    ONE_E_18,
    AAVE_LENDING_POOL_CORE_ADDRESS: '0x95D1189Ed88B380E319dF73fF00E479fcc4CFa45',
    AAVE_LENDING_POOL_ADDRESS: '0x580D4Fdc4BF8f9b5ae2fb9225D584fED4AD5375c',
    AAVE_V2_LENDING_POOL_ADDRESS: '0xE0fBa4Fc209b4948668006B2bE61711b7f465bAe',
    COMPOUND_COMPTROLLER_ADDRESS: '0x5eae89dc1c671724a672ff0630122ee834098657',
    LOCK_NUMERATOR: BN.from(1),
    LOCK_DENOMINATOR: BN.from(20),

    // Pendle token distribution
    INVESTOR_AMOUNT: BN.from(37417125).mul(ONE_E_18),
    ADVISOR_AMOUNT: BN.from(2500000).mul(ONE_E_18),
    TEAM_AMOUNT: BN.from(55000000).mul(ONE_E_18),
    TEAM_INVESTOR_ADVISOR_AMOUNT: BN.from(94917125).mul(ONE_E_18),
    ECOSYSTEM_FUND_TOKEN_AMOUNT: BN.from(46 * 10 ** 6).mul(ONE_E_18),
    PUBLIC_SALES_TOKEN_AMOUNT: BN.from(16582875).mul(ONE_E_18),
    INITIAL_LIQUIDITY_EMISSION: BN.from(1200000).mul(ONE_E_18),
    CONFIG_DENOMINATOR: BN.from(72000000000),
    CONFIG_CHANGES_TIME_LOCK: BN.from(7 * 24 * 3600),
    PENDLE_START_TIME: BN.from(4000000000),
    INITIAL_WEEKLY_EMISSION: BN.from(1200000).mul(ONE_E_18),
    ONE_QUARTER: BN.from(7884000),

    LIQ_MINING_ALLOCATION_DENOMINATOR: 1000000000,
    INTEREST_UPDATE_RATE_DELTA_FOR_MARKET: BN.from(2).pow(40).mul(277754).div(1e9),

    // OT rewards
    STKAAVE_ADDRESS: '0xa1c74a9a3e59ffe9bee7b85cd6e91c0751289ebd', //WETH for kovan
    COMP_ADDRESS: '0xa1c74a9a3e59ffe9bee7b85cd6e91c0751289ebd', //WETH for kovan
    AAVE_INCENTIVES_CONTROLLER: '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',

    // Fee
    FORGE_FEE: RONE.mul(3).div(100), // 3% forge fee
    SWAP_FEE: RONE.mul(35).div(10000), // 0.35%
    PROTOCOL_SWAP_FEE: RONE.div(7), // 1/7 * 0.35% = 0.05%
  },
  tokens: {
    USDT_AAVE: {
      address: '0x13512979ade267ab5100878e2e0f485b568328a4',
      decimal: 6,
      owner: '0xC6CDE7C39eB2f0F0095F41570af89eFC2C1Ea828',
      compound: '0x3f0a0ea2f86bae6362cf9799b523ba06647da018',
    },
    USDT_COMPOUND: {
      address: '0x07de306ff27a2b630b1141956844eb1552b956b5',
      decimal: 6,
      owner: '0xC6CDE7C39eB2f0F0095F41570af89eFC2C1Ea828',
      compound: '0x3f0a0ea2f86bae6362cf9799b523ba06647da018',
    },
    WETH: {
      address: '0xa1c74a9a3e59ffe9bee7b85cd6e91c0751289ebd',
      decimal: 18,
      compound: '0x41B5844f4680a8C38fBb695b7F9CFd1F64474a72',
    },
    USDC: {
      address: '0xb7a4f3e9097c08da09517b5ab877f7a917224ede',
      decimal: 6,
      compound: '0x4a92e71227d294f041bd82dd8f78591b75140d63',
    },
    AUSDT: {
      address: '0xff3c8bc103682fa918c954e84f5056ab4dd5189d',
      decimal: 6,
      // owner: "0x81dfbbaF5011e3b86383f72A24793EE44ea547C5"
    },
  },
};

export const goerliConstants = {
  common,
  misc: {
    ONE_E_18,
    ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
    MAX_ALLOWANCE: BN.from(2).pow(BN.from(256)).sub(BN.from(1)),

    // Pendle token distribution
    INVESTOR_AMOUNT: BN.from(37417125).mul(ONE_E_18),
    ADVISOR_AMOUNT: BN.from(2500000).mul(ONE_E_18),
    TEAM_AMOUNT: BN.from(55000000).mul(ONE_E_18),
    TEAM_INVESTOR_ADVISOR_AMOUNT: BN.from(94917125).mul(ONE_E_18),
    ECOSYSTEM_FUND_TOKEN_AMOUNT: BN.from(46 * 10 ** 6).mul(ONE_E_18),
    PUBLIC_SALES_TOKEN_AMOUNT: BN.from(16582875).mul(ONE_E_18),
    ONE_QUARTER: BN.from(7884000),
  },
  tokens: {},
};

export const mainnetConstants = {
  common,
  misc: {
    ONE_E_18,
    ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
    MAX_ALLOWANCE: BN.from(2).pow(BN.from(256)).sub(BN.from(1)),
    // Pendle token distribution
    INVESTOR_AMOUNT: BN.from(37417125).mul(ONE_E_18),
    ADVISOR_AMOUNT: BN.from(2500000).mul(ONE_E_18),
    TEAM_AMOUNT: BN.from(55000000).mul(ONE_E_18),
    TEAM_INVESTOR_ADVISOR_AMOUNT: BN.from(94917125).mul(ONE_E_18),
    ECOSYSTEM_FUND_TOKEN_AMOUNT: BN.from(46 * 10 ** 6).mul(ONE_E_18),
    PUBLIC_SALES_TOKEN_AMOUNT: BN.from(16582875).mul(ONE_E_18),
    ONE_QUARTER: BN.from(7884000),
  },
  tokens: {},
};

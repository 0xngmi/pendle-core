import { BigNumber as BN, utils } from 'ethers';
export type Token = {
  address: string;
  decimal: number;
  compound: string;
  owner?: string;
  source?: string;
};

type TokenMap = Record<string, Token>;

const ONE_E_12 = BN.from(10).pow(12);
const ONE_E_18 = BN.from(10).pow(18);

export const consts = {
  ONE_E_12,
  ONE_E_18,
  DUMMY_ADDRESS: '0xDEADbeEfEEeEEEeEEEeEEeeeeeEeEEeeeeEEEEeE',
  DUMMY_GOVERNANCE_ADDRESS: '0xdac17f958d2ee523a2206206994597c13d831ec7',
  RONE: BN.from(2).pow(40),

  COMPOUND_COMPTROLLER_ADDRESS: '0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b',
  AAVE_V2_LENDING_POOL_ADDRESS: '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9',
  AAVE_DUMMY_REFERRAL_CODE: 0,
  FORGE_AAVE_V2: utils.formatBytes32String('AaveV2'),
  MARKET_FACTORY_AAVE_V2: utils.formatBytes32String('AaveV2'),
  FORGE_COMPOUND: utils.formatBytes32String('Compound'),
  MARKET_FACTORY_COMPOUND: utils.formatBytes32String('Compound'),
  ZERO_BYTES: utils.formatBytes32String(''),
  RANDOM_BYTES: utils.formatBytes32String('ZpTw6Y3Ft4ruk7pmwTJF'),
  ZERO_ADDRESS: '0x0000000000000000000000000000000000000000',
  RANDOM_ADDRESS: '0x0000000000000000000000000000000000000123',
  ETH_ADDRESS: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  INF: BN.from(2).pow(256).sub(1),
  DEFAULT_CHAIN_ID: 31337,
  ONE_HOUR: BN.from(3600),
  ONE_DAY: BN.from(86400),
  ONE_WEEK: BN.from(86400 * 7),
  FIFTEEN_DAY: BN.from(86400 * 15),
  ONE_MONTH: BN.from(2592000),
  THREE_MONTH: BN.from(2592000 * 3),
  FIVE_MONTH: BN.from(2592000 * 5),
  SIX_MONTH: BN.from(2592000 * 6),
  ONE_YEAR: BN.from(31536000),
  T0_A2: BN.from(1623715050), // the time that the first AaveV2_XYT is minted
  T0_C: BN.from(1623715100), // the time that the first Compound_XYT is minted
  HIGH_GAS_OVERRIDE: { gasLimit: 80000000 },
  LOW_GAS_OVERRIDE: { gasLimit: 200000 },
  INITIAL_AAVE_USDT_AMOUNT: BN.from(10 ** 5),
  INITIAL_COMPOUND_USDT_AMOUNT: BN.from(10 ** 7),
  INITIAL_AAVE_TOKEN_AMOUNT: BN.from(10 ** 4),
  INITIAL_COMPOUND_TOKEN_AMOUNT: BN.from(10 ** 6),
  INITIAL_OT_XYT_AMOUNT: BN.from(10 ** 4),
  TEST_TOKEN_DELTA: BN.from(10).pow(2),
  LOCK_NUMERATOR: BN.from(1),
  LOCK_DENOMINATOR: BN.from(180),
  INTEREST_UPDATE_RATE_DELTA_FOR_MARKET: BN.from(2).pow(40).div(10000), // 0.01% delta

  // Pendle token distribution
  INVESTOR_AMOUNT: BN.from(37417125).mul(ONE_E_18),
  ADVISOR_AMOUNT: BN.from(2500000).mul(ONE_E_18),
  TEAM_AMOUNT: BN.from(55000000).mul(ONE_E_18),
  TEAM_INVESTOR_ADVISOR_AMOUNT: BN.from(94917125).mul(ONE_E_18),
  ECOSYSTEM_FUND_TOKEN_AMOUNT: BN.from(46 * 1000000).mul(ONE_E_18),
  PUBLIC_SALES_TOKEN_AMOUNT: BN.from(16582875).mul(ONE_E_18),
  INITIAL_LIQUIDITY_EMISSION: BN.from(1200000).mul(ONE_E_18),
  CONFIG_DENOMINATOR: BN.from(72000000000),
  CONFIG_CHANGES_TIME_LOCK: BN.from(7 * 24 * 3600),
  PENDLE_START_TIME: BN.from(4000000000),
  INITIAL_WEEKLY_EMISSION: BN.from(1200000).mul(ONE_E_18),
  ONE_QUARTER: BN.from(7884000),

  // COMP/StkAAVE rewards related
  STKAAVE_ADDRESS: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
  COMP_ADDRESS: '0xc00e94cb662c3520282e6f5717214004a7f26888',
  AAVE_INCENTIVES_CONTROLLER: '0xd784927Ff2f95ba542BfC824c8a8a98F3495f6b5',
  COMP_ETH: '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
};

// export function setT0(time: BN) {
//   consts.T0 = time;
// }

export const tokens: TokenMap = {
  USDT: {
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    decimal: 6,
    compound: '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9',
    owner: '0xC6CDE7C39eB2f0F0095F41570af89eFC2C1Ea828',
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
  UNI: {
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    decimal: 18,
    compound: '0x35a18000230da775cac24873d00ff85bccded550',
    source: '0x47173b170c64d16393a52e6c480b3ad8c302ba1e',
  },
};

const prefix = 'VM Exception while processing transaction: revert';
export const errMsg = {
  NEGATIVE_ALLOWANCE: prefix + ' ' + 'NEGATIVE_ALLOWANCE',
  BURN_EXCEED_BALANCE: prefix + ' ' + 'BURN_EXCEED_BALANCE',
  TRANSFER_EXCEED_BALANCE: prefix + ' ' + 'TRANSFER_EXCEED_BALANCE',
  TRANSFER_EXCEED_ALLOWANCE: prefix + ' ' + 'TRANSFER_EXCEED_ALLOWANCE',
  BURN_FROM_ZERO_ADDR: prefix + ' ' + 'BURN_FROM_ZERO_ADDR',
  MINT_TO_ZERO_ADDR: prefix + ' ' + 'MINT_TO_ZERO_ADDR',
  SPENDER_ZERO_ADDR: prefix + ' ' + 'SPENDER_ZERO_ADDR',
  SENDER_ZERO_ADDR: prefix + ' ' + 'SENDER_ZERO_ADDR',
  RECEIVER_ZERO_ADDR: prefix + ' ' + 'RECEIVER_ZERO_ADDR',
  OWNER_ZERO_ADDR: prefix + ' ' + 'OWNER_ZERO_ADDR',
  MARKET_LOCKED: prefix + ' ' + 'MARKET_LOCKED',
  INVALID_EXPIRY: prefix + ' ' + 'INVALID_EXPIRY',
  YIELD_CONTRACT_EXPIRED: prefix + ' ' + 'YIELD_CONTRACT_EXPIRED',
  INVALID_AMOUNTS: prefix + ' ' + 'INVALID_AMOUNTS',
  INVALID_ALLOCATION: prefix + ' ' + 'INVALID_ALLOCATION',
  INVALID_ID: prefix + ' ' + 'INVALID_ID',
  EXISTED_ID: prefix + ' ' + 'EXISTED_ID',
  INVALID_UNDERLYING_ASSET: prefix + ' ' + 'INVALID_UNDERLYING_ASSET',
  FORGE_NOT_EXISTS: prefix + ' ' + 'FORGE_NOT_EXISTS',
  DUPLICATE_YIELD_CONTRACT: prefix + ' ' + 'DUPLICATE_YIELD_CONTRACT',
  FORBIDDEN: prefix + ' ' + 'FORBIDDEN',
  ZERO_AMOUNT: prefix + ' ' + 'ZERO_AMOUNT',
  INVALID_XYT: prefix + ' ' + 'INVALID_XYT',
  INVALID_RENEWAL_RATE: prefix + ' ' + 'INVALID_RENEWAL_RATE',
  INVALID_FACTORY_ID: prefix + ' ' + 'INVALID_FACTORY_ID',
  MUST_BE_AFTER_EXPIRY: prefix + ' ' + 'MUST_BE_AFTER_EXPIRY',
  INVALID_SIGNATURE: prefix + ' ' + 'INVALID_SIGNATURE',
  ONLY_ROUTER: prefix + ' ' + 'ONLY_ROUTER',
  ONLY_GOVERNANCE: prefix + ' ' + 'ONLY_GOVERNANCE',
  YIELD_CONTRACT_PAUSED: prefix + ' ' + 'YIELD_CONTRACT_PAUSED',
  MARKET_PAUSED: prefix + ' ' + 'MARKET_PAUSED',
  PERMANENTLY_LOCKED: prefix + ' ' + 'PERMANENTLY_LOCKED',
  FORGE_HANDLER_LOCKED: prefix + ' ' + 'FORGE_HANDLER_LOCKED',
  MARKET_HANDLER_LOCKED: prefix + ' ' + 'MARKET_HANDLER_LOCKED',
  REDUNDANT_SET: prefix + ' ' + 'REDUNDANT_SET',
  TOKEN_NOT_ALLOWED: prefix + ' ' + 'TOKEN_NOT_ALLOWED',
  XYT_BALANCE_ERROR: prefix + ' ' + 'XYT_BALANCE_ERROR',
  TOKEN_BALANCE_ERROR: prefix + ' ' + 'TOKEN_BALANCE_ERROR',
};

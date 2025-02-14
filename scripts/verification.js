require('@nomiclabs/hardhat-ethers');
const { utils } = require('ethers');

const consts = {
  contracts: {
    PendleTeamTokens: {
      address: '0x8849d0d4c35679aA78Df1b5B4CecA358d57635dF',
      tx: '0x320c8c5e78728736db307253996dd62489b78e1a10e1f8cd429b37237da5475d',
    },
    PendleEcosystemFund: {
      address: '0xc21A74c7150fed22C7CA0Bf9A15BBe0DdB4977CC',
      tx: '0x255eceb20589efb04ec992a8b30d7d950c975b3a2c4130a343adfc77d58719f7',
    },
    PENDLE: {
      address: '0x808507121B80c02388fAd14726482e061B8da827',
      tx: '0x0bacdfc256704f5f8b153d238bb185d42826f148370b91ce4adc46f55f5905b7',
    },
    PendleGovernanceManagerMain: {
      address: '0x9b528BF0639fC31Ae6D698c48D830873227741F1',
      tx: '0x1e62fdc8b5f5c8e5991ad442af8e253c3aaf5e665ca8e1dc4d12d10f0f769f6c',
    },
    PendleGovernanceManagerLiqMining: {
      address: '0x5a05a64115bd86f220a26461fDe3A011c7142476',
      tx: '0x96fe72cd67472516bd9fe09938926e4dece015b4b5619f2b9220badfc3ffc13b',
    },
    PendlePausingManagerMain: {
      address: '0x0EF44218209D7d64737dD36f179d5e448df3EEd4',
      tx: '0xaa6725ec98b10feab4b631846a5a3bea3c8fe62d3d332214c1fd3a0a9f3362ce',
    },
    PendlePausingManagerLiqMining: {
      address: '0xea2575F82C881b223208FA53982e6e09aB55CcDa',
      tx: '0xf40d3d9ca4281d6773b637cc7addff88cc7a77c47d1078a89a056cd6ae53a7e5',
    },
    PendleData: {
      address: '0xE8A6916576832AA5504092C1cCCC46E3bB9491d6',
      tx: '0x0d290009c69a66f13eb678d1ec732fa3db97f629c6294f7ed814ed74d6caf832',
    },
    PendleMarketReader: {
      address: '0x16b4AD69d414a197F9Cb98d06dB224646dc7CDc7',
      tx: '0x8b52c927a8133b0cb0608868d2928bcb7f809f18912dda88d370032494cd4960',
    },
    PendleRouter: {
      address: '0x1b6d3E5Da9004668E14Ca39d1553E9a46Fe842B3',
      tx: '0xdf867c0bc3d65737a8da2f58da6d51c11fda09cf717318ea9c81194228e2956e',
    },
    PendleRedeemProxy: {
      address: '0x3f83805D7d2A6b7BF35E5c3131D684d914B98472',
      tx: '0x36aa59ec8404dec803586798d45b96e934d0b11ed879f50094c7328233f731fd',
    },
    PendleWhitelist: {
      address: '0x6fa13469428e85E6aC12c84B73A19aeF7c53332A',
      tx: '0xe90abffa34cc5bdc1b0aa87302d270e0cb5b21f0ba8b8ddf36efe29800e3344b',
    },
    PendleRewardManagerCompound: {
      address: '0x8eE287Ff230c979Be9D829f74d6D42B5a47Ca3F8',
      tx: '0xae2a582765d6c4dfa4ba71aae269132845af7c55a087412ef1f10c3d5318e6af',
    },
    PendleCompoundYieldContractDeployer: {
      address: '0x619e82186273F1F81D172972e964FBD2ad0EC8bb',
      tx: '0x206c65d4ec2acf3a90cfdb357f8e15fbbd19ee7f28e9243b9c39c5fea57ecfc0',
    },
    PendleCompoundForge: {
      address: '0x149001FEd7EDC44c5A7aE7e4281Ad64aF7A02f01',
      tx: '0xcb3e9ec186daed5ab3095dbc13d54fa843c4574ccc79921fa42282b069b7cbac',
    },
    PendleCompoundMarketFactory: {
      address: '0x0f8e3237d074ce8a59aF5D0d476BCd5B85aEFe09',
      tx: '0x2b61a12e9489c668dddf6f8373a2351588ec03441083ca7a56d6f24b5eeabf87',
    },
    PendleRewardManagerAaveV2: {
      address: '0xC93471fBC686bc0Aa5Fd102ad706ec180061461a',
      tx: '0x4be7816ebebcec46033bee007e405c5b506b5888eba54b4da40c393a6db1e219',
    },
    PendleAaveV2YieldContractDeployer: {
      address: '0x2Ae9bCDF80871F5BA4bd591Bb07eB690951B3b93',
      tx: '0x7c37a25d7e9e21211ac195761b2be37beb4c6bfa6c1be91854797ea3cb9fbb87',
    },
    PendleAaveV2Forge: {
      address: '0x9902475a6Ffc0377b034Bf469EE0879f3Bd273FB',
      tx: '0x156f87bd05cf334a1aa4b001ae370c9e4e044ebe5a908311412e6bf7a403a0f2',
    },
    PendleAaveMarketFactory: {
      address: '0x753aE83C85daC24A91eF31D60B8400dDbCd53d62',
      tx: '0x7093e632ff44c27e29b5a437219656f436335ca5568be3443f2fadc0c88d1bdc',
    },
    PendleAaveLiquidityMining: {
      address: '0xa133Fe86202e5DA288Ee0748fc68Ca1faf69d062',
      tx: '0x84fcc5a0a39ed48174a1fe842a8880dd278e1b21206451f36b3bac574eea9cca',
    },
    PendleCompoundLiquidityMining: {
      address: '0x7CCD8260fAF81Bf402bf3162736A31F3ca27F2D5',
      tx: '0x942d255ad9d2f09f0d96234f5032ebdf8297969df4e9033477e2e02def9cf26d',
    },
  },
  variables: {
    GOVERNANCE_MULTISIG: '0x8119EC16F0573B7dAc7C0CB94EB504FB32456ee1',
    TEAM_TOKENS_MULTISIG: '0x918cF6b16D1426B5aA0Edf0492ced1Aa89f9659A',
    ECOSYSTEM_FUND_MULTISIG: '0x399Be606db281a054E359Eb709df9F21E922eC9a',
    SALES_MULTISIG: '0x9B26AFff63E4139cb5a3Ea9955903ffffcC1D79b',
    LIQUIDITY_INCENTIVES_MULTISIG: '0xe8D28E2CA24BB16Fc7e6549eF937e05981d02606',
    FORGE_EMERGENCY_HANDLER: '0x8119EC16F0573B7dAc7C0CB94EB504FB32456ee1',
    MARKET_EMERGENCY_HANDLER: '0x8119EC16F0573B7dAc7C0CB94EB504FB32456ee1',
    LIQ_MINING_EMERGENCY_HANDLER: '0x8119EC16F0573B7dAc7C0CB94EB504FB32456ee1',
    TREASURY_MULTISIG: '0x8270400d528c34e1596EF367eeDEc99080A1b592',
  },
  yieldContracts: {
    AaveV2: {
      USDC: {
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        expiries: {
          1672272000: {
            XYT: '0xcDb5b940E95C8632dEcDc806B90dD3fC44E699fE',
            OT: '0x8fcb1783bF4b71A51F702aF0c266729C4592204a',
            markets: {
              USDC: '0x8315BcBC2c5C1Ef09B71731ab3827b0808A2D6bD',
            },
          },
        },
        PendleLiquidityMining: {
          USDC: '0xa133Fe86202e5DA288Ee0748fc68Ca1faf69d062',
        },
      },
    },
    Compound: {
      DAI: {
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
        expiries: {
          1672272000: {
            XYT: '0x4ff131D2E5808A413Da7057690c20761343349bD',
            OT: '0x8F0a6CEBcc41b4D101071E7B00A2028E86c5C297',
            markets: {
              USDC: '0x73A62De3B35126AE8f6a4547b9cbc170bC852001',
            },
          },
        },
        PendleLiquidityMining: {
          USDC: '0x7CCD8260fAF81Bf402bf3162736A31F3ca27F2D5',
        },
      },
    },
  },
};

task('verifyPendle', 'verify Pendle contracts').setAction(async () => {
  const deployer = '0x196e6d50df6289e1F82838E84774b2B0c8f4aF62';
  const ct = consts.contracts;
  const vars = consts.variables;
  const weth = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

  console.log('Verifying Contracts');
  console.log('============================\n');

  // PendleCompoundYieldContractDeployer
  await hre.run('verify:verify', {
    address: ct.PendleCompoundYieldContractDeployer.address,
    constructorArguments: [ct.PendleGovernanceManagerMain.address, utils.formatBytes32String('Compound')],
  });
  console.log(
    `Verified PendleCompoundYieldContractDeployer: ${consts.contracts.PendleCompoundYieldContractDeployer.address}\n\n`
  );

  // PendleAaveLiquidityMining
  await hre.run('verify:verify', {
    address: ct.PendleAaveLiquidityMining.address,
    constructorArguments: [
      ct.PendleGovernanceManagerLiqMining.address,
      ct.PendlePausingManagerLiqMining.address,
      ct.PendleWhitelist.address,
      ct.PENDLE.address,
      ct.PendleRouter.address,
      utils.formatBytes32String('Aave'),
      utils.formatBytes32String('AaveV2'),
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      '1623888000',
      '604800',
      '5',
    ],
  });
  console.log(`Verified PendleAaveLiquidityMining: ${consts.contracts.PendleAaveLiquidityMining.address}\n\n`);

  // PendleCompoundLiquidityMining
  await hre.run('verify:verify', {
    address: ct.PendleCompoundLiquidityMining.address,
    constructorArguments: [
      ct.PendleGovernanceManagerLiqMining.address,
      ct.PendlePausingManagerLiqMining.address,
      ct.PendleWhitelist.address,
      ct.PENDLE.address,
      ct.PendleRouter.address,
      utils.formatBytes32String('Compound'),
      utils.formatBytes32String('Compound'),
      '0x6b175474e89094c44da98b954eedeac495271d0f',
      '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
      '1623888000',
      '604800',
      '5',
    ],
  });
  console.log(`Verified PendleCompoundLiquidityMining: ${consts.contracts.PendleCompoundLiquidityMining.address}\n\n`);
});

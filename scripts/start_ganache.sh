usdt_owner="0xC6CDE7C39eB2f0F0095F41570af89eFC2C1Ea828"
ausdt_owner="0x81dfbbaF5011e3b86383f72A24793EE44ea547C5"
some_other_address="0x000DE7C39eB2f0F0095F41570af89eFC2C1Ea000"
addresses=$usdt_owner
INFURA_KEY="3957a20fa69440ffbcc33e24ea4f35ec"

command="./node_modules/.bin/ganache-cli --fork https://mainnet.infura.io/v3/$INFURA_KEY --secure --unlock $addresses --unlock $ausdt_owner -u 0 -u 1 -u 2 --networkId 1 --gasLimit 12500000"
echo "Running $command"
$command

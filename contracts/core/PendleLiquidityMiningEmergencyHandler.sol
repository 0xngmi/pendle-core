// SPDX-License-Identifier: MIT
/*
 * MIT License
 * ===========
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */
pragma solidity 0.7.6;
pragma abicoder v2;

import "../periphery/PermissionsV2.sol";
import "../interfaces/IPendleMarket.sol";
import "../interfaces/IPendleLiquidityMining.sol";
import "../interfaces/IPendleLpHolder.sol";
import "../interfaces/IPendlePausingManager.sol";
import "../interfaces/IPendleForge.sol";
import "../libraries/MathLib.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract PendleLiquidityMiningEmergencyHandler is PermissionsV2 {
    using Math for uint256;
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // mapping(liq => expiry => user => bool)
    mapping(address => mapping(uint256 => mapping(address => bool))) public haveWithdrawn;
    IPendlePausingManager public immutable pausingManager;

    modifier oneTimeWithdrawal(address _liqAddr, uint256 _expiry) {
        require(!haveWithdrawn[_liqAddr][_expiry][msg.sender], "NOTHING_TO_WITHDRAW");
        _;
        haveWithdrawn[_liqAddr][_expiry][msg.sender] = true;
    }

    constructor(address _governanceManager, address _pausingManager)
        PermissionsV2(_governanceManager)
    {
        require(_pausingManager != address(0), "ZERO_ADDRESS");
        pausingManager = IPendlePausingManager(_pausingManager);
    }

    function setUpEmergencyMode(address _liqAddr, uint256[] calldata expiries)
        public
        onlyGovernance
    {
        IPendleLiquidityMining liq = IPendleLiquidityMining(_liqAddr);
        liq.setUpEmergencyMode(expiries, address(this));
    }

    // TODO: Should this function be a batch function?
    function withdraw(address _liqAddr, uint256 _expiry)
        public
        oneTimeWithdrawal(_liqAddr, _expiry)
    {
        IPendleLiquidityMining liq = IPendleLiquidityMining(_liqAddr);
        IPendleLpHolder lpHolder = IPendleLpHolder(liq.lpHolderForExpiry(_expiry));
        IERC20 lpToken = IERC20(lpHolder.pendleMarket());
        IERC20 underlyingYieldToken = IERC20(lpHolder.underlyingYieldToken());

        uint256 amountLpOut = liq.getBalances(_expiry, msg.sender);
        lpToken.transferFrom(address(lpHolder), msg.sender, amountLpOut);

        uint256 lpProportion = amountLpOut.rdiv(lpToken.balanceOf(address(lpHolder)));
        uint256 amountYieldTokenOut =
            lpProportion.rmul(underlyingYieldToken.balanceOf(address(lpHolder)));
        underlyingYieldToken.transferFrom(address(lpHolder), msg.sender, amountYieldTokenOut);
    }
}

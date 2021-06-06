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
import "../interfaces/IPendlePausingManager.sol";
import "../interfaces/IPendleForge.sol";
import "../interfaces/IPendleData.sol";
import "../interfaces/IPendleYieldTokenHolder.sol";
import "../libraries/MathLib.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

contract PendleForgeEmergencyHandler is PermissionsV2 {
    using Math for uint256;
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    mapping(address => mapping(address => mapping(uint256 => mapping(address => bool))))
        public haveWithdrawn;
    IPendlePausingManager public immutable pausingManager;
    IPendleData public immutable data;

    modifier oneTimeWithdrawal(
        address _forgeAddr,
        address _underlyingAsset,
        uint256 _expiry
    ) {
        require(
            !haveWithdrawn[_forgeAddr][_underlyingAsset][_expiry][msg.sender],
            "NOTHING_TO_WITHDRAW"
        );
        _;
        haveWithdrawn[_forgeAddr][_underlyingAsset][_expiry][msg.sender] = true;
    }

    constructor(
        address _governanceManager,
        address _pausingManager,
        address _data
    ) PermissionsV2(_governanceManager) {
        require(_pausingManager != address(0), "ZERO_ADDRESS");
        pausingManager = IPendlePausingManager(_pausingManager);
        data = IPendleData(_data);
    }

    function setUpEmergencyMode(
        address _forgeAddr,
        address _underlyingAsset,
        uint256 _expiry
    ) public onlyGovernance {
        IPendleForge forge = IPendleForge(_forgeAddr);
        forge.setUpEmergencyMode(_underlyingAsset, _expiry, address(this));
    }

    // TODO: Should this function be a batch function?
    function withdraw(
        address _forgeAddr,
        address _underlyingAsset,
        uint256 _expiry
    ) public oneTimeWithdrawal(_forgeAddr, _underlyingAsset, _expiry) {
        IPendleForge forge = IPendleForge(_forgeAddr);
        IPendleYieldTokenHolder yieldTokenHolder =
            IPendleYieldTokenHolder(forge.yieldTokenHolders(_underlyingAsset, _expiry));
        IPendleYieldToken ot =
            data.otTokens(forge.forgeId(), forge.getYieldBearingToken(_underlyingAsset), _expiry);

        IERC20 underlyingYieldToken = IERC20(yieldTokenHolder.yieldToken());
        IERC20 rewardToken = IERC20(yieldTokenHolder.rewardToken());

        uint256 amountOtUser = ot.balanceOf(msg.sender);
        uint256 otProportion = amountOtUser.rdiv(ot.totalSupply());

        uint256 amountYieldTokenOut =
            otProportion.rmul(underlyingYieldToken.balanceOf(address(yieldTokenHolder)));
        underlyingYieldToken.transferFrom(
            address(yieldTokenHolder),
            msg.sender,
            amountYieldTokenOut
        );

        uint256 amountRewardOut =
            otProportion.rmul(rewardToken.balanceOf(address(yieldTokenHolder)));
        rewardToken.transferFrom(address(yieldTokenHolder), msg.sender, amountRewardOut);
    }
}

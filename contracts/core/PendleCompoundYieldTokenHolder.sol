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

import "./abstract/PendleYieldTokenHolderBase.sol";
import "../interfaces/IComptroller.sol";

contract PendleCompoundYieldTokenHolder is PendleYieldTokenHolderBase {
    IComptroller private comptroller;

    constructor(
        address _forge,
        address _router,
        address _yieldToken,
        address _rewardToken,
        address _rewardManager,
        address _comptroller
    ) PendleYieldTokenHolderBase(_forge, _router, _yieldToken, _rewardToken, _rewardManager) {
        require(_comptroller != address(0), "ZERO_ADDRESS");
        comptroller = IComptroller(_comptroller);
    }

    // TODO: skip redeemRewards if the incentive programme has already ended?
    function redeemRewards() external override {
        address[] memory cTokens = new address[](1);
        address[] memory holders = new address[](1);
        cTokens[0] = yieldToken;
        holders[0] = address(this);
        comptroller.claimComp(holders, cTokens, false, true);
    }
}

/* solhint-disable ordering*/
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

import "./IPendleRouter.sol";
import "./IPendleYieldToken.sol";

interface IPendleData {
    /**
     * @notice Emitted when validity of a forge-factory pair is updated
     * @param _forgeId the forge id
     * @param _marketFactoryId the market factory id
     * @param _valid valid or not
     **/
    event ForgeFactoryValiditySet(bytes32 _forgeId, bytes32 _marketFactoryId, bool _valid);

    /**
     * @notice Emitted when Pendle and PendleFactory addresses have been updated.
     * @param treasury The address of the new treasury contract.
     **/
    event TreasurySet(address treasury);

    /**
     * @notice Emitted when LockParams is changed
     **/
    event LockParamsSet(uint256 lockNumerator, uint256 lockDenominator);

    /**
     * @notice Emitted when ExpiryDivisor is changed
     **/
    event ExpiryDivisorSet(uint256 expiryDivisor);

    /**
     * @notice Emitted when interestUpdateTimeDelta is changed
     * @param interestUpdateTimeDelta new interestUpdateTimeDelta setting
     **/
    event InterestUpdateTimeDeltaSet(uint256 interestUpdateTimeDelta);

    /**
     * @notice Emitted when interestUpdateRateDelta is changed
     * @param interestUpdateRateDelta new interestUpdateRateDelta setting
     **/
    event InterestUpdateRateDeltaSet(uint256 interestUpdateRateDelta);

    event ReentrancyWhitelistUpdated(address[] addresses, bool[] whitelisted);

    /**
     * @notice Set/update validity of a forge-factory pair
     * @param _forgeId the forge id
     * @param _marketFactoryId the market factory id
     * @param _valid valid or not
     **/
    function setForgeFactoryValidity(
        bytes32 _forgeId,
        bytes32 _marketFactoryId,
        bool _valid
    ) external;

    /**
     * @notice Sets the PendleTreasury contract addresses.
     * @param newTreasury Address of new treasury contract.
     **/
    function setTreasury(address newTreasury) external;

    /**
     * @notice Gets a reference to the PendleRouter contract.
     * @return Returns the router contract reference.
     **/
    function router() external view returns (IPendleRouter);

    /**
     * @notice Gets the treasury contract address where fees are being sent to.
     * @return Address of the treasury contract.
     **/
    function treasury() external view returns (address);

    /***********
     *  FORGE  *
     ***********/

    /**
     * @notice Emitted when a forge for a protocol is added.
     * @param forgeId Forge and protocol identifier.
     * @param forgeAddress The address of the added forge.
     **/
    event ForgeAdded(bytes32 indexed forgeId, address indexed forgeAddress);

    /**
     * @notice Adds a new forge for a protocol.
     * @param forgeId Forge and protocol identifier.
     * @param forgeAddress The address of the added forge.
     **/
    function addForge(bytes32 forgeId, address forgeAddress) external;

    /**
     * @notice Store new OT and XYT details.
     * @param forgeId Forge and protocol identifier.
     * @param ot The address of the new XYT.
     * @param xyt The address of the new XYT.
     * @param underlyingAsset Token address of the underlying asset.
     * @param expiry Yield contract expiry in epoch time.
     **/
    function storeTokens(
        bytes32 forgeId,
        address ot,
        address xyt,
        address underlyingAsset,
        uint256 expiry
    ) external;

    /**
     * @notice Gets the OT and XYT tokens.
     * @param forgeId Forge and protocol identifier.
     * @param underlyingYieldToken Token address of the underlying yield token.
     * @param expiry Yield contract expiry in epoch time.
     * @return ot The OT token references.
     * @return xyt The XYT token references.
     **/
    function getPendleYieldTokens(
        bytes32 forgeId,
        address underlyingYieldToken,
        uint256 expiry
    ) external view returns (IPendleYieldToken ot, IPendleYieldToken xyt);

    /**
     * @notice Gets the identifier of the forge.
     * @param forgeAddress The forge's address.
     * @return forgeId Returns the forge identifier.
     **/
    function getForgeId(address forgeAddress) external view returns (bytes32 forgeId);

    /**
     * @notice Gets a forge given the identifier.
     * @param forgeId Forge and protocol identifier.
     * @return forgeAddress Returns the forge address.
     **/
    function getForgeAddress(bytes32 forgeId) external view returns (address forgeAddress);

    /**
     * @notice Checks if an XYT token is valid.
     * @param forgeAddress The address of the added forge.
     * @param underlyingAsset Token address of the underlying asset.
     * @param expiry Yield contract expiry in epoch time.
     * @return True if valid, false otherwise.
     **/
    function isValidXYT(
        address forgeAddress,
        address underlyingAsset,
        uint256 expiry
    ) external view returns (bool);

    /**
     * @notice Checks if an XYT token is valid.
     * @param forgeId The forgeId of the forge.
     * @param underlyingAsset Token address of the underlying asset.
     * @param expiry Yield contract expiry in epoch time.
     * @return True if valid, false otherwise.
     **/
    function isValidXYT(
        bytes32 forgeId,
        address underlyingAsset,
        uint256 expiry
    ) external view returns (bool);

    function validForgeFactoryPair(bytes32 _forgeId, bytes32 _marketFactoryId)
        external
        view
        returns (bool);

    /**
     * @notice Gets a reference to a specific OT.
     * @param forgeId Forge and protocol identifier.
     * @param underlyingYieldToken Token address of the underlying yield token.
     * @param expiry Yield contract expiry in epoch time.
     * @return ot Returns the reference to an OT.
     **/
    function otTokens(
        bytes32 forgeId,
        address underlyingYieldToken,
        uint256 expiry
    ) external view returns (IPendleYieldToken ot);

    /**
     * @notice Gets a reference to a specific XYT.
     * @param forgeId Forge and protocol identifier.
     * @param underlyingAsset Token address of the underlying asset
     * @param expiry Yield contract expiry in epoch time.
     * @return xyt Returns the reference to an XYT.
     **/
    function xytTokens(
        bytes32 forgeId,
        address underlyingAsset,
        uint256 expiry
    ) external view returns (IPendleYieldToken xyt);

    /***********
     *  MARKET *
     ***********/

    event MarketPairAdded(address indexed market, address indexed xyt, address indexed token);

    function addMarketFactory(bytes32 marketFactoryId, address marketFactoryAddress) external;

    function isMarket(address _addr) external view returns (bool result);

    function isXyt(address _addr) external view returns (bool result);

    function addMarket(
        bytes32 marketFactoryId,
        address xyt,
        address token,
        address market
    ) external;

    function setMarketFees(uint256 _swapFee, uint256 _exitFee) external;

    function setInterestUpdateTimeDelta(uint256 _interestUpdateTimeDelta) external;

    function setInterestUpdateRateDelta(uint256 _interestUpdateTimeDelta) external;

    function setLockParams(uint256 _lockNumerator, uint256 _lockDenominator) external;

    function setExpiryDivisor(uint256 _expiryDivisor) external;

    function setReentrancyWhitelist(address[] calldata addresses, bool[] calldata whitelisted)
        external;

    /**
     * @notice Displays the number of markets currently existing.
     * @return Returns markets length,
     **/
    function allMarketsLength() external view returns (uint256);

    function exitFee() external view returns (uint256);

    function interestUpdateTimeDelta() external view returns (uint256);

    function interestUpdateRateDelta() external view returns (uint256);

    function expiryDivisor() external view returns (uint256);

    function lockNumerator() external view returns (uint256);

    function lockDenominator() external view returns (uint256);

    function swapFee() external view returns (uint256);

    function reentrancyWhitelisted(address a) external view returns (bool);

    /**
     * @notice Gets all the markets.
     * @return Returns an array of all markets.
     **/
    function getAllMarkets() external view returns (address[] calldata);

    /**
     * @notice Gets a market given a future yield token and an ERC20 token.
     * @param xyt Token address of the future yield token as base asset.
     * @param token Token address of an ERC20 token as quote asset.
     * @return market Returns the market address.
     **/
    function getMarket(
        bytes32 marketFactoryId,
        address xyt,
        address token
    ) external view returns (address market);

    /**
     * @notice Gets the identifier of the market factory.
     * @param marketFactoryAddress The factory's address.
     * @return marketFactoryId Returns the factory identifier.
     **/
    function getMarketFactoryId(address marketFactoryAddress)
        external
        view
        returns (bytes32 marketFactoryId);

    /**
     * @notice Gets a market factory given the identifier.
     * @param marketFactoryId MarketFactory identifier.
     * @return marketFactoryAddress Returns the factory address.
     **/
    function getMarketFactoryAddress(bytes32 marketFactoryId)
        external
        view
        returns (address marketFactoryAddress);

    function getMarketFromKey(
        address xyt,
        address token,
        bytes32 marketFactoryId
    ) external view returns (address market);
}

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
pragma experimental ABIEncoderV2;

import "../core/PendleRouter.sol";

contract GasTesting {
    mapping(uint256 => uint256) test256;
    mapping(uint256 => uint128) test128;
    mapping(uint32 => uint32) test32;

    uint256 test256_number0;
    uint256 test256_number1;
    uint256 test256_number2;
    uint256 test256_number3;
    uint256 test256_number4;
    uint256 test256_number5;
    uint256 test256_number6;
    uint256 test256_number7;
    uint256 test256_number8;
    uint256 test256_number9;
    uint256 test256_number10;

    function change256_mapping(uint256 times) public {
        for (uint256 i = 0; i < times; i++) {
            test256[i] = block.timestamp+i;
        }
    }

    function change128_mapping(uint256 times) public {
        for (uint256 i = 0; i < times; i++) {
            test128[i] = uint128(block.timestamp+i);
        }
    }

    function change32_mapping(uint256 times) public {
        for (uint32 i = 0; i < times; i++) {
            test32[i] = uint32(block.timestamp)+i;
        }
    }

    function change256_vars(uint256 times) public {
        for (uint256 i = 0; i < times; i++) {
            if (i==0) {
                test256_number0 = block.timestamp;
            } else if (i==1) {
                test256_number1 = block.timestamp;
            } else if (i==2) {
                test256_number2 = block.timestamp;
            } else if (i==3) {
                test256_number3 = block.timestamp;
            } else if (i==4) {
                test256_number4 = block.timestamp;
            } else if (i==5) {
                test256_number5 = block.timestamp;
            } else if (i==6) {
                test256_number6 = block.timestamp;
            } else if (i==7) {
                test256_number7 = block.timestamp;
            } else if (i==8) {
                test256_number8 = block.timestamp;
            } else if (i==9) {
                test256_number9 = block.timestamp;
            }
        }
    }
}

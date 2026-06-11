// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.33;

contract Utils {
    constructor() { }

    /**
     * @param x_ number to get the abs value
     * @return absolute value of a number
     */
    function abs(int256 x_) public pure returns (uint256) {
        require(x_ != type(int256).min, "Overflow!");
        return x_ >= 0 ? uint256(x_) : uint256(-x_);
    }

    /**
     * @return True if the array is sorted in ascending order, false otherwise
     * @param array_ array to sort
     */
    function isSorted(int256[] memory array_) public pure returns (bool) {
        for (uint256 i = 0; i < array_.length - 1; i++) {
            if (array_[i] > array_[i + 1]) return false;
        }
        return true;
    }

    /**
     * @return True if the array is sorted in descending order, false otherwise
     * @param array_ array to check
     */
    function isSortedDesc(int256[] memory array_) public pure returns (bool) {
        for (uint256 i = 0; i < array_.length - 1; i++) {
            if (array_[i] < array_[i + 1]) return false;
        }
        return true;
    }
}

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "hardhat/console.sol";

contract MultiSig {
    struct Transaction {
        address destination;
        uint value;
        bool executed;
        bytes data;
    }

    /* Variables */

    address[] public owners;
    uint256 public required;
    uint256 public transactionCount;

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    /* Events */

    event NewOwnerAdded(address newOwner);
    event TransactionConfirmed(uint index);
    event TransactionSent(address destination, uint value, bytes data);

    /* Functions */

    constructor(address[] memory _owners, uint256 _required) payable {
        require(_owners.length > 0, "There must be at least one owner");
        require(
            _required > 0,
            "The amount of required owners must be at least one"
        );
        require(_owners.length >= _required, "You need more owners");
        owners = _owners;
        required = _required;
    }

    function addTransaction(
        address destination,
        uint256 value,
        bytes memory data
    ) internal returns (uint256) {
        uint transactionId = transactionCount;
        transactions[transactionCount] = Transaction(
            destination,
            value,
            false,
            data
        );
        transactionCount++;
        return transactionId;
    }

    function isOwner() public view returns (bool) {
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function isAnOwner(address signer) public view returns (bool) {
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == signer) {
                return true;
            }
        }
        return false;
    }

    function confirmTransaction(uint transactionId) public {
        require(isOwner(), "Only owner can confirm a transaction");
        confirmations[transactionId][msg.sender] = true;
        if (isConfirmed(transactionId)) {
            executeTransaction(transactionId);
        }
        emit TransactionConfirmed(transactionId);
    }

    function isConfirmed(uint transactionId) public view returns (bool) {
        uint confirmationCount = getConfirmationsCount(transactionId);
        if (confirmationCount >= required) {
            return true;
        } else {
            return false;
        }
    }

    function getConfirmationsCount(
        uint transactionId
    ) public view returns (uint) {
        uint confirmationCount;
        for (uint i = 0; i < owners.length; i++) {
            if (confirmations[transactionId][owners[i]] == true) {
                confirmationCount++;
            }
        }
        return confirmationCount;
    }

    function submitTransaction(
        address destination,
        uint value,
        bytes memory data
    ) public {
        uint transactionId = addTransaction(destination, value, data);
        confirmTransaction(transactionId);
    }

    function executeTransaction(uint transactionId) public payable {
        require(
            isConfirmed(transactionId),
            "This transaction is not yet confirmed"
        );
        (bool success, ) = transactions[transactionId].destination.call{
            value: transactions[transactionId].value
        }(transactions[transactionId].data);
        require(success, "Ups something went wrong");
        transactions[transactionId].executed = true;
        emit TransactionSent(
            transactions[transactionId].destination,
            transactions[transactionId].value,
            transactions[transactionId].data
        );
    }

    function addOwner(address newOwner) public onlySelf {
        require(
            isAnOwner(newOwner) == false,
            "This address is already an owner"
        );
        owners.push(newOwner);
        emit NewOwnerAdded(newOwner);
    }

    function removeOwner(address oldOwner) public onlySelf {
        require(isAnOwner(oldOwner) == true, "This address is not an owner");
        require(required <= owners.length - 1, "You need at least one signer");
        uint index;
        for (uint i = 0; i < owners.length; i++) {
            if (owners[i] == oldOwner) {
                index = i;
            }
        }

        for (uint i = index; i < owners.length - 1; i++) {
            owners[i] = owners[i + 1];
        }
        owners.pop();
    }

    /* Getter Functions */

    function getTransaction(
        uint index
    ) public view returns (Transaction memory) {
        Transaction memory indexTransaction = transactions[index];
        return indexTransaction;
    }

    function getOwner(uint index) public view returns (address) {
        return owners[index];
    }

    function getOwnersCount() public view returns (uint) {
        return owners.length;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

    /* Modifier */

    modifier onlySelf() {
        require(
            address(this) == msg.sender,
            "You don't have the permission to call this transaction!"
        );
        _;
    }

    receive() external payable {}
}

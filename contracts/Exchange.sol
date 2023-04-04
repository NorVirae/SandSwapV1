pragma solidity ^0.8.0;

contract Exchange{
    address tokenAddress;

    constructor(address _token){
        require(_token != address(0), "invalid token address");

        tokenAddress = _token;
    }
}
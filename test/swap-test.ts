import { ethers } from "hardhat";
import sandTokenAbi from "../artifacts/contracts/SandToken.sol/SandToken.json";
import { expect } from "chai";

describe("Add llquidity", () => {
  let tokenContract: any, exchangeContract: any;
  beforeEach(async () => {
    let tokenFactory = await ethers.getContractFactory("SandToken");
    tokenContract = await tokenFactory.deploy(
      "Sand Token",
      "SAND",
      ethers.utils.parseUnits("1000000", 18)
    );

    let exchangefactory = await ethers.getContractFactory("Exchange");
    exchangeContract = await exchangefactory.deploy(tokenContract.address);
  });

  it("adds Liquidity", async () => {
    await tokenContract.approve(
      exchangeContract.address,
      ethers.utils.parseUnits("200", 18)
    );
    await exchangeContract.addLiquidity(ethers.utils.parseUnits("200", 18), {
      value: ethers.utils.parseUnits("200", 18),
    });

    let exchangeBalance = await exchangeContract.getReserve();
    let etherBalance = await exchangeContract.getReserveEth()
    expect(Number(ethers.utils.formatUnits(exchangeBalance, 18))).equal(200)
    expect(Number(ethers.utils.formatUnits(etherBalance, 18))).equal(200)
  });
});

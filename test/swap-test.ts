import { ethers } from "hardhat";
import sandTokenAbi from "../artifacts/contracts/SandToken.sol/SandToken.json";
import { expect } from "chai";

describe("Add llquidity", () => {
  let tokenContract: any, exchangeContract: any;
  const provider = ethers.provider;
  beforeEach(async () => {
    let tokenFactory = await ethers.getContractFactory("SandToken");
    tokenContract = await tokenFactory.deploy(
      "Sand Token",
      "SAND",
      ethers.utils.parseUnits("1000000", 18)
    );

    let exchangefactory = await ethers.getContractFactory("Exchange");
    exchangeContract = await exchangefactory.deploy(tokenContract.address);
    await tokenContract.approve(
      exchangeContract.address,
      ethers.utils.parseUnits("2000", 18)
    );
    await exchangeContract.addLiquidity(ethers.utils.parseUnits("2000", 18), {
      value: ethers.utils.parseUnits("1000", 18),
    });
  });

  it("adds Liquidity", async () => {
    
    let exchangeBalance = await exchangeContract.getReserve();
    expect(Number(ethers.utils.formatUnits(exchangeBalance, 18))).equal(2000);
    expect(
      Number(
        ethers.utils.formatUnits(
          await provider.getBalance(exchangeContract.address),
          18
        )
      )
    ).equal(1000);
  });

  it("should return correct price", async () => {
    let ethReserve = await provider.getBalance(exchangeContract.address);
    let sandReserve = await exchangeContract.getReserve();
    console.log(ethReserve, sandReserve);
    let tokenOutPrice = await exchangeContract.getPrice(
        ethReserve,
        sandReserve);

    expect(Number(tokenOutPrice.toString())).equal(500);
  });
});

const { ethers } = require("hardhat");
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
  const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
  const pepe = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  const TOKEN_HOLDER = "0xF977814e90dA44bFA03b6295A0616a897441aceC";

  await helpers.impersonateAccount(TOKEN_HOLDER);
  const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

  const amountUsdt = ethers.parseUnits("100", 6);
  const amountpepe = ethers.parseUnits("14000000", 18);
  const amountUsdtMin = ethers.parseUnits("95", 6);
  const amountpepeMin = ethers.parseUnits("10000000", 18);

  const USDT_Contract = await ethers.getContractAt(
    "IERC20",
    USDT,
    impersonatedSigner
  );
  const pepe_Contract = await ethers.getContractAt("IERC20", pepe);

  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router",
    ROUTER_ADDRESS,
    impersonatedSigner
  );

  await USDT_Contract.approve(ROUTER_ADDRESS, amountUsdt);
  await pepe_Contract.approve(ROUTER_ADDRESS, amountpepe);

  const usdtBefore = await USDT_Contract.balanceOf(impersonatedSigner.address);
  const pepeBefore = await pepe_Contract.balanceOf(impersonatedSigner.address);
  const deadline = Math.floor(Date.now() / 1000) + 60 * 10 + 20;

  console.log("usdtBefore :", usdtBefore);
  console.log("pepeBefore :", pepeBefore);

  const addLiquidity = await ROUTER.addLiquidity(
    USDT,
    pepe,
    amountUsdt,
    amountpepe,
    amountUsdtMin,
    amountpepeMin,
    impersonatedSigner.address,
    deadline
  );
  await addLiquidity.wait();

  const usdtafter = await USDT_Contract.balanceOf(impersonatedSigner.address);
  const pepeBalAfter = await pepe_Contract.balanceOf(
    impersonatedSigner.address
  );

  console.log("usdtAFTER ", usdtafter);
  console.log("pepeAFTER ", pepeBalAfter);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

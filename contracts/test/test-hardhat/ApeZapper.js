//const {ethers} = require("hardhat")
const axios = require("axios")
//const {deploy, deployProxy} = require("../../script/utils")
//const {erc20_abi} = require("../../external_abi/erc20.abi.json")

const oneInchEndpoint = ({srcAmount, srcToken, dstToken, fromAddr, receiverAddr}) =>
  `https://api.1inch.dev/swap/v5.2/8453/swap?amount=${srcAmount}&src=${srcToken}&dst=${dstToken}&from=${fromAddr}&receiver=${receiverAddr}&slippage=0&disableEstimate=true`

const getOneInchSwapCallData = async ({srcAmount, srcToken, dstToken, fromAddr, receiverAddr}) => {
  try {
    const bearerToken = "Dh3qLfn4SEXHOtKTdNq5mrTWo5OSVET8"
    const res = await axios.get(oneInchEndpoint({srcAmount, srcToken, dstToken, fromAddr, receiverAddr}), {
      headers: {
        Authorization: `Bearer ${bearerToken}`, // Adding the authorization token to the headers
      },
    })

    if (res.status === 200) {
      return res.data.tx.data
    }

    console.log("1Inch swap API call failed: ", res.status)
    return null
  } catch (err) {
    console.log("1Inch swap API call error: ", err)
    return null
  }
}

const main = async () => {
  let USDCAddressMantle = "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9"
  let axlUSDCAddressBase = "0xEB466342C4d449BC9f53A865D5Cb90586f405215"
  let USDbCAddressBase = "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA"

  let oneInchRouterAddress = "0x1111111254EEB25477B68fb85Ed929f73A960582"

  //[this.deployer, this.wallet_1, this.wallet_2, this.feeReceiver] = await ethers.getSigners()

  this.oneInchRouterAddress = oneInchRouterAddress

  // this.usdcMantle = new ethers.Contract(USDCAddressMantle, erc20_abi, this.deployer)
  // this.axlUSDCBase = new ethers.Contract(axlUSDCAddressBase, erc20_abi, this.deployer)
  // this.USDbCBase = new ethers.Contract(USDbCAddressBase, erc20_abi, this.deployer)

  //this.apeZapper = await deploy("ApeZapper", "ApeZapper", [this.oneInchRouterAddress])
  
  //this.tokenIn = this.axlUSDCBase
  //this.amountIn = ethers.utils.parseEther("10")
  this.swapCallData = await getOneInchSwapCallData({
    srcAmount: "10",
    srcToken: axlUSDCAddressBase,
    dstToken: USDbCAddressBase,
    fromAddr: "0x65DAC8B5D5D31b1150d8a5a5A14Ed0e3A6827da8", //this.apeZapper.address,
    receiverAddr: "0x65DAC8B5D5D31b1150d8a5a5A14Ed0e3A6827da8" //this.apeZapper.address,
  })

  console.log("swapCallData: ", this.swapCallData)

  // transer "amountIn" of "tokenIn" to deployer (100 DAI in this case)
  //await this.tokenIn.connect(this.whale).transfer(this.wallet_1.address, this.amountIn)
  //await this.tokenIn.connect(this.wallet_1).approve(this.savvy1inchZapper.address, this.amountIn)
}

main();
const {expect} = require("chai")
const {ethers} = require("hardhat")
const axios = require("axios")
const {deploy, deployProxy} = require("../scripts/utils")
const {erc20_abi} = require("../../external_abi/erc20.abi.json")

const oneInchEndpoint = ({srcAmount, srcToken, dstToken, fromAddr, receiverAddr}) =>
  `https://api.1inch.dev/swap/v5.2/42161/swap?amount=${srcAmount}&src=${srcToken}&dst=${dstToken}&from=${fromAddr}&receiver=${receiverAddr}&slippage=50&disableEstimate=true`

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

describe("Savvy Zapper", function () {
  let USDCAddressMantle = "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9"
  let axlUSDCAddressBase = "0xEB466342C4d449BC9f53A865D5Cb90586f405215"
  let USDbCAddressBase = "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA"

  let oneInchRouterAddress = "0x1111111254EEB25477B68fb85Ed929f73A960582"

  before(async function () {
    ;[this.deployer, this.wallet_1, this.wallet_2, this.feeReceiver] = await ethers.getSigners()

    this.oneInchRouterAddress = oneInchRouterAddress

    this.usdcMantle = new ethers.Contract(USDCAddressMantle, erc20_abi, this.deployer)
    this.axlUSDCBase = new ethers.Contract(axlUSDCAddressBase, erc20_abi, this.deployer)
    this.USDbCBase = new ethers.Contract(USDbCAddressBase, erc20_abi, this.deployer)

    this.savvy1inchZapper = await deployProxy("ApeZapper", "ApeZapper", [this.oneInchRouterAddress])

  describe("Test deployed", function () {
    it("check deployment", async function () {
      console.log("deployed successfully!")
    })
  })

  describe("Test zap", function () {
    before(async function () {
      this.tokenIn = this.axlUSDCBase
      this.amountIn = ethers.utils.parseEther("10")
      this.swapCallData = await getOneInchSwapCallData({
        srcAmount: this.amountIn,
        srcToken: this.tokenIn.address,
        dstToken: this.USDbCBase.address,
        fromAddr: this.savvy1inchZapper.address,
        receiverAddr: this.savvy1inchZapper.address,
      })

      console.log("swapCallData: ", this.swapCallData)

      // transer "amountIn" of "tokenIn" to deployer (100 DAI in this case)
      //await this.tokenIn.connect(this.whale).transfer(this.wallet_1.address, this.amountIn)
      //await this.tokenIn.connect(this.wallet_1).approve(this.savvy1inchZapper.address, this.amountIn)
    })

    it("reverts when amountIn is 0", async function () {
      let amountIn = ethers.utils.parseEther("0")

      await expect(
        this.savvy1inchZapper
          .connect(this.wallet_1)
          .zapDepositBaseToken(
            this.tokenIn.address,
            amountIn,
            this.savvyPositionManager.address,
            this.staticAToken.address,
            this.swapCallData
          )
      ).to.be.revertedWith("zero amountIn amount")
    })

    it("reverts when savvyPositionManager address is 0", async function () {
      await expect(
        this.savvy1inchZapper
          .connect(this.wallet_1)
          .zapDepositBaseToken(
            this.tokenIn.address,
            this.amountIn,
            ethers.constants.AddressZero,
            this.staticAToken.address,
            this.swapCallData
          )
      ).to.be.revertedWith("invalid savvyPositionManager address")
    })

    it("reverts when tokenIn address is 0", async function () {
      await expect(
        this.savvy1inchZapper
          .connect(this.wallet_1)
          .zapDepositBaseToken(
            ethers.constants.AddressZero,
            this.amountIn,
            this.savvyPositionManager.address,
            this.staticAToken.address,
            this.swapCallData
          )
      ).to.be.revertedWith("invalid tokenIn address")
    })

    it("reverts when yieldToken address is 0", async function () {
      await expect(
        this.savvy1inchZapper
          .connect(this.wallet_1)
          .zapDepositBaseToken(
            this.tokenIn.address,
            this.amountIn,
            this.savvyPositionManager.address,
            ethers.constants.AddressZero,
            this.swapCallData
          )
      ).to.be.revertedWith("invalid yieldToken address")
    })

    it("success", async function () {
      let tokenInBalBefore = await this.tokenIn.balanceOf(this.wallet_1.address)
      let yieldTokenBalBefore = await this.staticAToken.balanceOf(this.savvyPositionManager.address)
      let senderInfoBefore = await this.savvyPositionManager.positions(this.wallet_1.address, this.staticAToken.address)

      await this.savvy1inchZapper
        .connect(this.wallet_1)
        .zapDepositBaseToken(
          this.tokenIn.address,
          this.amountIn,
          this.savvyPositionManager.address,
          this.staticAToken.address,
          this.swapCallData
        )

      let tokenInBalAfter = await this.tokenIn.balanceOf(this.wallet_1.address)
      let yieldTokenBalAfter = await this.staticAToken.balanceOf(this.savvyPositionManager.address)
      let senderInfoAfter = await this.savvyPositionManager.positions(this.wallet_1.address, this.staticAToken.address)
      console.log("=====")
      console.log("tokenIn balance before: ", tokenInBalBefore)
      console.log("tokenIn balance after: ", tokenInBalAfter)
      expect(tokenInBalBefore.sub(tokenInBalAfter)).to.be.equal(this.amountIn)

      console.log("=====")
      console.log("yieldToken balance on SPM before: ", yieldTokenBalBefore)
      console.log("yieldToken balance on SPM after: ", yieldTokenBalAfter)
      expect(yieldTokenBalAfter.gt(yieldTokenBalBefore)).to.be.equal(true)

      console.log("=====")
      console.log("senderInfo before: ", senderInfoBefore)
      console.log("senderInfo after: ", senderInfoAfter)
      expect(senderInfoAfter.shares.sub(senderInfoBefore.shares)).to.be.equal(
        yieldTokenBalAfter.sub(yieldTokenBalBefore).mul(10 ** (18 - 6))
      )
    })
  })

  describe("Test zapBorrow function", function () {
    before(async function () {
      this.borrowRatio = 1000
      this.tokenIn = this.dai
      this.amountIn = ethers.utils.parseEther("100")
      this.swapCallData = await getOneInchSwapCallData({
        srcAmount: this.amountIn,
        srcToken: this.tokenIn.address,
        dstToken: await this.staticAToken.baseToken(),
        fromAddr: this.savvy1inchZapper.address,
        receiverAddr: this.savvy1inchZapper.address,
      })

      // transer "amountIn" of "tokenIn" to deployer (100 DAI in this case)
      await this.tokenIn.connect(this.whale).transfer(this.wallet_1.address, this.amountIn)
      await this.tokenIn.connect(this.wallet_1).approve(this.savvy1inchZapper.address, this.amountIn)
    })

    it("reverts when amountIn is 0", async function () {
      let amountIn = ethers.utils.parseEther("0")

      await expect(
        this.savvy1inchZapper
          .connect(this.wallet_1)
          .zapBorrow(
            this.tokenIn.address,
            amountIn,
            this.savvyPositionManager.address,
            this.staticAToken.address,
            this.swapCallData,
            this.borrowRatio
          )
      ).to.be.revertedWith("zero amountIn amount")
    })

    it("reverts when savvyPositionManager address is 0", async function () {
      await expect(
        this.savvy1inchZapper
          .connect(this.wallet_1)
          .zapBorrow(
            this.tokenIn.address,
            this.amountIn,
            ethers.constants.AddressZero,
            this.staticAToken.address,
            this.swapCallData,
            this.borrowRatio
          )
      ).to.be.revertedWith("invalid savvyPositionManager address")
    })

    it("reverts when tokenIn address is 0", async function () {
      await expect(
        this.savvy1inchZapper
          .connect(this.wallet_1)
          .zapBorrow(
            ethers.constants.AddressZero,
            this.amountIn,
            this.savvyPositionManager.address,
            this.staticAToken.address,
            this.swapCallData,
            this.borrowRatio
          )
      ).to.be.revertedWith("invalid tokenIn address")
    })

    it("reverts when yieldToken address is 0", async function () {
      await expect(
        this.savvy1inchZapper
          .connect(this.wallet_1)
          .zapBorrow(
            this.tokenIn.address,
            this.amountIn,
            this.savvyPositionManager.address,
            ethers.constants.AddressZero,
            this.swapCallData,
            this.borrowRatio
          )
      ).to.be.revertedWith("invalid yieldToken address")
    })

    it("reverts when borrowRatio is greater than 50%", async function () {
      await expect(
        this.savvy1inchZapper
          .connect(this.wallet_1)
          .zapBorrow(
            this.tokenIn.address,
            this.amountIn,
            this.savvyPositionManager.address,
            this.staticAToken.address,
            this.swapCallData,
            6000
          )
      ).to.be.revertedWith("invalid borrowRatio")
    })

    it("success", async function () {
      let tokenInBalBefore = await this.tokenIn.balanceOf(this.wallet_1.address)
      let yieldTokenBalBefore = await this.staticAToken.balanceOf(this.savvyPositionManager.address)
      let senderInfoBefore = await this.savvyPositionManager.positions(this.wallet_1.address, this.staticAToken.address)
      let debtTokenBalBefore = await this.svUSD.balanceOf(this.wallet_1.address)

      await this.savvyPositionManager.connect(this.wallet_1).approveBorrow(this.savvy1inchZapper.address, this.amountIn)
      await this.savvy1inchZapper
        .connect(this.wallet_1)
        .zapBorrow(
          this.tokenIn.address,
          this.amountIn,
          this.savvyPositionManager.address,
          this.staticAToken.address,
          this.swapCallData,
          this.borrowRatio
        )

      let tokenInBalAfter = await this.tokenIn.balanceOf(this.wallet_1.address)
      let yieldTokenBalAfter = await this.staticAToken.balanceOf(this.savvyPositionManager.address)
      let senderInfoAfter = await this.savvyPositionManager.positions(this.wallet_1.address, this.staticAToken.address)
      let debtTokenBalAfter = await this.svUSD.balanceOf(this.wallet_1.address)

      console.log("=====")
      console.log("tokenIn balance before: ", tokenInBalBefore)
      console.log("tokenIn balance after: ", tokenInBalAfter)
      expect(tokenInBalBefore.sub(tokenInBalAfter)).to.be.equal(this.amountIn)

      console.log("=====")
      console.log("yieldToken balance on SPM before: ", yieldTokenBalBefore)
      console.log("yieldToken balance on SPM after: ", yieldTokenBalAfter)
      expect(yieldTokenBalAfter.gt(yieldTokenBalBefore)).to.be.equal(true)

      console.log("=====")
      console.log("senderInfo before: ", senderInfoBefore)
      console.log("senderInfo after: ", senderInfoAfter)
      expect(senderInfoAfter.shares.sub(senderInfoBefore.shares)).to.be.equal(
        yieldTokenBalAfter.sub(yieldTokenBalBefore).mul(10 ** (18 - 6))
      )

      console.log("=====")
      console.log("debtToken(svUSD) balance before: ", debtTokenBalBefore)
      console.log("debtToken(svUSD) balance after: ", debtTokenBalAfter)
      expect(debtTokenBalAfter.gt(debtTokenBalBefore)).to.be.equal(true)
    })
  })
})

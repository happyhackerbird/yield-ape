const { ethers } = require('ethers');
const axios = require("axios")
require("dotenv").config(({ path: ".env" }));
const PRIVATE_KEY = process.env.PRIVATE_KEY;
//const {deploy, deployProxy} = require("../../script/utils")
//const {erc20_abi} = require("../../external_abi/erc20.abi.json")

const oneInchEndpoint = ({ srcAmount, srcToken, dstToken, fromAddr, receiverAddr }) =>
  `https://api.1inch.dev/swap/v5.2/8453/swap?amount=${srcAmount}&src=${srcToken}&dst=${dstToken}&from=${fromAddr}&receiver=${receiverAddr}&slippage=0&disableEstimate=true`

const getOneInchSwapCallData = async ({ srcAmount, srcToken, dstToken, fromAddr, receiverAddr }) => {
  try {
    const bearerToken = "Dh3qLfn4SEXHOtKTdNq5mrTWo5OSVET8"
    const res = await axios.get(oneInchEndpoint({ srcAmount, srcToken, dstToken, fromAddr, receiverAddr }), {
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

async function callFunction() {
  const provider = new ethers.providers.JsonRpcProvider('https://mantle.rpc.thirdweb.com');
  const signer = new ethers.Wallet(PRIVATE_KEY, provider);
  // const signer = wallet.provider.getSigner(wallet.address);
  // const signer = provider.getSigner();

  const contractAddress = '0x57e13D4A517CAe90F4680b3c4E8637495D3858A6';
  const contractAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "gateway_",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "InvalidAddress",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotApprovedByGateway",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "payload",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "yieldToken",
          "type": "address"
        }
      ],
      "name": "ape",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "commandId",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "sourceChain",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "sourceAddress",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "payload",
          "type": "bytes"
        }
      ],
      "name": "execute",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "commandId",
          "type": "bytes32"
        },
        {
          "internalType": "string",
          "name": "sourceChain",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "sourceAddress",
          "type": "string"
        },
        {
          "internalType": "bytes",
          "name": "payload",
          "type": "bytes"
        },
        {
          "internalType": "string",
          "name": "tokenSymbol",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "executeWithToken",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "gateway",
      "outputs": [
        {
          "internalType": "contract IAxelarGateway",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const payload = "0x12aa3caf00000000000000000000000026271dfddbd250014f87f0f302c099d5a798bab1000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f405215000000000000000000000000d9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca00000000000000000000000026271dfddbd250014f87f0f302c099d5a798bab1000000000000000000000000a233441c94b2e13eaa9147849c1ed7e774c03047000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016e0000000000000000000000000000000000000000000000000000000001505126e11b93b61f6291d35c5a2bea0a9ff169080160cfeb466342c4d449bc9f53a865d5cb90586f4052150004f41766d80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000001111111254eeb25477b68fb85ed929f73a9605820000000000000000000000000000000000000000000000000000000065165f3c0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f405215000000000000000000000000d9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000008b1ccac8"

  const contract = new ethers.Contract(contractAddress, contractAbi, signer);

  // Call a view function
  const result = await contract.ape(payload, 100, "0x0a1d576f3eFeF75b330424287a95A366e8281D54", { gasLimit: 10000000, gasPrice: ethers.utils.parseUnits('50', 'gwei') });
  await result.wait();
  console.log(result);
}

const main = async () => {
  await callFunction();
  // let USDCAddressMantle = "0x09bc4e0d864854c6afb6eb9a9cdf58ac190d0df9"
  // let axlUSDCAddressBase = "0xEB466342C4d449BC9f53A865D5Cb90586f405215"
  // let USDbCAddressBase = "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA"

  // let oneInchRouterAddress = "0x1111111254EEB25477B68fb85Ed929f73A960582"

  // //[this.deployer, this.wallet_1, this.wallet_2, this.feeReceiver] = await ethers.getSigners()

  // this.oneInchRouterAddress = oneInchRouterAddress

  // // this.usdcMantle = new ethers.Contract(USDCAddressMantle, erc20_abi, this.deployer)
  // // this.axlUSDCBase = new ethers.Contract(axlUSDCAddressBase, erc20_abi, this.deployer)
  // // this.USDbCBase = new ethers.Contract(USDbCAddressBase, erc20_abi, this.deployer)

  // //this.apeZapper = await deploy("ApeZapper", "ApeZapper", [this.oneInchRouterAddress])

  // //this.tokenIn = this.axlUSDCBase
  // //this.amountIn = ethers.utils.parseEther("10")
  // this.swapCallData = await getOneInchSwapCallData({
  //   srcAmount: "10",
  //   srcToken: axlUSDCAddressBase,
  //   dstToken: USDbCAddressBase,
  //   fromAddr: "0x65DAC8B5D5D31b1150d8a5a5A14Ed0e3A6827da8", //this.apeZapper.address,
  //   receiverAddr: "0x65DAC8B5D5D31b1150d8a5a5A14Ed0e3A6827da8" //this.apeZapper.address,
  // })

  // console.log("swapCallData: ", this.swapCallData)

  // transer "amountIn" of "tokenIn" to deployer (100 DAI in this case)
  //await this.tokenIn.connect(this.whale).transfer(this.wallet_1.address, this.amountIn)
  //await this.tokenIn.connect(this.wallet_1).approve(this.savvy1inchZapper.address, this.amountIn)
}


main();
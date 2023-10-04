# YieldApe
*Winner of Best DeFi on Mantle at ETHGlobal 2023 New York* 🏆 ([Project Showcase](https://ethglobal.com/showcase/yield-ape-2w6d1))

YieldApe is your one-stop shop to access any yield strategy on any network with any starting token position. 

## How it works
Zap tokens from Mantle to Base via 1inch and Axelar.

The user connects their wallet, inputs an amount of USDC, and clicks submit. The frontend calls 1inch swap api to determine best route to swap axlUSDC into USDbC on Base. The frontend then calls the ```Ape``` contract on Mantle. The ```Ape``` contract wraps the user's USDC funds into axlUSDC from wallet. Using Axelar, the ```Ape``` contract bridges funds to the ```Yield``` Contract on Base with the swap route data as payload. With the payload, the ```Yield``` swaps USDC into USDbC and then deposits into Aave USDbC strategy using a Quicknode RPC. The ```Yield``` contract holds the receipt yield token. The receipt token can be returned to user on Base or bridged back on Mantle or can be held in the ```Yield``` contract as collateral to borrow against.

We used 1inch, Mantle, Axelar, Base, Quicknode, and Aave to demonstrate this proof of concept and used ThirdWeb to build a frontend interface. 1inch swap routing API is very robust and flexible to create the zapping experience that abstracts the need for a specific token away from the user. We used Axelar to both bridge as well as call contract functions on the destination chain from the source chain. Since 1inch routing requires off-chain compute due to gas prohibitive limits and both 1inch and Aave do not support Mantle currently, we had to call the API upfront and pass the routing data with the payload with Axelar's GMP.

## Deployed Contracts
Mantle 
- ```AxelarGas``` Contract to fund the execution of the bridge: https://explorer.mantle.xyz/tx/0xe6148443535f13c7222e3482f8829e11f2262d73446e006dfe1174ffe9c6aa02
- ```Ape``` Contract to initiate the Axelar bridge https://explorer.mantle.xyz/tx/0x0356ade2549d3f178abe69c469a88ff263af8837bd92ea4d112893c0ac23c342

Base
- ```Yield``` Contract that receives from Axelar, zaps tokens & deposits into Aave: https://basescan.org/address/0xa233441c94b2e13eaa9147849c1ed7e774c03047 

## How to run locally

Clone, change into ```frontend``` directory and run ```npm i```. Then run ```npm run start``` there. 

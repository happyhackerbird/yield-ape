import React, { useState, useEffect } from 'react';
import axios from "axios";
import { ConnectWallet, Web3Button, useAddress } from "@thirdweb-dev/react";
import './App.css';

function App() {
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const account = useAddress();

  const getOneInchSwapCallData = async ({srcAmount, srcToken, dstToken, fromAddr, receiverAddr}) => {
    try {
      const bearerToken = "Dh3qLfn4SEXHOtKTdNq5mrTWo5OSVET8"
      const request = `https://api.1inch.dev/swap/v5.2/8453/swap?amount=${srcAmount}&src=${srcToken}&dst=${dstToken}&from=${fromAddr}&receiver=${receiverAddr}&slippage=0&disableEstimate=true`
      axios.get(request, {
        headers: {
          'Authorization': `Bearer ${bearerToken}` // Adding the authorization token to the headers
        },
      })
      .then(response => {
        console.log("res", response.data);
        if (response.status === 200) {
          return response.data.tx.data
        }
      })

      //console.log("1Inch swap API call failed: ", res.status)
      console.log("1Inch swap API call failed");
      return null
    } catch (err) {
      console.log("1Inch swap API call error: ", err)
      return null
    }
  }

  const handleSubmit = async (contract) => {
    if (amount && !isNaN(amount) && account && !isNaN(account)) {
      let axlUSDCAddressBase = "0xEB466342C4d449BC9f53A865D5Cb90586f405215"
      let USDbCAddressBase = "0xd9aAEc86B65D86f6A7B5B1b0c42FFA531710b6CA"
      let swapCallData = await getOneInchSwapCallData({
        srcAmount: 10,
        srcToken: axlUSDCAddressBase,
        dstToken: USDbCAddressBase,
        fromAddr: account,
        receiverAddr: account
    })
      console.log("swapCallData: ", swapCallData)
      let payload = "0x12aa3caf00000000000000000000000026271dfddbd250014f87f0f302c099d5a798bab1000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f405215000000000000000000000000d9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca00000000000000000000000026271dfddbd250014f87f0f302c099d5a798bab1000000000000000000000000a233441c94b2e13eaa9147849c1ed7e774c03047000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016e0000000000000000000000000000000000000000000000000000000001505126e11b93b61f6291d35c5a2bea0a9ff169080160cfeb466342c4d449bc9f53a865d5cb90586f4052150004f41766d80000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000a00000000000000000000000001111111254eeb25477b68fb85ed929f73a9605820000000000000000000000000000000000000000000000000000000065165f3c0000000000000000000000000000000000000000000000000000000000000001000000000000000000000000eb466342c4d449bc9f53a865d5cb90586f405215000000000000000000000000d9aaec86b65d86f6a7b5b1b0c42ffa531710b6ca00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000008b1ccac8"
      contract.call("ape", payload, 100, "0x0a1d576f3eFeF75b330424287a95A366e8281D54")
      setMessage(`Successful deposit of ${amount} units.`);
    } else {
      setMessage('Please enter a valid number.');
    }
  };

  useEffect(() => {
    if (account && !isNaN(account)) {
      setMessage(`Connected to wallet: ${account}`);
    }
  }, [account]);

  return (
      <div className="App">
        <header className="App-header">
        <ConnectWallet switchToActiveChain={true} className="button" />
          <h1>Yield Ape</h1>
          <div className="input-section">
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Web3Button 
              contractAddress="0x57e13D4A517CAe90F4680b3c4E8637495D3858A6" 
              action={async (contract) => await handleSubmit(contract)}
            >
              Submit
            </Web3Button>
          </div>
          {message && <p>{message}</p>}
        </header>
      </div>
    
  );
}

export default App;

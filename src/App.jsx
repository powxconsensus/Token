import React, { Component } from "react";
import Signin from "./components/signin/signin.component";
import Header from "./components/header/header.component";
// import { TodoList } from "./TodoList";
import { userSession } from "./auth";
import BigNum from "bn.js";
import {
  makeContractCall,
  callReadOnlyFunction,
  broadcastTransaction,
  AnchorMode,
  FungibleConditionCode,
  standardPrincipalCV,
  makeStandardSTXPostCondition,
  makeContractFungiblePostCondition,
  createAssetInfo,
  bufferCVFromString,
  uintCV,
} from "@stacks/transactions";
import { openContractCall } from "@stacks/connect";
import { StacksTestnet, StacksMainnet } from "@stacks/network";

// for mainnet, use `StacksMainnet()`
const network = new StacksTestnet();

export default class App extends Component {
  state = {
    userData: null,
    name: "",
    balance: 125435,
    symbol: "",
    recipientAddress: "",
    amount: 0,
  };

  handleSignOut(e) {
    e.preventDefault();
    this.setState({ userData: null });
    userSession.signUserOut(window.location.origin);
  }
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  handleMint = async () => {
    const { userData, amount, recipientAddress } = this.state;
    const options = {
      contractAddress: "STBM5M87T6K4FWRTQPDXAKSDXX9ZQQXHTYE8WW9T",
      contractName: "clarity-coin",
      functionName: "mint",
      // sponsored: true, // this is a sponsored transactions
      functionArgs: [uintCV(amount), standardPrincipalCV(recipientAddress)], //bufferCVFromString("foo")
      appDetails: {
        name: "Bitcoin NFT on Stacks",
        icon: window.location.origin + "/hiro-icon-black.png",
      },
      network, // set to mainnet
      onFinish: (data) => {
        console.log(data);
        // console.log("Stacks Transaction:", data.stacksTransaction);
        // console.log("Raw transaction:", data.txRaw);
      },
    };

    const transaction = await openContractCall(options);
    // const broadcastResponse = await broadcastTransaction(transaction, network);
    console.log(transaction);
    // const txId = broadcastResponse.txid;
  };
  render() {
    const { name, balance, symbol, amount, recipientAddress } = this.state;
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          <Header />
          {!userSession.isUserSignedIn() ? (
            <Signin />
          ) : (
            <div>
              <p>Token Name: {name}</p>
              <p>Balance: {balance + " " + symbol}</p>

              <p>Admin</p>
              <p>Mint {name} token</p>
              <p>
                <label htmlFor="amount">Amount</label>
                <input
                  type="number"
                  name="amount"
                  value={amount}
                  onChange={this.handleChange}
                />
              </p>
              <p>
                <label htmlFor="recipientAddress">Recipient Address</label>
                <input
                  type="text"
                  name="recipientAddress"
                  value={recipientAddress}
                  onChange={this.handleChange}
                />
              </p>
              <p onClick={this.handleMint}>Mint</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  async componentDidMount() {
    let userData = null;
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((tUserData) => {
        window.history.replaceState({}, document.title, "/");
        // this.setState({ userData: tUserData });
        userData = tUserData;
      });
    } else if (userSession.isUserSignedIn()) {
      // this.setState({  });
      userData = userSession.loadUserData();
    }
    if (!userData) return;
    console.log(userData);
    const txOptions = {
      contractAddress: "STBM5M87T6K4FWRTQPDXAKSDXX9ZQQXHTYE8WW9T",
      contractName: "clarity-coin",
      functionName: "get-name",
      functionArgs: [], //bufferCVFromString("foo")
      senderAddress: userData.profile.stxAddress.testnet,
      network,
    };
    const name = (await callReadOnlyFunction(txOptions)).value.data;
    const symbol = (
      await callReadOnlyFunction({
        contractAddress: "STBM5M87T6K4FWRTQPDXAKSDXX9ZQQXHTYE8WW9T",
        contractName: "clarity-coin",
        functionName: "get-symbol",
        functionArgs: [], //bufferCVFromString("foo")
        senderAddress: userData.profile.stxAddress.testnet,
        network,
      })
    ).value.data;

    const balance = (
      await callReadOnlyFunction({
        contractAddress: "STBM5M87T6K4FWRTQPDXAKSDXX9ZQQXHTYE8WW9T",
        contractName: "clarity-coin",
        functionName: "get-balance",
        functionArgs: [
          standardPrincipalCV(userData.profile.stxAddress.testnet),
        ], //bufferCVFromString("foo")
        senderAddress: userData.profile.stxAddress.testnet,
        network,
      })
    ).value.value;
    this.setState({
      userData,
      name,
      symbol,
      balance,
      recipientAddress: userData.profile.stxAddress.testnet,
    });
  }
}

"use client"
import React, { useState } from "react";
import { ethers } from 'ethers';
import { useWallets } from "@web3-onboard/react";
//import { advanceInput } from "@mugen-builders/client";
import { advanceDAppRelay, advanceERC20Deposit, advanceERC721Deposit, advanceEtherDeposit, advanceInput } from "@mugen-builders/client";
export const Input = (props) => {
  const [connectedWallet] = useWallets();
  const [input, setInput] = useState("");
  const provider = new ethers.providers.Web3Provider(connectedWallet.provider);
  const [hexInput, setHexInput] = useState(false);
  const [erc20Amount, setErc20Amount] = useState(0);
  const [erc20Token, setErc20Token] = useState("");
  const [erc721Id, setErc721Id] = useState(0);
  const [erc721, setErc721] = useState("");
  const [etherAmount, setEtherAmount] = useState(0);

  const dappAddress = props.dappAddress;
  console.log("dapp address is:", dappAddress);
  const addInput = async () => {
    console.log("adding input", input);
    const signer = await provider.getSigner();
    console.log("signer and input is ", signer, input);
    advanceInput(signer, dappAddress, input);
  };

  const sendAddress = async () => {
    console.log("sending dapp address");
    const signer = await provider.getSigner();
    advanceDAppRelay(signer, dappAddress);
  }

  const depositEtherToPortal = async () => {
    console.log("sending ether to portal");
    const signer = await provider.getSigner();
    advanceEtherDeposit(signer, dappAddress, etherAmount);
  }

  const depositErc20ToPortal = async () => {
    console.log("depositing erc20 to portal");
    const signer = await provider.getSigner();
    advanceERC20Deposit(signer, dappAddress, erc20Token, erc20Amount);
  }
  const transferNftToPortal = async (erc721, erc721Id) => {
    console.log("depositing erc721 to portal");
    const signer = await provider.getSigner();
    advanceERC721Deposit(signer, dappAddress, erc721, erc721Id);
  }

  return (
    <div>
      {<div>
        Send Address (send relay dapp address) <br />
        <button onClick={() => sendAddress(input)} >
          Send
        </button>
        <br />
        <br />
      </div>}
      <div>
        Send Input <br />
        Input:{" "}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <input
          type="checkbox"
          checked={hexInput}
          onChange={(e) => setHexInput(!hexInput)}
        />
        <span>Raw Hex </span>
        <button onClick={() => addInput(input)}>Send</button>
        <br />
        <br />
      </div>
      {<div>
        <div>
          Deposit Ether <br />
          Amount:{" "}
          <input
            type="number"
            value={etherAmount}
            onChange={(e) => setEtherAmount(Number(e.target.value))}
          />
          <button
            onClick={() => depositEtherToPortal(etherAmount)}

          >
            Deposit Ether
          </button>
          <br />
          <br />
        </div>
        <div>
          Deposit ERC20 <br />
          Address:{" "}
          <input
            type="text"
            value={erc20Token}
            onChange={(e) => setErc20Token(e.target.value)}
          />
          Amount:{" "}
          <input
            type="number"
            value={erc20Amount}
            onChange={(e) => setErc20Amount(Number(e.target.value))}
          />
          <button
            onClick={() => depositErc20ToPortal(erc20Token, erc20Amount)}

          >
            Deposit ERC20
          </button>
          <br />
          <br />
        </div>
        <div>
          Transfer ERC721 <br />
          Address:{" "}
          <input
            type="text"
            value={erc721}
            onChange={(e) => setErc721(e.target.value)}
          />
          id:{" "}
          <input
            type="number"
            value={erc721Id}
            onChange={(e) => setErc721Id(Number(e.target.value))}
          />
          <button
            onClick={() => transferNftToPortal(erc721, erc721Id)}

          >
            Transfer NFT
          </button>
          <br />
          <br />
        </div>
      </div>}
    </div>
  );
};

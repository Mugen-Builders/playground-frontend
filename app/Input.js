import React, { useState } from "react";
import { ethers } from "ethers";
import { useWallets } from "@web3-onboard/react";
import { advanceInput } from "cartesi-client";
export const Input = () => {
  const [connectedWallet] = useWallets();
  const [input, setInput] = useState("");
  const provider = new ethers.BrowserProvider(connectedWallet.provider);
  const [hexInput, setHexInput] = useState(false);
  const addInput = () => {
    /* advanceInput({
      client: provider.getSigner(0),
      DappAddress: "",
      payload: "Hello world",
    });*/
  };
  return (
    <div>
      {/*  <div>
        Send Address (send relay dapp address) <br />
        <button onClick={() => sendAddress(input)} disabled={!rollups}>
          Send
        </button>
        <br />
        <br />
  </div>*/}
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
      {/* <div>
        Deposit Ether <br />
        Amount:{" "}
        <input
          type="number"
          value={etherAmount}
          onChange={(e) => setEtherAmount(Number(e.target.value))}
        />
        <button
          onClick={() => depositEtherToPortal(etherAmount)}
          disabled={!rollups}
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
          disabled={!rollups}
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
          disabled={!rollups}
        >
          Transfer NFT
        </button>
        <br />
        <br />
      </div>
      <div>
        Transfer Single ERC1155 <br />
        Address:{" "}
        <input
          type="text"
          value={erc1155}
          onChange={(e) => setErc1155(e.target.value)}
        />
        id:{" "}
        <input
          type="number"
          value={erc1155Id}
          onChange={(e) => setErc1155Id(Number(e.target.value))}
        />
        Amount:{" "}
        <input
          type="number"
          value={erc1155Amount}
          onChange={(e) => setErc1155Amount(Number(e.target.value))}
        />
        <button onClick={() => AddTo1155Batch()} disabled={!rollups}>
          Add to Batch
        </button>
        <button
          onClick={() =>
            transferErc1155SingleToPortal(erc1155, erc1155Id, erc1155Amount)
          }
          disabled={!rollups}
        >
          Transfer Single 1155
        </button>
        <br />
        Transfer ERC1155 Batch <br />
        <span>
          Ids: {erc1155IdsStr} - Amounts: {erc1155AmountsStr}{" "}
        </span>
        <button onClick={() => Clear1155Batch()} disabled={!rollups}>
          Clear Batch
        </button>
        <button
          onClick={() =>
            transferErc1155BatchToPortal(erc1155, erc1155Ids, erc1155Amounts)
          }
          disabled={!rollups}
        >
          Transfer Batch 1155
        </button>
      </div>*/}
    </div>
  );
};

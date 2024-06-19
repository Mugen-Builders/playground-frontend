'use client'

import { useEffect, useState } from 'react';
import { useConnectWallet, useSetChain } from "@web3-onboard/react";

import {
  Box,
  Flex,
  ChakraProvider,
} from '@chakra-ui/react'
import injectedModule from "@web3-onboard/injected-wallets";
import { init } from "@web3-onboard/react";
import configFile from "../config.json";

const config = configFile;
const injected = injectedModule();
init({
  wallets: [injected],
  chains: Object.entries(config).map(([k, v], i) => ({
    id: k,
    token: v.token,
    label: v.label,
    rpcUrl: v.rpcUrl,
  })),
  appMetadata: {
    name: "Joao's Playground app",
    icon: "<svg><svg/>",
    description: "Enter the world of Cartesia",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
});
let apiURL = "http://localhost:8080/graphql";

export default function Navbar() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();
  const [dappAddress, setDappAddress] = useState(
    "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e"
  );
 
  return (
    <>
      <ChakraProvider>
        <Box 
        backgroundColor={"#232931"} 
        px={4}
        filter={"drop-shadow(0 0 0.25rem black)"}
        >
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <Box>Logo</Box>

            <div>
            {!wallet && (
              <button onClick={() => connect()}>
                {connecting ? "connecting" : "connect"}
              </button>
            )}
            {wallet && (
              <div>
                <label>Switch Chain</label>
                {settingChain ? (
                  <span>Switching chain...</span>
                ) : (
                  <select
                    onChange={({ target: { value } }) => {
                      if (config[value] !== undefined) {
                        setChain({ chainId: value });
                      } else {
                        alert("No deploy on this chain");
                      }
                    }}
                    value={connectedChain?.id}
                  >
                    {chains.map(({ id, label }) => {
                      return (
                        <option key={id} value={id}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
                )}
                <button onClick={() => disconnect(wallet)}>Disconnect Wallet</button>
                <div>
                  Dapp Address: <input
                    type="text"
                    value={dappAddress}
                    onChange={(e) => setDappAddress(e.target.value)}
                  />
                  <br /><br />
                </div>
              </div>
            )}
          </div>
          </Flex>
        </Box>
      </ChakraProvider>
    </>
  )
}

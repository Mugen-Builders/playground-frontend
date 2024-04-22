// Copyright 2022 Cartesi Pte. Ltd.

// Licensed under the Apache License, Version 2.0 (the "License"); you may not
// use this file except in compliance with the License. You may obtain a copy
// of the license at http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
// WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
// License for the specific language governing permissions and limitations
// under the License.
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import configFile from "./config.json";

const config = configFile;
import { Input } from "./Input";
import { useState } from "react";
import { Inspect } from "./inspect";
import { Notice } from "./notices";
import { Report } from './reports';
import { Voucher } from './voucher';
export const Network = () => {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();
  const [dappAddress, setDappAddress] = useState(
    "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e"
  );
  return (
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
          <Input dappAddress={dappAddress} />
          <Inspect />
          <Report />
          <Notice />
          <Voucher dappAddress={dappAddress} />
        </div>
      )}
    </div>
  );
};

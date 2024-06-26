'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { Box, Button, useDisclosure, Image, ChakraProvider, Textarea } from '@chakra-ui/react'
import injectedModule from "@web3-onboard/injected-wallets";
import { init } from "@web3-onboard/react";
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

import { advanceDAppRelay, advanceERC20Deposit, advanceERC721Deposit, advanceEtherDeposit, advanceInput, getNotice, getReport } from "cartesi-client";
import { ethers } from 'ethers';
import { test } from './code.verifier'
import { Notice } from '../notices';
import { Report } from '../reports';
import { Voucher } from '../voucher';

import Navbar from '../components/navbar'
import Stages from '../components/stages'
import MdBox from '../components/mdbox';

import configFile from "../config.json";

const config = configFile;

export default function Playground() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();
  const [dappAddress, setDappAddress] = useState(
    "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e"
  );
  const router = useRouter()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [code, setCode] = useState("Loading...")
  const [output, setOutput] = useState("Output:")
  const [alloutputs, showallOutputs] = useState(false);
  const [voucher, showVoucher] = useState(false);
  const [singleOutput, showSingleOutput] = useState(false);
  const searchParams = useSearchParams()
  
  const chapter = parseInt(searchParams.get('chapter')) || 0
  const step = parseInt(searchParams.get('step')) || 0

  function run() {
    test(`test${chapter}_${step}`, code).then(async (result) => {
      setOutput("Sending data to backend")
      // await sendtoBackend();
      setOutput(result)
    }).catch((error) => {
      setOutput(error)
    })
  }


  const sendtoBackend = async () => {
    if (!wallet) {
      alert("Please connect your web3 wallet to proceed!")
      return
    }
    let response
    switch (chapter) {
      case 0:
        switch (step) {
          case 0:
            response = await addInput(JSON.stringify({ method: "create_notice", args: { data: "I'm here, Cartesia!" } }));
            addInput(JSON.stringify({ method: "create_user" }));
            break;
          case 1:
            response = await addInput(JSON.stringify({ method: "set_catchphrase", args: { data: "I'm here, Cartesia!" } }));
            setOutput()
            break;
          case 2:
            // response = await addInput(JSON.stringify({ method: "signup_formission" }));
            console.log("only an inspect call")
            break;
          case 3:
            response = await addInput(JSON.stringify({ method: "accept_mission", args: { mission: 0 } })); //* To-Do change this to a dynamic variable *//
            break;
          case 4:
            response = await addInput(JSON.stringify({ method: "create_report", args: { data: "creating a report" } })); //* To-do change this to a dynamic payload *//
            break;
        }
        console.log("response")
        console.log(response)
        break
      case 1:
        switch (step) {
          case 0:
            showallOutputs(true);
            break;
          case 1:
            showSingleOutput(true);
            break;
          case 2:
            await addInput(JSON.stringify({ method: "fight_dragon" }));
            break;
        }
        break;
      case 2:
        switch (step) {
          case 0:
            await addInput(JSON.stringify({ method: "loot_dragon" }));
            break;
          case 1:
            await addInput(JSON.stringify({ method: "sell_items" }));
            break;
        }
        break;

    }
    return
  }

  const addInput = async (_input) => {
    const provider = new ethers.providers.Web3Provider(wallet.provider);
    console.log("adding input", _input);
    const signer = await provider.getSigner();
    console.log("signer and input is ", signer, _input);
    return advanceInput(signer, dappAddress, _input);
  };

  useEffect(() => {

    fetch(`/code/chapter_${chapter}_step_${step}.js`)
      .then(r => r.text())
      .then(text => {
        setCode(text)
        setOutput("")
      }).catch(err => {
        setCode(undefined)
      });

  }, [chapter, step])  // Add chapter and step as dependencies

  return (
    <>
      <ChakraProvider>
        
        <Navbar />
        <Stages />

        <Box
          className='class-container'
          display={"flex"}
          height={"calc(100vh - 184px)"}
          fontFamily={"'Inter Variable', sans-serif"}
        >
          <MdBox chapter={chapter} step={step} />

          <Box
            flex={5}
            display={"block"}
            overflow={"scroll"}
          >
            <Box
              minHeight={"300px"}
              height={"calc(100vh - 384px)"}
            >
              <Editor
                language="javascript"
                value={code}
                theme="vs-dark"
                onChange={(value) => setCode(value)}
              />
            </Box>

            <Box
              minHeight={"200px"}
              backgroundColor={"#1a1a1a"}
            >
              <Box
                height={"25px"}
                backgroundColor="#2a2a2a">
                <Button
                  onClick={() => {
                    run();
                  }}
                  height={"23px"}
                >Run</Button>
              </Box>

              <Textarea
                width={"100%"}
                height={"173px"}
                value={output}
                color={"#f4f4f4"}
                fontSize={"9pt"}
                isDisabled
                fontFamily={'"Space Mono", monospace'}
              />

            </Box>
          </Box>

        </Box>
        {alloutputs && wallet &&
          <div>

          </div>
        }

        {singleOutput && wallet &&
          <div>
            <Notice chain={connectedChain} index={0} />
            <Report chain={connectedChain} index={1} />

          </div>
        }

      </ChakraProvider>
    </>
  )
}

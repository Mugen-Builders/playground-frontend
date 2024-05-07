'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { advanceDAppRelay, advanceERC20Deposit, advanceERC721Deposit, advanceEtherDeposit, advanceInput } from "cartesi-client";
import { ethers } from 'ethers';
import { test } from './code.verifier'
import {
  Box,
  Flex,
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  Stack,
  Center,
  Image,
  ChakraProvider,
  Textarea,
  Alert
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
    name: "Joao's playground app",
    icon: "<svg><svg/>",
    description: "Enter the world of Cartesia",
    recommendedInjectedWallets: [
      { name: "MetaMask", url: "https://metamask.io" },
    ],
  },
});



const NavLink = (props) => {
  const { children } = props

  return (
    <Box
      as="a"
      px={2}
      py={1}
      rounded={'md'}
      _hover={{
        textDecoration: 'none',
      }}
      href={'#'}>
      {children}
    </Box>
  )
}


function HeroStage() {
  const searchParams = useSearchParams()
  const chapter = searchParams.get('chapter') | 0
  const step = searchParams.get('step') | 0

  const [metadata, setMetadata] = useState({ total_steps: 1 })

  useEffect(() => {
    fetch(`/chapter_metadata/${chapter}.json`)
      .then(r => r.text())
      .then(text => {
        let json = JSON.parse(text)
        setMetadata(json)
      }).catch(err => {
        console.log(err)
      });

  }, [])

  return (
    <div className="hero-stage">
      {Array.from({ length: metadata.total_steps * 2 }, (_, i) => {

        if (i % 2 == 1) {
          return (<div key={i} className="line"></div>)
        }
        if (i == step * 2) {

          return (
            <Image key={i}
              height={"90px"}
              src='https://github.com/Mugen-Builders/playground-frontend/blob/main/assets/character/Subject.png?raw=true'
              alt='hero'
            />
          )

        } else if (i < step * 2) {
          return (<div key={i} className="dot flex-item done"></div>)
        } else {
          return (<div key={i} className="dot flex-item"></div>)
        }
      })}
    </div>
  );
}


export default function Playground() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();
  const [dappAddress, setDappAddress] = useState(
    "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e"
  );
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [code, setCode] = useState("Loading...")
  const [md, setMd] = useState("Loading...")
  const [output, setOutput] = useState("Output:")

  const searchParams = useSearchParams()
  const chapter = searchParams.get('chapter') | 0
  const step = searchParams.get('step') | 0

  function run() {

    test(`test${chapter}_${step}`, code).then((result) => {
      setOutput(result)
    }).catch((error) => {
      setOutput(error)
    })
  }
  const sendtoBackend = async () => {
    if (!wallet) {
      alert("Please connect your web3 wallet to proceed!")
    }
    switch (chapter) {
      case 0:
        switch (step) {
          case 0:
            addInput(JSON.stringify({ method: "createNotice", Args: { data: "welcome to Cartesia" } }));
          case 2:
            addInput(JSON.stringify({ method: "signupforMission" }));
          case 3:
            addInput(JSON.stringify({ method: "acceptMission", args: { mission: 1 } })); //* To-Do change this to a dynamic variable
          case 4:
            addInput(JSON.stringify({ method: "createReport", Args: { data: "creating a report" } })); //* To-do change this to a dynamic payload

        }
    }
  }
  const addInput = async (_input) => {
    const provider = new ethers.providers.Web3Provider(wallet.provider);
    console.log("adding input", _input);
    const signer = await provider.getSigner();
    console.log("signer and input is ", signer, _input);
    advanceInput(signer, dappAddress, _input);
  };
  useEffect(() => {
    import(`@/markdown/chapter_${chapter}_step_${step}.mdx`).then(module => {
      setMd(module.default)
    }).catch(err => {
      setMd(undefined)
    })

    fetch(`/code/chapter_${chapter}_step_${step}.js`)
      .then(r => r.text())
      .then(text => {
        setCode(text)
      }).catch(err => {
        setCode(undefined)
      });

  }, [])


  return (
    <>
      <ChakraProvider>
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
        <Box
          backgroundColor={"#232931"}
          px={4}
          filter={"drop-shadow(0 0 0.25rem black)"}
        >
          <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
            <Box>Logo</Box>

            <Flex alignItems={'center'}>
              <Stack direction={'row'} spacing={7}>
                <Menu>
                  <MenuButton
                    as={Button}
                    rounded={'full'}
                    variant={'link'}
                    cursor={'pointer'}
                    minW={0}>
                    <Avatar
                      size={'sm'}
                      src={'https://avatars.dicebear.com/api/male/username.svg'}
                    />
                  </MenuButton>
                  <MenuList alignItems={'center'}>
                    <br />
                    <Center>
                      <Avatar
                        size={'2xl'}
                        src={'https://avatars.dicebear.com/api/male/username.svg'}
                      />
                    </Center>
                    <br />
                    <Center>
                      <p>Username</p>
                    </Center>
                    <br />
                    <MenuDivider />
                    <MenuItem>Your Servers</MenuItem>
                    <MenuItem>Account Settings</MenuItem>
                    <MenuItem>Logout</MenuItem>
                  </MenuList>
                </Menu>
              </Stack>
            </Flex>
          </Flex>
        </Box>
        <Box
          display={"flex"}
          justifyContent={'center'}
          alignItems={'center'}
          p={4}
          height={"120px"}
          backgroundSize="cover"
          boxShadow={"inset 0 0 0 2000px rgba(0, 0, 0, 0.85)"}
          backgroundPosition={"center bottom -70%"}
          backgroundImage={`url('https://raw.githubusercontent.com/Mugen-Builders/playground-frontend/main/assets/chapter_images/chapter_${chapter}.webp')`}
        >
          <HeroStage />
        </Box>

        <Box
          className='class-container'
          display={"flex"}
          height={"calc(100vh - 184px)"}
          fontFamily={"'Inter Variable', sans-serif"}
        >
          <Box
            className='md'
            flex={5}
            padding={"20px"}
            height={"100%"}
            overflow={"scroll"}
          >
            {
              md ? md : "404 not found"
            }
          </Box>

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
                defaultLanguage="javascript"
                defaultValue={code ? code : "Not found"}
                theme="vs-dark"
                onChange={(e) => setCode(e)}
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
                    sendtoBackend();
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

      </ChakraProvider>

    </>
  )
}
'use client'

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation';
import { IconButton } from '@chakra-ui/react'



import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { useConnectWallet, useSetChain } from "@web3-onboard/react";
import { advanceDAppRelay, advanceERC20Deposit, advanceERC721Deposit, advanceEtherDeposit, advanceInput, getNotice, getReport } from "cartesi-client";
import { ethers } from 'ethers';
import { test } from './code.verifier'
import { Notice } from '../notices';
import { Report } from '../reports';
import { Voucher } from '../voucher';
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
let apiURL = "http://localhost:8080/graphql";

function HeroStage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chapter = parseInt(searchParams.get('chapter')) || 0
  const step = parseInt(searchParams.get('step')) || 0

  let nextStep = step + 1
  let prevStep = step - 1
  let nextChapter = chapter

  const [metadata, setMetadata] = useState({ total_steps: 1 })

  useEffect(()  => {
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
      <button className='prev-button' type="button" onClick={() => {
        
        if (prevStep < 0) { 
          router.push(`/`)
        } else {
          router.push(`/play?chapter=${nextChapter}&step=${prevStep}`)
        }
      }}>
      </button>

      {Array.from({ length: metadata.total_steps * 2 }, (_, i) => {
        if (metadata.total_steps <= nextChapter + 1) {
          nextStep = 0
          nextChapter += 1
        }

        if (i % 2 === 1) {
          return (<div key={i} className="line"></div>)
        }
        if (i === step * 2) {

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

      <button className='next-button' type="button" onClick={() => {
        
        if (nextStep >= metadata.total_steps) { 
          router.push(`/`)
        } else {
          router.push(`/play?chapter=${nextChapter}&step=${nextStep}`)
        }
      }}>
        Dashboard
      </button>

    </div>
  );
}

export default function Playground() {
  const [{ wallet, connecting }, connect, disconnect] = useConnectWallet();
  const [{ chains, connectedChain, settingChain }, setChain] = useSetChain();
  const [dappAddress, setDappAddress] = useState(
    "0xab7528bb862fb57e8a2bcd567a2e929a0be56a5e"
  );
  const router = useRouter()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [code, setCode] = useState("Loading...")
  const [md, setMd] = useState("Loading...")
  const [output, setOutput] = useState("Output:")
  const [alloutputs, showallOutputs] = useState(false);
  const [voucher, showVoucher] = useState(false);
  const [singleOutput, showSingleOutput] = useState(false);
  const searchParams = useSearchParams()
  const chapter = parseInt(searchParams.get('chapter')) || 0
  const step = parseInt(searchParams.get('step')) || 0

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
      return
    }
    console.log(chapter, step);
    switch (chapter) {
      case 0:
        switch (step) {
          case 0:
            addInput(JSON.stringify({ method: "create_notice", args: { data: "welcome to Cartesia" } }));
            addInput(JSON.stringify({ method: "create_user" }));
            break;
          case 2:
            addInput(JSON.stringify({ method: "signup_formission" }));
            break;
          case 3:
            addInput(JSON.stringify({ method: "accept_mission", args: { mission: 1 } })); //* To-Do change this to a dynamic variable *//
            break;
          case 4:
            addInput(JSON.stringify({ method: "create_report", args: { data: "creating a report" } })); //* To-do change this to a dynamic payload *//
            break;

        }
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

  }, [chapter, step])  // Add chapter and step as dependencies

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

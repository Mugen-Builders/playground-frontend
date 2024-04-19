'use client'
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation'
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
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
  Textarea
} from '@chakra-ui/react'


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

  const [ metadata, setMetadata ] = useState({total_steps: 1})

  useEffect(()=> {
    fetch(`/chapter_metadata/${chapter}.json`)
    .then(r => r.text())
    .then(text => {
      let json = JSON.parse(text)
      setMetadata(json)
      console.log("chap mdtdt", json)
    }).catch(err => {
      console.log(err)
      console.log("hmm")
    });
  
  }, [])

  return (
    <div className="hero-stage">
      {Array.from({ length: metadata.total_steps * 2 }, (_, i) => {
        
        if (i % 2 == 1) {
          return (<div key={i} className="line"></div>)
        }
        if (i == step *2) {

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
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [ code, setCode ] = useState("Loading...")
  const [ md, setMd ] = useState("Loading...")
  const [ output, setOutput ] = useState("Output:")

  const searchParams = useSearchParams()
  const chapter = searchParams.get('chapter') | 0
  const step = searchParams.get('step') | 0



  function run() {
    test("fetchOverride", code).then((result) => {
      setOutput(result)
    }).catch ((error)=> {
      console.log("called error")
      console.log(error )
      setOutput(error)
    })
  }

  useEffect(()=> {
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
          defaultValue={ code ? code : "Not found"} 
          theme="vs-dark"
          onChange={ (e) => setCode(e) }
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
                onClick={ run }
                height={"23px"}
              >Run</Button>
            </Box>

            <Textarea
              width={"100%"}
              height={"173px"}
              value={ output }
              color={ "#f4f4f4" }
              fontSize={ "9pt" }
              isDisabled
              fontFamily={ '"Space Mono", monospace' }
            />

          </Box>
        </Box>

      </Box>

      </ChakraProvider>

    </>
  )
}
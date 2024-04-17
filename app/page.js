'use client'
 

import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorModeValue,
  Stack,
  useColorMode,
  Center,
  Image
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

export default function Nav() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
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
        backgroundImage={"url('https://raw.githubusercontent.com/Mugen-Builders/playground-frontend/main/assets/chapter_images/chapter_0.webp')"}
      >
          <Image 
            height={"90px"}
            src='https://github.com/Mugen-Builders/playground-frontend/blob/main/assets/character/Subject.png?raw=true' 
            alt='hero' 
          />



      </Box>
      <Box display={"flex"}>
        <Box>
          {/* <MDXProvider components={components}>
            <Post />
          </MDXProvider> */}
        </Box>
        <Box></Box>

      </Box>

    </>
  )
}
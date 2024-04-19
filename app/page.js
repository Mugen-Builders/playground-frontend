"use client";
import styles from "./page.module.css";
import {
  Card,
  Stack,
  Image,
  Heading,
  CardBody,
  Text,
  CardFooter,
  Button,
  extendTheme,
} from "@chakra-ui/react";
import { ChakraProvider } from "@chakra-ui/react";
import injectedModule from "@web3-onboard/injected-wallets";
import { init } from "@web3-onboard/react";
import configFile from "./config.json";
import { Network } from "./network";
import { useState } from "react";
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
export default function Home() {

  const cardui = {};
  return (
    <ChakraProvider class="home-bg">
      <Network />

      <Stack
        width="1000px"
        alignItems="center"
        mt="80px"
        margin={"80px auto auto auto"}
        spacing="0"
      >
        <Card
          direction={{ base: "column", sm: "row" }}
          alignItems="end"
          overflow="hidden"
          variant="outline"
          height={"400px"}
          width="100%"
          backgroundRepeat={"no-repeat"}
          backgroundSize="cover"
          backgroundImage={
            "linear-gradient(180deg, #ffffff00, #000000da), url('https://raw.githubusercontent.com/Mugen-Builders/playground-frontend/main/assets/chapter_images/chapter_0.webp')"
          }
          backgroundPosition="right 50% bottom -50px"
          color="white"
          borderRadius={"0"}
          border="0px solid black"
          margin="0"
        >
          <Stack>
            <CardBody>
              <Heading size="md">Chapter I:</Heading>
              <Text
                py="2"
                fontFamily={"Arial"}
                fontWeight="800"
                fontSize={"48"}
                lineHeight="1.1"
              >
                Enter Cartesia World
              </Text>
            </CardBody>
          </Stack>
        </Card>

        <Card
          direction={{ base: "column", sm: "row" }}
          alignItems="end"
          overflow="hidden"
          variant="outline"
          height={"400px"}
          width="100%"
          backgroundRepeat={"no-repeat"}
          backgroundSize="cover"
          backgroundImage={
            "url('https://github.com/Mugen-Builders/playground-frontend/blob/main/assets/chapter_images/ch_2.png?raw=true')"
          }
          backgroundPosition="right 50% bottom -50px"
          color="white"
          borderRadius={"0"}
          border="0px solid black"
          margin="0"
        >
          <Stack>
            <CardBody>
              <Heading size="md">Chapter II:</Heading>
              <Text
                py="2"
                fontFamily={"Arial"}
                fontWeight="800"
                fontSize={"48"}
                lineHeight="1.1"
              >
                The start of the adventure
              </Text>
            </CardBody>
          </Stack>
        </Card>

        <Card
          direction={{ base: "column", sm: "row" }}
          alignItems="end"
          overflow="hidden"
          variant="outline"
          height={"400px"}
          width="100%"
          backgroundRepeat={"no-repeat"}
          backgroundSize="cover"
          backgroundImage={
            "linear-gradient(180deg, #ffffff00, #000000da), url('https://raw.githubusercontent.com/Mugen-Builders/playground-frontend/main/assets/chapter_images/chapter_2.webp')"
          }
          backgroundPosition="right 50% bottom -50px"
          color="white"
          borderRadius={"0"}
          border="0px solid black"
          margin="0"
        >
          <Stack>
            <CardBody>
              <Heading size="md">Chapter III:</Heading>
              <Text
                py="2"
                fontFamily={"Arial"}
                fontWeight="800"
                fontSize={"48"}
                lineHeight="1.1"
              >
                The hoard, the vault, the prize
              </Text>
            </CardBody>
          </Stack>
        </Card>

        <Card
          direction={{ base: "column", sm: "row" }}
          alignItems="end"
          overflow="hidden"
          variant="outline"
          height={"400px"}
          width="100%"
          backgroundRepeat={"no-repeat"}
          backgroundSize="cover"
          backgroundImage={
            "linear-gradient(180deg, #ffffff00, #000000da), url('https://raw.githubusercontent.com/Mugen-Builders/playground-frontend/main/assets/chapter_images/chapter_3.webp')"
          }
          backgroundPosition="right 50% bottom -50px"
          color="white"
          borderRadius={"0"}
          border="0px solid black"
          margin="0"
        >
          <Stack>
            <CardBody>
              <Heading size="md">Chapter IV:</Heading>
              <Text
                py="2"
                fontFamily={"Arial"}
                fontWeight="800"
                fontSize={"48"}
                lineHeight="1.1"
              >
                Exchanges in the grand bazar
              </Text>
            </CardBody>
          </Stack>
        </Card>

        <Card
          direction={{ base: "column", sm: "row" }}
          alignItems="end"
          overflow="hidden"
          variant="outline"
          height={"400px"}
          width="100%"
          backgroundRepeat={"no-repeat"}
          backgroundSize="cover"
          backgroundImage={
            "linear-gradient(180deg, #ffffff00, #000000da), url('https://raw.githubusercontent.com/Mugen-Builders/playground-frontend/main/assets/chapter_images/chapter_4.webp')"
          }
          backgroundPosition="right 50% bottom -50px"
          color="white"
          borderRadius={"0"}
          border="0px solid black"
          margin="0"
        >
          <Stack>
            <CardBody>
              <Heading size="md">Chapter V:</Heading>
              <Text
                py="2"
                fontFamily={"Arial"}
                fontWeight="800"
                fontSize={"48"}
                lineHeight="1.1"
              >
                Interacting with other worlds
              </Text>
            </CardBody>
          </Stack>
        </Card>
      </Stack>
    </ChakraProvider>
  );
}

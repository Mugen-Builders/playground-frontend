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
import { useRouter } from 'next/navigation';
import { ChakraProvider } from "@chakra-ui/react";

import Navbar from './components/navbar'


export default function Home() {

  const cardui = {};
  const router = useRouter()

  return (
    <ChakraProvider class="home-bg">
      <Navbar />

      <Stack
        width="1000px"
        alignItems="center"
        //mt="80px"
        margin={"10px auto auto auto"}
        spacing="0"
      >
        <Card
          direction={{ base: "column", sm: "row" }}
          alignItems="end"
          overflow="hidden"
          variant="outline"
          height={"520px"}
          width="100%"
          backgroundRepeat={"no-repeat"}
          backgroundSize="cover"
          backgroundImage={
            "linear-gradient(180deg, #ffffff00, #000000da), url('/images/chapters/0.webp')"
          }
          backgroundPosition="right 50% bottom -50px"
          color="white"
          borderRadius={"15px"}
          border="0px solid black"
          margin="5px"
          onClick={() => router.push(`/play?chapter=${0}&step=${0}`)}
          cursor={"pointer"}
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
                Step into Cartesia World
              </Text>
            </CardBody>
          </Stack>
        </Card>

        <Card
          direction={{ base: "column", sm: "row" }}
          alignItems="end"
          overflow="hidden"
          variant="outline"
          height={"520"}
          width="100%"
          backgroundRepeat={"no-repeat"}
          backgroundSize="cover"
          backgroundImage={
            "linear-gradient(180deg, #ffffff00, #000000da), url('/images/chapters/1.webp')"
          }
          backgroundPosition="right 50% bottom -50px"
          color="white"
          borderRadius={"15px"}
          border="0px solid black"
          margin="5px"
          onClick={() => router.push(`/play?chapter=${1}&step=${0}`)}
          cursor={"pointer"}

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
                Set Forth on Your Quest 
              </Text>
            </CardBody>
          </Stack>
        </Card>

        <Card
          direction={{ base: "column", sm: "row" }}
          alignItems="end"
          overflow="hidden"
          variant="outline"
          height={"520px"}
          width="100%"
          backgroundRepeat={"no-repeat"}
          backgroundSize="cover"
          backgroundImage={
            "linear-gradient(180deg, #ffffff00, #000000da), url('/images/chapters/2.webp')"
          }
          backgroundPosition="right 50% bottom -50px"
          color="white"
          borderRadius={"15px"}
          border="0px solid black"
          margin="5px"

          onClick={() => router.push(`/play?chapter=${2}&step=${0}`)}
          cursor={"pointer"}

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
                Conquer the Treasure Trove
              </Text>
            </CardBody>
          </Stack>
        </Card>
      </Stack>
    </ChakraProvider>
  );
}

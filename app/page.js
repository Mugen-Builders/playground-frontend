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
        className="stack-home"
        alignItems="center"
        //mt="80px"
        margin={"10px auto auto auto"}
        spacing="0"
      >
        <Card
          className="stack-card"
          direction={{ base: "column", sm: "row" }}
          alignItems="end"
          overflow="hidden"
          variant="outline"
          width="100%"
          backgroundRepeat={"no-repeat"}
          backgroundSize="cover"
          backgroundImage={
            "linear-gradient(180deg, #ffffff00, #000000da), url('/images/chapters/0.png')"
          }
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
                className="stack-card-text"

              >
                Giving and receiving - Inputs and Outputs
              </Text>
            </CardBody>
          </Stack>
        </Card>
 
        {/* <Card
          className="stack-card"
          direction={{ base: "column", sm: "row" }}
          alignItems="end"
          overflow="hidden"
          variant="outline"
          width="100%"
          backgroundRepeat={"no-repeat"}
          backgroundSize="cover"
          backgroundImage={
            "linear-gradient(180deg, #ffffff00, #000000da), url('/images/chapters/1.png')"
          }
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
                className="stack-card-text"
              >
                Counting - Updating State 
              </Text>
            </CardBody>
          </Stack>
        </Card>

        <Card
          className="stack-card"
          direction={{ base: "column", sm: "row" }}
          alignItems="end"
          overflow="hidden"
          variant="outline"
          width="100%"
          backgroundRepeat={"no-repeat"}
          backgroundSize="cover"
          backgroundImage={
            "linear-gradient(180deg, #ffffff00, #000000da), url('/images/chapters/2.png')"
          }
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
                className="stack-card-text"
                py="2"
                
              >
                Opening Gifts - Dealing with Assets
              </Text>
            </CardBody>
          </Stack>
        </Card>  */}
      </Stack>
    </ChakraProvider>
  );
}

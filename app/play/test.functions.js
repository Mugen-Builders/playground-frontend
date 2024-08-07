import { ethers } from "ethers";
import { assert } from "./assert";

async function test0_0(functionGenerator) {
    let rollup_server = 'localhost:8080'
    const fetch = async (str, body) => {
        return {
            json : ()=> {
                return str
            }
        }
    }

    let functionReference = functionGenerator({fetch, rollup_server })
    let result = await functionReference("0x7b226d657373616765223a202249276d20686572652c20436172746573696121227da")
    assert(result != null, "Nothing was returned")
    assert(result == (rollup_server + "/notice"), "The route does not match. Are the requests to /notice endpoint?")
    return  `Hex: 0x7b226d657373616765223a202249276d20686572652c20436172746573696121227da
        \nBody: {
        "message": "I'm here, Cartesia!"
      }`
}

async function test0_1(functionGenerator) {
    let rollup_server = 'localhost:8080'
    function strToJson(payload) {
        return JSON.parse(payload);
    }
    
    function jsonToStr(jsonString) {
        return JSON.stringify(jsonString);
    }
    
    function hex2str(hex) {
        const hexWithoutPrefix = hex.startsWith('0x') ? hex.substring(2) : hex;
        const typedArray = new Uint8Array(hexWithoutPrefix.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
        return new TextDecoder().decode(typedArray);
    }
    
    function str2hex(str) {
        const bytes = new TextEncoder().encode(str);
        return "0x"+Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    let functionReference = functionGenerator({
        strToJson, 
        jsonToStr,
        hex2str,
        str2hex
    })

    const expected = "0x7b226d657373616765223a2249274d20484552452c20434152544553494121227d"
    let result = await functionReference("0x7b226d657373616765223a202249276d20686572652c20436172746573696121227d")
    assert(result != null, "Nothing was returned")
    assert(result == expected, 
    `expected: ${expected} \n${hex2str(expected)} \n\n 
    received: ${result}, \n${hex2str(result)}`)

    return  `Hex: ${expected} \nBody: { "message": "I'M HERE, CARTESIA!" }`
}

async function test0_2(functionGenerator) {

    function strToJson(payload) {
        return JSON.parse(payload);
    }
    
    function jsonToStr(jsonString) {
        return JSON.stringify(jsonString);
    }
    
    function hex2str(hex) {
        const hexWithoutPrefix = hex.startsWith('0x') ? hex.substring(2) : hex;
        const typedArray = new Uint8Array(hexWithoutPrefix.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
        return new TextDecoder().decode(typedArray);
    }
    
    function str2hex(str) {
        const bytes = new TextEncoder().encode(str);
        return "0x" + Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    let missions = [
        "Kill the dragon",
        "Find a gnome",
        "Make omellete"
    ]

    let functionReference = functionGenerator({
        missions,
        strToJson, 
        jsonToStr,
        hex2str,
        str2hex
    })

    const expected = "0x7b226d697373696f6e73223a5b224b696c6c2074686520647261676f6e222c2246696e64206120676e6f6d65222c224d616b65206f6d656c6c657465225d7d"
    let result = await functionReference()
    assert(result != null, "Nothing was returned")
    assert(result == expected, 
    `expected: ${expected} \n${hex2str(expected)} \n\n 
    received: ${result}, \n${hex2str(result)}`)

    return  `Hex: ${result} \nBody: ${hex2str(result)}`
}

async function test0_3(functionGenerator) {

    function strToJson(payload) {
        return JSON.parse(payload);
    }
    
    function jsonToStr(jsonString) {
        return JSON.stringify(jsonString);
    }
    
    function hex2str(hex) {
        const hexWithoutPrefix = hex.startsWith('0x') ? hex.substring(2) : hex;
        const typedArray = new Uint8Array(hexWithoutPrefix.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
        return new TextDecoder().decode(typedArray);
    }
    
    function str2hex(str) {
        const bytes = new TextEncoder().encode(str);
        return "0x" + Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    let result
    let missions = [
        "Kill the dragon",
        "Find a gnome",
        "Make omellete"
    ]

    let functionReference = functionGenerator({
        strToJson, 
        jsonToStr,
        hex2str,
        str2hex
    })

    
    missions = [
        "Kill the dragon",
        "Find a gnome",
        "Make omellete"
    ]
    const expected = "0x7b226d697373696f6e53656c6563746564223a224b696c6c2074686520647261676f6e227d"
    result = await functionReference({mission: "Kill the dragon"}, missions)
    assert(result != null, "Nothing was returned")
    assert(!missions.includes("Kill the dragon"), "Kill the dragon was not removed from the original list")
    assert(missions.includes("Find a gnome"), `missions list is different from the expected is invalid: ${missions}`)
    assert(missions.includes("Make omellete"), `missions list is different from the expected is invalid: ${missions}`)

    assert(result == expected, 
    `expected: ${expected} \n${hex2str(expected)} \n\n 
    received: ${result}, \n${hex2str(result)}`)

    let r = `Hex: ${result} 
    \nBody: ${hex2str(result)}
    \nInspect payload response: ${str2hex(JSON.stringify(missions))}
    \nDecoded inpect payload: ${JSON.stringify(missions)}`

    missions = [
        "Kill the dragon",
        "Find a gnome",
        "Make omellete"
    ]
    result = await functionReference({mission: "Find a gnome"}, missions)
    assert(result != null, "Nothing was returned")
    assert(missions.includes("Kill the dragon"), "Hidden test not passed, you function is probably not generic")
    assert(!missions.includes("Find a gnome"), `Hidden test not passed, you function is probably not generic`)
    assert(missions.includes("Make omellete"), `Hidden test not passed, you function is probably not generic`)

    missions = [
        "Kill the dragon",
        "Find a gnome",
        "Make omellete"
    ]
    result = await functionReference({mission: "Make omellete"}, missions)
    assert(result != null, "Nothing was returned")
    assert(missions.includes("Kill the dragon"), "Hidden test not passed, you function is probably not generic")
    assert(missions.includes("Find a gnome"), `Hidden test not passed, you function is probably not generic`)
    assert(!missions.includes("Make omellete"), `Hidden test not passed, you function is probably not generic`)


    return  r
}

async function test0_4(functionGenerator) {
    function strToJson(payload) {
        return JSON.parse(payload);
    }
    
    function jsonToStr(jsonString) {
        return JSON.stringify(jsonString);
    }
    
    function hex2str(hex) {
        const hexWithoutPrefix = hex.startsWith('0x') ? hex.substring(2) : hex;
        const typedArray = new Uint8Array(hexWithoutPrefix.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
        return new TextDecoder().decode(typedArray);
    }
    
    function str2hex(str) {
        const bytes = new TextEncoder().encode(str);
        return "0x" + Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    let rollup_server = 'localhost:8080'
    const fetch = async (str, body) => {
        return {
            str, body
        }
    }

    let functionReference = functionGenerator({
        fetch, 
        rollup_server,
        strToJson,
        jsonToStr,
        hex2str,
        str2hex
    })

    let res, url, resBody, resPayload, expected

    res = await functionReference("Invalid route")
    url = res.str
    resBody = res.body    
    expected = "0x496e76616c696420726f757465"

    assert(url != null && resBody != null, "Nothing was returned")
    assert(url == (rollup_server + "/report"), "The route does not match. Are the requests to /report endpoint?")
    resPayload = strToJson(resBody.body).payload
    assert(resPayload == expected, 
        `expected: ${expected} \n${hex2str(expected)} \n\n 
        received: ${strToJson(resBody.body).payload}, \n${hex2str(strToJson(resBody.body).payload)}`)

    res = await functionReference("Mission not found")
    url = res.str
    resBody = res.body
    expected = "0x4d697373696f6e206e6f7420666f756e64"

    assert(url != null && resBody != null, "Nothing was returned")
    assert(url == (rollup_server + "/report"), "The route does not match. Are the requests to /report endpoint?")
    resPayload = strToJson(resBody.body).payload
    assert(resPayload == expected, 
        `expected: ${expected} \n${hex2str(expected)} \n\n 
        received: ${strToJson(resBody.body).payload}, \n${hex2str(strToJson(resBody.body).payload)}`)
    
    return `received: ${strToJson(resBody.body).payload}, \n${hex2str(strToJson(resBody.body).payload)} 
    \n\nCongratulations your report was sent due to an error interpreting that a wrong message was sent`
}


async function test1_2(functionGenerator) {
    function strToJson(payload) {
        return JSON.parse(payload);
    }
    
    function jsonToStr(jsonString) {
        return JSON.stringify(jsonString);
    }
    
    function hex2str(hex) {
        const hexWithoutPrefix = hex.startsWith('0x') ? hex.substring(2) : hex;
        const typedArray = new Uint8Array(hexWithoutPrefix.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
        return new TextDecoder().decode(typedArray);
    }
    
    function str2hex(str) {
        const bytes = new TextEncoder().encode(str);
        return "0x" + Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    let rollup_server = 'localhost:8080'

    function createNotice(a) {
        return a
    }

    const fetch = async (str, body) => {
        return {
            json : ()=> {
                return {str, body}
            }
        }
    }

    let res, url, resBody, resPayload, expected

    let dragonHP = 100
    let functionReference = functionGenerator({
        fetch, 
        rollup_server,
        strToJson,
        jsonToStr,
        hex2str,
        str2hex,
        createNotice,
        dragonHP
    })
    res = await functionReference()
    assert(res == str2hex(jsonToStr({ health: 80 })), 'Dragon not losing 20 health')

    dragonHP = 20
    functionReference = functionGenerator({
        fetch, 
        rollup_server,
        strToJson,
        jsonToStr,
        hex2str,
        str2hex,
        createNotice,
        dragonHP
    })
    res = await functionReference()
    assert(res == str2hex(`Your dragon is dead`), 'Message dragon killed does not show')
}


async function test2_0(functionGenerator) {

    function strToJson(payload) {
        return JSON.parse(payload);
    }
    
    function jsonToStr(jsonString) {
        return JSON.stringify(jsonString);
    }
    
    function hex2str(hex) {
        const hexWithoutPrefix = hex.startsWith('0x') ? hex.substring(2) : hex;
        const typedArray = new Uint8Array(hexWithoutPrefix.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
        return new TextDecoder().decode(typedArray);
    }
    
    function str2hex(str) {
        const bytes = new TextEncoder().encode(str);
        return "0x" + Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    let dragonAssets = [
        "Dragon Claw",
        "Dragon Scale",
        "Dragon Fang"
      ]
    let inventories = {}

    let functionReference = functionGenerator({
        strToJson, 
        jsonToStr,
        hex2str,
        str2hex
    })

    let result = await functionReference("sender", inventories, dragonAssets)
    let inventory = result.inventory


    assert(result != null, "Nothing was returned")
    assert(!dragonAssets.includes("Dragon Claw"), "Dragon still has it's claw")
    assert(!dragonAssets.includes("Dragon Scale"), "Dragon still has it's scale")
    assert(!dragonAssets.includes("Dragon Fang"), "Dragon still has it's fang")

    assert(inventory.includes("Dragon Claw"), `Dragon Claw not in the inventory`)
    assert(inventory.includes("Dragon Scale"), `Dragon Scale not in the invetory`)
    assert(inventory.includes("Dragon Fang"), `Dragon Fang not in the invetory`)

    assert(result.player == "sender", `player id not added on return`)


    return `received: ${jsonToStr(result)}  
    \n\n`
}

async function test2_1(functionGenerator) {

    function strToJson(payload) {
        return JSON.parse(payload);
    }
    
    function jsonToStr(jsonString) {
        return JSON.stringify(jsonString);
    }
    
    function hex2str(hex) {
        const hexWithoutPrefix = hex.startsWith('0x') ? hex.substring(2) : hex;
        const typedArray = new Uint8Array(hexWithoutPrefix.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
        return new TextDecoder().decode(typedArray);
    }
    
    function str2hex(str) {
        const bytes = new TextEncoder().encode(str);
        return "0x" + Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    let inventories = { 
        "sender" : [
            "Dragon Claw",
            "Dragon Scale",
            "Dragon Fang"
        ]
    }
    let wallet = {}

    let functionReference = functionGenerator({
        strToJson, 
        jsonToStr,
        hex2str,
        str2hex
    })

    let result = await functionReference("sender", inventories, wallet)
    let inventory = result.inventory

    let playerAssets = inventories["sender"]
    assert(result != null, "Nothing was returned")
    assert(!playerAssets.includes("Dragon Claw"), "Player still has it's claw")
    assert(!playerAssets.includes("Dragon Scale"), "Player still has it's scale")
    assert(!playerAssets.includes("Dragon Fang"), "Player still has it's fang")
    console.log(wallet)
    assert(wallet["sender"]["gold"] == 150, `Gold does not match`)
  
    assert(result.player == "sender", `player id not added on return`)


    return `received: ${jsonToStr(result)}  
    \n\n`
}

async function test2_2(functionGenerator) {

    function strToJson(payload) {
        return JSON.parse(payload);
    }
    
    function jsonToStr(jsonString) {
        return JSON.stringify(jsonString);
    }
    
    function hex2str(hex) {
        const hexWithoutPrefix = hex.startsWith('0x') ? hex.substring(2) : hex;
        const typedArray = new Uint8Array(hexWithoutPrefix.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
        return new TextDecoder().decode(typedArray);
    }
    
    function str2hex(str) {
        const bytes = new TextEncoder().encode(str);
        return "0x" + Array.from(bytes).map(byte => byte.toString(16).padStart(2, '0')).join('');
    }

    function parseDeposit(payload) {
        return { sender: "_senderWalletAddress" , value: BigInt("00000000000000000100000000000000").toString() }
    }

    let functionReference = functionGenerator({
        strToJson, 
        jsonToStr,
        hex2str,
        str2hex,
        parseDeposit
    })

    let initialWallet = {}
    let result = await functionReference("_senderWalletAddress00000000000000000100000000000000", initialWallet)
    let wallet = result

    assert(result != null, "Nothing was returned")
    assert(wallet["ether"], "ether was not deposited")

    console.log(wallet)
    assert(BigInt(wallet["ether"]) == BigInt("00000000000000000100000000000000"), `Ether does not match`)
  
    assert(result.player == "_senderWalletAddress", `player id not added on return`)


    return `received: ${jsonToStr(wallet)}  
    \n\n`
}

export default {
    test0_0,
    test0_1,
    test0_2,
    test0_3,
    test0_4,
    test1_2,
    test2_0,
    test2_1,
    test2_2


}
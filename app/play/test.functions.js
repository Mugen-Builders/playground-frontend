import { ethers } from "ethers";
import { assert } from "./assert";

// Browser-compatible Buffer polyfill
const Buffer = {
    from: (data, encoding) => {
        if (encoding === 'hex') {
            const hexWithoutPrefix = data.startsWith('0x') ? data.slice(2) : data;
            const bytes = new Uint8Array(hexWithoutPrefix.match(/[\da-f]{2}/gi).map(h => parseInt(h, 16)));
            return {
                toString: (outputEncoding) => {
                    if (outputEncoding === 'hex') {
                        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
                    }
                    // Default to utf8
                    return new TextDecoder().decode(bytes);
                }
            };
        }
        // Handle string input (default encoding is utf8)
        if (typeof data === 'string' || !encoding) {
            const bytes = new TextEncoder().encode(data);
            return {
                toString: (outputEncoding) => {
                    if (outputEncoding === 'hex') {
                        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
                    }
                    // Default to utf8
                    return data;
                }
            };
        }
        return data;
    }
};

function hex2str(hex) {
  return Buffer.from(hex.slice(2), "hex").toString("utf8");
}

function str2hex(str) {
  return "0x" + Buffer.from(str).toString("hex");
}

let rollup_server = 'localhost:8080'
let outputs = []
let print = []

const originalLog = console.log.bind(console)
const customConsole = {
    log: function(...args) {
        print.push(args.map(arg => String(arg)).join(' '))
        originalLog(...args)
    }
}

const fetch = async (str, req) => {
    if (req.method !== "POST" || !req.headers || req.headers["Content-Type"] !== "application/json") {
        throw new Error("Invalid request format");
    }

    let data = JSON.parse(req.body)

    if (!data || !data.payload ) {
        throw new Error("Payload invalid");
    }

    outputs.push({
        type: str.replace(rollup_server + "/", ""), 
        payload: data.payload, 
        decoded: Buffer.from(data.payload.slice(2), "hex").toString("utf8")
    })
    
    return {
        status : 200,
        json : ()=> {
            return data.payload
        }
    }
}

function resetFunctionContext(functionGenerator) {
    rollup_server = 'localhost:8080'
    outputs = []
    print = []

    return functionGenerator({
        outputs, 
        fetch, 
        rollup_server, 
        console: customConsole, 
        Buffer, 
        hex2str, 
        str2hex
    })

}

async function test0_0(rawFunction) {
    let functionWithContext 

    functionWithContext = resetFunctionContext(rawFunction)

    let result

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({payload: "0x54657374636173652031"})
    assert(outputs.length >= 1, "Expected at least one output")
    assert(outputs[0].type == "notice", "Output type mismatch, expected 'notice'")
    assert(outputs[0].payload == "0x54657374636173652031", 
        "Output payload mismatch, check if the output structure is correct. \nReceived: " + outputs[0].decoded)
    assert(result != null, "Nothing was returned")

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({payload: "0x486170707920486f6c69646179732c2045766572796f6e6521"})

    for (let output in outputs) {
        console.log(outputs[output])
    }

    assert(outputs.length >= 1, "Expected at least one output")
    assert(outputs[0].type == "notice", "Output type mismatch, expected 'notice'")
    assert(outputs[0].payload == "0x486170707920486f6c69646179732c2045766572796f6e6521", 
        "Output payload mismatch, check if the output structure is correct. \nReceived: " + outputs[0].decoded)
    assert(result != null, "Nothing was returned")
    return  print.join('\n') + '\n---\n' + outputs.map(o => JSON.stringify(o)).join('\n')// + `\n---\nPayload: 0x486170707920486f6c69646179732045766572796f6e6521\nDecoded: Happy Holidays Everyone!`
}

async function test0_1(rawFunction) {
    let functionWithContext

    functionWithContext = resetFunctionContext(rawFunction)
    
    let result

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({payload: "0x31323334"})
    
    assert(print.some(line => line.includes("1234")), "Expected log message not found, failed during test cases. Make sure to decode the payload before printing.")

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({payload: "0x54657374636173652031"})
    assert(print.some(line => line.includes("Testcase 1")), "Expected log message not found, failed during test cases")

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({payload: "0x486170707920486f6c69646179732c2045766572796f6e6521"})
    assert(print.some(line => line.includes("Happy Holidays, Everyone!")), "Expected log message not found")

    assert(result != null, "Nothing was returned")
    return  print.join('\n') + '\n---\n' + "Test successful"
}

async function test0_2(rawFunction) {
    let functionWithContext
    
    functionWithContext = resetFunctionContext(rawFunction)

    let result

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({payload: "0x54657374636173652031"}) // Testcase 1
    assert(outputs.length >= 1, "Expected at least one output")
    assert(outputs[0].type == "notice", "Output type mismatch, expected 'notice'")
    assert(outputs[0].payload == "0x54696d6520746f2065786368616e676520676966747321", // TESTCASE 1
        "Output payload mismatch, check if the output structure is correct. \nReceived: " + outputs[0].decoded)
    assert(result != null, "Nothing was returned")

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({payload: "0x4772696e6368"}) // Grinch
    assert(outputs.length == 1, "Expected just one message, suposedly a report")
    assert(outputs[0].type == "report", "Output type mismatch, expected 'report'")
    assert(outputs[0].payload == "0x4e696365207472792c204772696e636821", // Nice try, Grinch!
        "Output payload mismatch, check if the output structure is correct. \nReceived: " + outputs[0].decoded)
    assert(result != null, "Nothing was returned")

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({payload: "0x206865206973204772696e6368"}) // he is Grinch
    assert(outputs.length == 1, "Expected just one message, suposedly a report")
    assert(outputs[0].type == "report", "Output type mismatch, expected 'report'")
    assert(outputs[0].payload == "0x4e696365207472792c204772696e636821", // Nice try, Grinch!
        "Output payload mismatch, check if the output structure is correct. \nReceived: " + outputs[0].decoded)
    assert(result != null, "Nothing was returned")

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({payload: "0x486170707920486f6c69646179732c2045766572796f6e6521"})

    assert(outputs.length == 1, "Expected just one message, suposedly a notice")
    assert(outputs[0].type == "notice", "Output type mismatch, expected 'notice'")
    assert(outputs[0].payload == "0x54696d6520746f2065786368616e676520676966747321", // Time to exchange gifts!
        "Output payload mismatch, check if the output structure is correct. \nReceived: " + outputs[0].decoded)
    assert(result != null, "Nothing was returned")
    return  print.join('\n') + '\n---\n' + outputs.map(o => JSON.stringify(o)).join('\n')
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
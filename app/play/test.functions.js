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

function createEtherWithdrawlPayload(userAddress, amountWei) {
  return "0x522f6815" + 
    userAddress.slice(2).padStart(64, '0') + 
    amountWei.toString(16).padStart(64, '0');
}

let rollup_server = 'localhost:8080'
let outputs = []
let print = []
let wei = 1000000000000000000000n; // 1000 ETH initial balance
let destinationAddress = "0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e";


let defaultInput = {
    "metadata" : {
        "msg_sender" : "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266", 
        "epoch_index" : 0, 
        "input_index" : 0, 
        "block_number" : 64, 
        "timestamp" : 1765979863
    }, 
    "payload" : "0x"
}

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

    let out = {
        type: str.replace(rollup_server + "/", ""), 
        payload: data.payload, 
        decoded: Buffer.from(data.payload.slice(2), "hex").toString("utf8")
    }

    if (out.type === "voucher") {
        out.destination = data.destination
        delete out.decoded
    }

    outputs.push(out)
    
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
    wei = 1000000000000000000000n; // 1000 ETH initial balance
    destinationAddress = "0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e";

    return functionGenerator({
        outputs, 
        fetch, 
        rollup_server, 
        console: customConsole, 
        Buffer, 
        hex2str, 
        str2hex,
        createEtherWithdrawlPayload
    })

}

async function test0_0(rawFunction) {
    let functionWithContext 

    functionWithContext = resetFunctionContext(rawFunction)

    let result

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({...defaultInput, payload: "0x54657374636173652031"})
    assert(outputs.length >= 1, "Expected at least one output")
    assert(outputs[0].type == "notice", "Output type mismatch, expected 'notice'")
    assert(outputs[0].payload == "0x54657374636173652031", 
        "Output payload mismatch, check if the output structure is correct. \nReceived: " + outputs[0].decoded)
    assert(result != null, "Nothing was returned")

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({...defaultInput, payload: "0x486170707920486f6c69646179732c2045766572796f6e6521"})

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
    result = await functionWithContext({...defaultInput, payload: "0x31323334"})
    
    assert(print.some(line => line.includes("1234")), "Expected log message not found, failed during test cases. Make sure to decode the payload before printing.")

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({...defaultInput, payload: "0x54657374636173652031"})
    assert(print.some(line => line.includes("Testcase 1")), "Expected log message not found, failed during test cases")

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({...defaultInput, payload: "0x486170707920486f6c69646179732c2045766572796f6e6521"})
    assert(print.some(line => line.includes("Happy Holidays, Everyone!")), "Expected log message not found")

    assert(result != null, "Nothing was returned")
    return  print.join('\n') + '\n---\n' + "Test successful"
}

async function test0_2(rawFunction) {
    let functionWithContext
    
    functionWithContext = resetFunctionContext(rawFunction)

    let result

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({...defaultInput, payload: "0x54657374636173652031"}) // Testcase 1
    assert(outputs.length >= 1, "Expected at least one output")
    assert(outputs[0].type == "notice", "Output type mismatch, expected 'notice'")
    assert(outputs[0].payload == "0x54696d6520746f2065786368616e676520676966747321", // TESTCASE 1
        "Output payload mismatch, check if the output structure is correct. \nReceived: " + outputs[0].decoded)
    assert(result != null, "Nothing was returned")

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({...defaultInput, payload: "0x4772696e6368"}) // Grinch
    assert(outputs.length == 1, "Expected just one message, suposedly a report")
    assert(outputs[0].type == "report", "Output type mismatch, expected 'report'")
    assert(outputs[0].payload == "0x4e696365207472792c204772696e636821", // Nice try, Grinch!
        "Output payload mismatch, check if the output structure is correct. \nReceived: " + outputs[0].decoded)
    assert(result != null, "Nothing was returned")

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({...defaultInput, payload: "0x206865206973204772696e6368"}) // he is Grinch
    assert(outputs.length == 1, "Expected just one message, suposedly a report")
    assert(outputs[0].type == "report", "Output type mismatch, expected 'report'")
    assert(outputs[0].payload == "0x4e696365207472792c204772696e636821", // Nice try, Grinch!
        "Output payload mismatch, check if the output structure is correct. \nReceived: " + outputs[0].decoded)
    assert(result != null, "Nothing was returned")

    functionWithContext = resetFunctionContext(rawFunction)
    result = await functionWithContext({...defaultInput, payload: "0x486170707920486f6c69646179732c2045766572796f6e6521"})

    assert(outputs.length == 1, "Expected just one message, suposedly a notice")
    assert(outputs[0].type == "notice", "Output type mismatch, expected 'notice'")
    assert(outputs[0].payload == "0x54696d6520746f2065786368616e676520676966747321", // Time to exchange gifts!
        "Output payload mismatch, check if the output structure is correct. \nReceived: " + outputs[0].decoded)
    assert(result != null, "Nothing was returned")
    return  print.join('\n') + '\n---\n' + outputs.map(o => JSON.stringify(o)).join('\n')
}

async function test1_0(rawFunction) {
    let gifts = 0

    function resetLocalFunctionContext(functionGenerator) {
        rollup_server = 'localhost:8080'
        outputs = []
        print = []
        gifts = 0

        return functionGenerator({
            outputs, 
            fetch, 
            rollup_server, 
            console: customConsole, 
            Buffer, 
            hex2str, 
            str2hex,
            gifts
        })
    }

    let functionWithContext

    functionWithContext = resetLocalFunctionContext(rawFunction)
    
    let result

    functionWithContext = resetLocalFunctionContext(rawFunction)

    result = await functionWithContext({...defaultInput, payload: "0x"})
    gifts = functionWithContext.getCaptured('gifts')
    console.log(gifts, "outside")
    assert((gifts == 1), "Gifts count did not increment to 1.")
    result = await functionWithContext({...defaultInput, payload: "0x"})
    gifts = functionWithContext.getCaptured('gifts')
    assert((gifts == 2), "Gifts count did not increment to 2.")

    functionWithContext = resetLocalFunctionContext(rawFunction)
    assert((gifts == 0), "Starting value for gifts is not zero.")
    result = await functionWithContext({...defaultInput, payload: "0x"})
    gifts = functionWithContext.getCaptured('gifts')
    result = await functionWithContext({...defaultInput, payload: "0x"})
    gifts = functionWithContext.getCaptured('gifts')
    result = await functionWithContext({...defaultInput, payload: "0x"})
    gifts = functionWithContext.getCaptured('gifts')
    result = await functionWithContext({...defaultInput, payload: "0x"})
    gifts = functionWithContext.getCaptured('gifts')
    assert((gifts == 4), "Gifts count did not increment to 4.")

    functionWithContext = resetLocalFunctionContext(rawFunction)
    assert((gifts == 0), "Starting value for gifts is not zero.")
    result = await functionWithContext({...defaultInput, payload: "0x"})
    gifts = functionWithContext.getCaptured('gifts')
    assert((gifts == 1), "Gifts count did not increment to 1.")

    assert(result != null, "Nothing was returned")

    return  print.join('\n') + '\n---\n' + "Test successful. Gifts collected: " + gifts
}

async function test1_1(rawFunction) {
    let gifts = 0  
    function resetLocalFunctionContext(functionGenerator, gifts) {
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
            str2hex,
            gifts
        })
    }

    let functionWithContext
    let result
    gifts = 0
    functionWithContext = resetLocalFunctionContext(rawFunction, gifts)
    result = await functionWithContext({...defaultInput, payload: "0x"}) 
    assert(outputs.length == 1, "Expected just one message, suposedly a report")
    assert(outputs[0].type == "report", "Output type mismatch, expected 'report'")
    assert(outputs[0].payload == str2hex("0") || outputs[0].payload == str2hex(0),
        "Output payload mismatch, check if the output is the number of gifts. \nReceived: " + outputs[0].decoded)
    

    gifts = 1
    functionWithContext = resetLocalFunctionContext(rawFunction, gifts)
    result = await functionWithContext({...defaultInput, payload: "0x"}) 
    assert(outputs.length == 1, "Expected just one message, suposedly a report")
    assert(outputs[0].type == "report", "Output type mismatch, expected 'report'")
    assert(outputs[0].payload == str2hex("1") || outputs[0].payload == str2hex(1),
        "Output payload mismatch, check if the output is the number of gifts. \nReceived: " + outputs[0].decoded)


    gifts = 3
    functionWithContext = resetLocalFunctionContext(rawFunction, gifts)
    result = await functionWithContext({...defaultInput, payload: "0x"}) 
    assert(outputs.length == 1, "Expected just one message, suposedly a report")
    assert(outputs[0].type == "report", "Output type mismatch, expected 'report'")
    assert(outputs[0].payload == str2hex("3") || outputs[0].payload == str2hex(3), 
        "Output payload mismatch, check if the output is the number of gifts. \nReceived: " + outputs[0].decoded)
    assert(result != null, "Nothing was returned")

    return  print.join('\n') + '\n---\n' + "Test successful. Gifts counted after 3 iterations: " + gifts
}


async function test2_0(rawFunction) {
    let wei = BigInt(0)

    function resetLocalFunctionContext(functionGenerator) {
        rollup_server = 'localhost:8080'
        outputs = []
        print = []
        wei = BigInt(0)

        return functionGenerator({
            outputs, 
            fetch, 
            rollup_server, 
            console: customConsole, 
            Buffer, 
            hex2str, 
            str2hex,
            wei
        })
    }

    const payloadTest = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
    let weiTestHex

    let functionWithContext

    functionWithContext = resetLocalFunctionContext(rawFunction)
    
    let result

    functionWithContext = resetLocalFunctionContext(rawFunction)

    let input = {
        "metadata" : {
            "epoch_index" : 0, 
            "input_index" : 0, 
            "block_number" : 64, 
            "timestamp" : 1765979863
        }, 
        "payload" : "0x"
    }

    input.metadata.msg_sender = "0x0000000000000000000000000000000000000000"
    weiTestHex = "0000000000000000000000000000000000000000000000000000000000000064" // 100
    result = await functionWithContext({...input, payload: payloadTest + weiTestHex})
    wei = functionWithContext.getCaptured('wei')
    assert((wei == BigInt(0)), "wei count incremented to unexpected amount. Make sure to check the msg_sender before adding to wei count.")
    
    functionWithContext = resetLocalFunctionContext(rawFunction)

    weiTestHex = "00000000000000000000000000000000000000000000000000000000000000c8" // 200
    result = await functionWithContext({...input, payload: payloadTest + weiTestHex})
    wei = functionWithContext.getCaptured('wei')
    assert((wei == BigInt(0)), "wei count incremented to unexpected amount. Make sure to check the msg_sender before adding to wei count.")

    functionWithContext = resetLocalFunctionContext(rawFunction)

    input.metadata.msg_sender = "0xFfdbe43d4c855BF7e0f105c400A50857f53AB044"
    weiTestHex = "0000000000000000000000000000000000000000000000000000000000000064"
    result = await functionWithContext({...input, payload: payloadTest + weiTestHex})
    wei = functionWithContext.getCaptured('wei')
    assert((wei == BigInt("0x" + weiTestHex)), "wei count did not increment to expected amount. Make sure to use the value deposited.")
    
    functionWithContext = resetLocalFunctionContext(rawFunction)

    input.metadata.msg_sender = "0xFfdbe43d4c855BF7e0f105c400A50857f53AB044"
    weiTestHex = "00000000000000000000000000000000000000000000000000000000000000c8"
    result = await functionWithContext({...input, payload: payloadTest + weiTestHex})
    wei = functionWithContext.getCaptured('wei')
    assert((wei == BigInt("0x" + weiTestHex)), "wei count did not increment to expected amount. Make sure to use the value deposited.")

    assert(result != null, "Nothing was returned")

    return  print.join('\n') + '\n---\n' + "Test successful. wei deposited in the Application: " + wei
}

async function test2_1(rawFunction) {
    let initialWei = 10000000000000000000n; // 1000 ETH initial balance    
    function resetLocalFunctionContext(functionGenerator) {
        rollup_server = 'localhost:8080'
        outputs = []
        print = []
        wei = 10000000000000000000n;
        destinationAddress = "0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e";

        return functionGenerator({
            outputs, 
            fetch, 
            rollup_server, 
            console: customConsole, 
            Buffer, 
            hex2str, 
            str2hex,
            wei,
            destinationAddress,
            createEtherWithdrawlPayload
        })
    }

    const payloadTest = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
    let weiTestHex

    let functionWithContext

    functionWithContext = resetLocalFunctionContext(rawFunction)
    
    let result

    functionWithContext = resetLocalFunctionContext(rawFunction)

    weiTestHex = "0x0000000000000000000000000000000000000000000000000000000000000064"
    result = await functionWithContext({...defaultInput, payload: weiTestHex})
    wei = functionWithContext.getCaptured('wei')
    assert((wei == BigInt(initialWei) - BigInt(weiTestHex)), "wei count did not decrement to expected amount. Make sure to decode the input, subtract from wei count and send voucher with correct fields.")
    assert(outputs.length >= 1, "Expected at least one output")
    assert(outputs[0].type == "voucher", "Output type mismatch, expected 'voucher'")
    assert(outputs[0].payload == "0x522f6815000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000064", 
        "Output payload mismatch, check if the output structure is correct. \nReceived: " + outputs[0].payload + 
        "\nExpected 0x522f6815000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb922660000000000000000000000000000000000000000000000000000000000000064",)
    assert(outputs[0].destination.toLowerCase() == destinationAddress.toLowerCase(), "Voucher destination address mismatch. Make sure to set the correct destination address in the voucher.")

    functionWithContext = resetLocalFunctionContext(rawFunction)

    weiTestHex = "0x00000000000000000000000000000000000000000000000000000000000000c8"
    result = await functionWithContext({...defaultInput, payload: weiTestHex})
    wei = functionWithContext.getCaptured('wei')
    assert((wei == BigInt(initialWei) - BigInt(weiTestHex)), "wei count did not decrement to expected amount. Make sure to decode the input, subtract from wei count and send voucher with correct fields.")
    assert(outputs[0].payload == "0x522f6815000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000000000c8", 
        "Output payload mismatch, check if the output structure is correct. \nReceived: " + outputs[0].payload + 
        "\nExpected 0x522f6815000000000000000000000000f39fd6e51aad88f6f4ce6ab8827279cfffb9226600000000000000000000000000000000000000000000000000000000000000c8",)
    assert(outputs[0].destination.toLowerCase() == destinationAddress.toLowerCase(), "Voucher destination address mismatch. Make sure to set the correct destination address in the voucher.")

    console.log(outputs)

    assert(result != null, "Nothing was returned")

    return  print.join('\n') + '\n---\n' + "Test successful. wei withdrawn from the Application: " + BigInt(weiTestHex)
}



export default {
    test0_0,
    test0_1,
    test0_2,
    test1_0,
    test1_1,
    test2_0,
    test2_1

}
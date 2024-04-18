import { assert } from "./assert";

let fetch = () => {
    console.log("--- fetch from scope 2 ---")
}

let rollup_server = "--- rollupserver from scope 2 ---"

async function testAdd(functionGenerator) {
    let functionReference = functionGenerator()
    
    assert(functionReference(1,3) == 4, "1,3 should be equal to 4")
    assert(functionReference(10,13) == 23, "10,13 should be equal to 23")
    assert(functionReference(0,0) == 0, "0,0 should be equal to 0")

    console.log("test passed")
}

async function testFetchOverride(functionGenerator) {
    const fetch = async (str, body) => {
        console.log("deu override no fetch")
        console.log(str, body)
        return 1
    }

    let rollup_server = 'http://example5.com'
    let intt = 1
    let functionReference = functionGenerator({fetch, rollup_server, intt })

    console.log("::: test fetch override")
    let a = await functionReference(1,2)
    console.log(a)
    
}
 

export {
    testAdd,
    testFetchOverride
}
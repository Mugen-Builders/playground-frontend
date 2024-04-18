import { assert } from "./assert";

async function testAdd(functionReference) {
    assert(functionReference(1,3) == 4, "1,3 should be equal to 4")
    assert(functionReference(10,13) == 23, "10,13 should be equal to 23")
    assert(functionReference(0,0) == 0, "0,0 should be equal to 0")

    console.log("test passed")
}

async function testFetchOverride(functionReference) {
    var fetch = async (str, body) => {
        console.log("deu override no fetch")
        console.log(str, body)
        return 1
    }
    var rollup_server = "potato"    
    
    assert(await functionReference() == 1, "1,3 should be equal to 4")

    
    

}
 

export {
    testAdd,
    testFetchOverride
}
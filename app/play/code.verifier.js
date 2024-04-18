import { 
    testAdd,
    testFetchOverride
} from "./test.functions";

function executeFunction(functionString) {
    try {
        const fn = new Function('return ' + functionString)();
        fn(3,4)
        console.log(`Result: ${fn(1, 2)}`);  // Example execution with dummy data
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}


function removeNonUsedCode(codeString) {
    const regex = /\/\* Do not change anything above this line \*\/\s*([\s\S]*?)\s*\/\* Do not change anything below this line \*\//;
    const matches = codeString.match(regex);
    const content = matches ? matches[1].trim() : '';
    return content
}

function createDynamicFunction(functionString) {
    console.log(":: Created dynamic function")
    console.log(functionString)

    try {
        const fn = new Function('return ' + functionString)();
        return fn
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
}

async function runTests(functionName, functionReference) {
    console.log(":: Running Tests")

    switch (functionName) {
        case 'add':
            await testAdd(functionReference)
            break;
        case 'fetchOverride':
            await testFetchOverride(functionReference);
            break;
        case 'orange':
            console.log('Orange was chosen.');
            break;
        default:
            console.log('No valid fruit was chosen.');
    }
}

async function test(functionName, fullCodeString) {
    let codeString = removeNonUsedCode(fullCodeString)
    let functionReference = createDynamicFunction(codeString)
    await runTests(functionName, functionReference)
}


export {
    test
}
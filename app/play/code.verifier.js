import testFunctions from "./test.functions";

function executeFunction(functionString) {

    try {
        let fn = new Function('return ' + functionString)();
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

// This returns a function that allows you to override the 
// "existing variables out of the scope" of the function it returns
// let foo = createDynamicFunctionBuilder(functionString)
// will produce a function let bar = foo({wordToOverride : 3})
// this will return a function that executes the script passed
// if the script references a variable out of it's scope it will see the
// value passed on the object
// bar(x,y,z) // regular function script call
function createDynamicFunctionBuilder(functionString) {
    return function(overrides, ...args) {
      let overridesCode = "";
      for (const key in overrides) {
        if (typeof overrides[key] === 'function') {
            overridesCode += `let ${key} = ${overrides[key].toString()};\n`;
        } else {
            overridesCode += `let ${key} = ${JSON.stringify(overrides[key])};\n`;
        }
      }
  
      const fullFunctionCode = overridesCode + "return " + functionString;
  
      try {
        const dynamicFn = eval(`(function() { ${fullFunctionCode} })`);
        return dynamicFn.apply(this, args);
      } catch (error) {
        console.error(`Error executing function: ${error.message}`);
        return null;
      }
    };
  }

async function runTests(functionName, functionReference) {
    console.log(":: Running Tests")
    let testResult
    switch (functionName) {
        case 'test0_0':
            testResult = await testFunctions.test0_0(functionReference)
            break;
        case 'test0_1':
            testResult = await testFunctions.test0_1(functionReference);
            break;
        case 'test0_2':
            testResult = await testFunctions.test0_2(functionReference);
            break;
        case 'test0_3':
            testResult = await testFunctions.test0_3(functionReference);
            break;
        case 'test0_4':
            testResult = await testFunctions.test0_4(functionReference);
            break;
        default:
            console.log('No valid function was chosen.');
    }
    console.log(testResult)
    return testResult
}

async function test(functionName, fullCodeString) {
    let codeString = removeNonUsedCode(fullCodeString)
    let generator = createDynamicFunctionBuilder(codeString)
    let result = await runTests(functionName, generator)
    return result
}

export {
    test
}
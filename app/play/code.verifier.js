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
      const trackedObjects = {};
      const trackedPrimitives = [];
      
      for (const key in overrides) {
        if (typeof overrides[key] === 'function') {
            // Store functions by reference to prevent minification issues
            trackedObjects[key] = overrides[key];
            overridesCode += `let ${key} = this.trackedObjects.${key};\n`;
        } else if (typeof overrides[key] === 'object' && overrides[key] !== null) {
            // Pass objects by reference so mutations are visible outside
            trackedObjects[key] = overrides[key];
            overridesCode += `let ${key} = this.trackedObjects.${key};\n`;
        } else {
            // Track primitive variable names so we can capture their values after execution
            trackedPrimitives.push(key);
            overridesCode += `let ${key} = ${JSON.stringify(overrides[key])};\n`;
        }
      }
  
      // Create storage for captured values outside eval scope
      const capturedStorage = {};
      
      // Create a wrapper that returns a function which captures primitive values after execution
      const captureCode = trackedPrimitives.length > 0 
        ? `Object.assign(__capturedStorage, {${trackedPrimitives.map(k => `${k}`).join(', ')}});`
        : '';
      
      // Pass capturedStorage as a parameter to avoid context issues
      const fullFunctionCode = 
        `const __capturedStorage = arguments[0];\n` +
        `const __trackedObjects = arguments[1];\n` +
        overridesCode.replace(/this\.trackedObjects/g, '__trackedObjects') +
        `const __userFunction = (${functionString});\n` +
        `return async function(...fnArgs) {\n` +
        `  const __result = await __userFunction(...fnArgs);\n` +
        `  ${captureCode}\n` +
        `  return __result;\n` +
        `};`;
  
      try {
        const dynamicFn = new Function(fullFunctionCode);
        const wrappedFunction = dynamicFn(capturedStorage, trackedObjects, ...args);
        
        // Attach getCaptured method to the function itself
        wrappedFunction.getCaptured = (key) => {
          return capturedStorage[key];
        };
        
        return wrappedFunction;
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
        case 'test1_0':
            testResult = await testFunctions.test1_0(functionReference);
            break;
        case 'test1_1':
            testResult = await testFunctions.test1_1(functionReference);
            break;
        case 'test2_0':
            testResult = await testFunctions.test2_0(functionReference);
            break;
        case 'test2_1':
            testResult = await testFunctions.test2_1(functionReference);
            break;
        case 'test2_2':
            testResult = await testFunctions.test2_2(functionReference);
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
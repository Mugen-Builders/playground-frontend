const { ethers } = require("ethers");

const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

function strToJson(payload) {
  return JSON.parse(payload);
}

function jsonToStr(jsonString) {
  return JSON.stringify(jsonString);
}

function hex2str(hex) {
  return ethers.utils.toUtf8String(hex);
}

function str2hex(str) {
  return ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str));
}

async function createNotice(payload) {
  const advance_req = await fetch(rollup_server + "/notice", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
  });
  const json = await advance_req.json();
  return json;
}

async function createReport(decoded_payload) {
  let payload = str2hex(decoded_payload)
  const advance_req = await fetch(rollup_server + "/report", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
  });
  const json = await advance_req.json();
  return json;
}


let inventories = {
  "<playerID>": [
    "Dragon Claw",
    "Dragon Scale",
    "Dragon Fang"
  ]
}

let wallet = {}

function sellAssets(sender, inventory, wallet) { 
  if (!wallet[sender]) {
    wallet[sender] = { gold: 0 }
  }

  inventory[sender].forEach(item => {
    wallet[sender].gold += 50
  })

  inventory[sender] = []

  return {
    player: sender,
    wallet: wallet[sender]
  };
}

function parseDeposit(payload) {
  let senderSlice = ethers.dataSlice(payload, 0, 20);
  let valueSlice = ethers.dataSlice(payload, 20, 52);

  let sender = ethers.utils.getAddress(senderSlice)
  let value = BigInt(valueSlice)

  return {sender, value}
}

/* Do not change anything above this line */

function deposit(payload, wallet) {
  
  let { sender, value } = parseDeposit(payload)

  // TODO: Add here the code to change balance based on deposit
    
  return {
    player: sender,
    wallet: wallet[sender]
  };


};

/* Do not change anything below this line */

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const payload = data["payload"];
  const metadata = data["metadata"];
  const sender = metadata["msg_sender"];

  let responsePayload;
  if (data.metadata.msg_sender.toLowerCase() == "0xFfdbe43d4c855BF7e0f105c400A50857f53AB044".toLowerCase()) {
    deposit(payload, wallet)
    return "accept"
  }

  const { route, args } = strToJson(hex2str(payload));
  if (route === "sellAssets") {
    let salesObject = sellAssets(sender, inventories, goldPrices);
    responsePayload = str2hex(jsonToStr(salesObject));
    await createNotice(responsePayload);
  } else {
    await createReport(jsonToStr({ error: "Invalid route" }));
    return "reject";
  }

  console.log(`Received notice status with body `, JSON.stringify(json));
  return "accept";
}

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
  const payload = data["payload"];
  const endpoint = hex2str(payload);
  let responsePayload
  if (endpoint == "listMissions") {
    responsePayload = listMissions()
  }

  const inspect_req = await fetch(rollup_server + "/report", {
    method: "POST",
    headers: { "Content-Type": "application/json", },
    body: JSON.stringify({ responsePayload }),
  });
  console.log("Received report status " + inspect_req.status);
  return "accept";
}

var handlers = {
  advance_state: handle_advance,
  inspect_state: handle_inspect,
};

var finish = { status: "accept" };

(async () => {
  while (true) {
    console.log("Sending finish");

    const finish_req = await fetch(rollup_server + "/finish", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "accept" }),
    });

    console.log("Received finish status " + finish_req.status);

    if (finish_req.status == 202) {
      console.log("No pending rollup request, trying again");
    } else {
      const rollup_req = await finish_req.json();
      var handler = handlers[rollup_req["request_type"]];
      finish["status"] = await handler(rollup_req["data"]);
    }
  }
})();

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


let dragonAssets = [
  "Dragon Claw",
  "Dragon Scale",
  "Dragon Fang"
]
let inventories = {}

/* Do not change anything above this line */

function lootDragon(sender, inventories, dragonAssets) {
}

/* Do not change anything below this line */


async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  const payload = data["payload"];
  const metadata = data["metadata"]
  const sender = metadata["msg_sender"]
  const { route, args } = strToJson(hex2str(payload));

  let responsePayload;
  if (route === "lootDragon") {
      let lootObject = lootDragon(sender, inventories, dragonAssets);
      responsePayload = str2hex(jsonToStr(lootObject))
  } else {
      await createReport("Invalid route");
      return "reject"
  }

  let json = await createNotice(responsePayload);
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
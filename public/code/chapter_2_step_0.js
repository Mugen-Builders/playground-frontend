const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

function hex2str(hex) {
  return Buffer.from(hex.slice(2), "hex").toString("utf8");
}

function str2hex(str) {
  return "0x" +Buffer.from(str).toString("hex");
}

let eth = 0

/* Do not change anything above this line */

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  
  // Your code logic goes here

  if (data["msg_sender"] == "0xFfdbe43d4c855BF7e0f105c400A50857f53AB044") {
    let userAddress = data["payload"].slice(0, 40);
    let hexAmount = data["payload"].slice(40, 102);
    eth += BigInt(hexAmount);
    console.log("ETH deposited by " + userAddress + ": " + eth.toString());
  }
  
  return "accept";
}

/* Do not change anything below this line */

async function handle_inspect(data) {
  console.log("Received inspect request data " + JSON.stringify(data));
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
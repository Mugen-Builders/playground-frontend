const rollup_server = process.env.ROLLUP_HTTP_SERVER_URL;
console.log("HTTP rollup_server url is " + rollup_server);

function hex2str(hex) {
  return Buffer.from(hex.slice(2), "hex").toString("utf8");
}

function str2hex(str) {
  return "0x" +Buffer.from(str).toString("hex");
}

function createEtherWithdrawlPayload(userAddress, amountWei) {
  return "0x522f6815" + 
    userAddress.slice(2).padStart(64, '0') + 
    amountWei.toString(16).padStart(64, '0');
}

let wei = 1000000000000000000000n; // 1000 ETH initial balance
let destinationAddress = "0xab7528bb862fB57E8A2BCd567a2e929a0Be56a5e";

/* Do not change anything above this line */

async function handle_advance(data) {
  console.log("Received advance request data " + JSON.stringify(data));
  
  // Your code logic goes here
  
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
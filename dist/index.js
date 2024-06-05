"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const PubSubManager_1 = require("./PubSubManager");
// PubSubManager.getInstance().removeUserFromStock( "0.2724017738155271","APPL");
// setInterval(() => {
//     PubSubManager.getInstance().addUserToStock(Math.random().toString(), "APPL");
// }, 5000)
PubSubManager_1.PubSubManager.getInstance().forwardMessageToUser("APPL", "Prices has been biisted by 2.5% in last 2 hours");

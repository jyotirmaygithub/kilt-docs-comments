import { generateAccounts } from "./kiltwallet/generateAccount";
import { generateDid } from "./kiltwallet/generateDid";
import { claimW3N } from "./kiltwallet/claimW3N";
import { verifyDid } from "./kiltwallet/addVerification2Did";
import { issueCredential } from "./kiltwallet/issueCredential";
import { queryW3N } from "./kiltwallet/queryW3N";
import { Balances, KiltAddress, SignerInterface } from "@kiltprotocol/types";

export {generateAccounts, generateDid, claimW3N, verifyDid, issueCredential, queryW3N, Balances, KiltAddress, SignerInterface};
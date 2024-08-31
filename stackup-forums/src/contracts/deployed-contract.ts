import contract from "./Forum.json";
import type { Address } from "viem";
const deployedAddress = process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS as  Address;

const { abi: ABI } = contract;
export { ABI, deployedAddress };
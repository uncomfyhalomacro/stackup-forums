import contract from "./Forum.json";
import type { Address } from "viem";

const deployedAddress = process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? process.env.NEXT_PUBLIC_DEPLOYED_LOCAL_CONTRACT_ADDRESS as Address : process.env.NEXT_PUBLIC_DEPLOYED_CONTRACT_ADDRESS as Address;

// Type inference correctly
const ABI = [...contract.abi] as const;
export { ABI, deployedAddress };
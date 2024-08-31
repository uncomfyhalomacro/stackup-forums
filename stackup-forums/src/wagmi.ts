import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {
	arbitrum,
	arbitrumSepolia,
	base,
	mainnet,
	optimism,
	polygon,
	sepolia,
} from "wagmi/chains";
import { cookieStorage, createStorage } from "wagmi";

const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string;

const config = getDefaultConfig({
	appName: "StackUp Forums",
	projectId: projectId,
	storage: createStorage({
		storage: cookieStorage,
	}),
	chains: [
		mainnet,
		polygon,
		optimism,
		arbitrum,
		base,
		...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true"
			? [sepolia, arbitrumSepolia]
			: []),
	],
	ssr: true,
});

export default config;

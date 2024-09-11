import PostForm from "../../components/PostForm";
import styles from "../../styles/Custom.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

const Forum = () => {
	return (
		<>
			<div className={styles.main}>
				<header>
					<nav>
						<ConnectButton
							label={
								useAccount().isDisconnected ? "Connect Wallet To Post" : ""
							}
						/>
					</nav>
				</header>

				<div>
					<PostForm />
				</div>
			</div>
		</>
	);
};

export default Forum;

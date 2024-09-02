import Posts from "../../components/Posts";
import PostForm from "../../components/PostForm";
import styles from "../../styles/Custom.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import allPosts from "../../components/allPosts";

const Forum = () => {
	return (
		<div className={styles.main}>
			<header>
				<nav>
					<ConnectButton />
				</nav>
			</header>
			<div>
				<PostForm />
			</div>
			<section>
				<Posts posts={allPosts()} />
			</section>
		</div>
	);
};

export default Forum;

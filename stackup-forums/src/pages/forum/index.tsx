import config from "../../wagmi";
import { getAccount, readContract } from "@wagmi/core";
import { deployedAddress, ABI } from "../../contracts/deployed-contract";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import Posts from "../../components/Posts";
import type { PostDetails } from "../../types/posts/types";
import PostForm from "../../components/PostForm";
import styles from "../../styles/Custom.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Forum = () => {
	const {
		isLoading,
		data: postIdIncrement,
	}: { isLoading: boolean; data: bigint | undefined } = useReadContract({
		abi: ABI,
		address: deployedAddress,
		functionName: "postIdIncrement",
	});
	const [posts, setPosts] = useState<PostDetails[]>([]);

	useEffect(() => {
		const fetchPosts = async () => {
			const posts: Promise<PostDetails | undefined>[] = [];
			const binding = postIdIncrement as bigint;
			// the first post was already initialised with 0x000000000
			for (let i = 1; i < binding; i++) {
				const post: Promise<PostDetails | undefined> = readContract(config, {
					abi: ABI,
					address: deployedAddress,
					functionName: "getPost",
					args: [i],
					account: getAccount(config).address,
				}) as Promise<PostDetails | undefined>;

				posts.push(post);
			}
			Promise.all(posts).then((values) => {
				const binding = values as PostDetails[];
				setPosts(binding);
			});
		};
		if (!isLoading) {
			fetchPosts();
		}
	}, [isLoading, postIdIncrement]);

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
				<Posts posts={posts} />
			</section>
		</div>
	);
};

export default Forum;

import { useReadContract } from "wagmi";
import { ABI, deployedAddress } from "../../contracts/deployed-contract";
import { useEffect, useState } from "react";
import type { PostDetails } from "../../types/posts/types";
import styles from "../../styles/Custom.module.css";
import { getAccount, readContract } from "@wagmi/core";
import config from "../../wagmi";
import Comments from "../../components/Comments";
import Link from "next/link";

const AllComments = () => {
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
		if (postIdIncrement === undefined) {
			return;
		}
		const fetchPosts = async () => {
			const posts: Promise<PostDetails | undefined>[] = [];
			// the first post was already initialised with 0x000000000
			for (let i = 1; i < postIdIncrement; i++) {
				const post: Promise<PostDetails | undefined> = readContract(config, {
					abi: ABI,
					address: deployedAddress,
					functionName: "getPost",
					args: [Number(i)],
					account: getAccount(config).address,
				}) as Promise<PostDetails | undefined>;

				posts.push(post);
			}
			Promise.all(posts).then((values) => {
				const binding = values.filter((post): post is PostDetails => !!post);
				setPosts(binding);
			});
		};
		if (!isLoading) {
			fetchPosts();
		}
	}, [isLoading, postIdIncrement]);

	return (
		<div className={styles.main}>
			{!isLoading ? (
				<>
					<h3>
						<Link href="/forum">Go back to forum</Link>
					</h3>
					{posts.map((post) => (
						<>
							<Comments key={post.id} post={post} />
						</>
					))}
				</>
			) : (
				<>
					<h3>
						<Link href="/forum">Go back to forum</Link>
					</h3>
					<h4>Loading comments....</h4>
				</>
			)}
		</div>
	);
};

export default AllComments;

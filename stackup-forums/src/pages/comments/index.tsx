import { readContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import { ABI, deployedAddress } from "../../contracts/deployed-contract";
import type { PostDetails } from "../../types/posts/types";
import config from "../../wagmi";
import Comments from "../../components/Comments";

import styles from "../../styles/Custom.module.css";
import Link from "next/link";

const AllComments = () => {
	const {
		data: postIdIncrement,
		isLoading,
	}: { data: bigint | undefined; isLoading: boolean } = useReadContract({
		abi: ABI,
		address: deployedAddress,
		functionName: "postIdIncrement",
		args: [],
	});

	const [allThePosts, setAllThePosts] = useState<PostDetails[]>([]);

	useEffect(() => {
		if (postIdIncrement === undefined) {
			return;
		}
		const fetchAllPosts = async () => {
			const binding: PostDetails[] = [];
			for (let i = 1; i < postIdIncrement; i++) {
				const comment: PostDetails = (await readContract(config, {
					abi: ABI,
					address: deployedAddress,
					functionName: "getPost",
					args: [i],
				})) as PostDetails;
				binding.push(comment);
			}
			setAllThePosts(binding);
		};
		if (!isLoading) {
			fetchAllPosts();
		}
	}, [isLoading, postIdIncrement]);

	return (
		<>
			{postIdIncrement !== undefined && (
				<div className={styles.main}>
					<h3>
						<Link href="/forum">Go back to forum</Link>
					</h3>
					{allThePosts.map((post) => (
						<>
							<Comments key={post.id} post={post} />
						</>
					))}
				</div>
			)}
		</>
	);
};

export default AllComments;

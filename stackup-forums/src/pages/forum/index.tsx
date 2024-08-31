import config from "../../wagmi";
import { getAccount, readContract } from "@wagmi/core";
import { deployedAddress, ABI } from "../../contracts/deployed-contract";
import { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import Posts from "../../components/Posts";
import type { PostDetails } from "../../types/posts/types";

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
			const posts: PostDetails[] = [];
			const binding = postIdIncrement as bigint;
			for (let i = 0; i < binding; ++i) {
				const post: PostDetails = (await readContract(config, {
					abi: ABI,
					address: deployedAddress,
					functionName: "getPost",
					args: [i],
					account: getAccount(config).address,
				})) as PostDetails;

				posts.push(post);
			}
			setPosts(posts);
		};
		if (!isLoading) {
			fetchPosts();
		}
	}, [isLoading, postIdIncrement]);

	return (
		<div>
			<section>
				<Posts posts={posts} />
			</section>
		</div>
	);
};

export default Forum;

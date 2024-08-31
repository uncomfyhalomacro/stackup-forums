import { useRouter } from "next/router";
import { ABI, deployedAddress } from "../../contracts/deployed-contract";
import type { PostDetails } from "../../types/posts/types";
import { useEffect, useState } from "react";
import ShareablePostComponent from "../../components/ShareablePostComponent";
import Comments from "../../components/Comments";
import type { ParsedUrlQuery } from "node:querystring";
import type { Address } from "viem";
import { getAccount, readContract } from "@wagmi/core";
import config from "../../wagmi";
import Link from "next/link";
import CommentForm from "../../components/CommentForm";

export interface PostIdParams extends ParsedUrlQuery {
	id?: string;
}

export default function Post() {
	const router = useRouter();
	const { id: postId } = router.query as PostIdParams;
	const initialiser: PostDetails = {
		id: BigInt(0),
		title: "",
		owner: getAccount(config).address as Address,
		description: "",
		spoiler: false,
		likes: BigInt(0),
		timestamp: BigInt(0),
	};
	const [postDetails, setPostDetails] = useState<PostDetails>(initialiser);

	useEffect(() => {
		if (!postId) {
			return;
		}
		const fetchDetails = async () => {
			const postDetails: PostDetails = (await readContract(config, {
				address: deployedAddress,
				functionName: "getPost",
				args: [Number.parseInt(postId.trim(), 10)],
				abi: ABI,
			})) as PostDetails;
			setPostDetails(postDetails);
		};

		fetchDetails();
	}, [postId]);

	return (
		<>
			{postId !== undefined && (
				<>
					<ShareablePostComponent post={postDetails} />
					<CommentForm postId={postDetails.id} />
					<Link href="/forum">Go back to forum.</Link>
					<section title="comments-section">
						<Comments post={postDetails} />
					</section>
				</>
			)}
		</>
	);
}

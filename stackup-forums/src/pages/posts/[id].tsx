import { useRouter } from "next/router";
import { ABI, deployedAddress } from "../../contracts/deployed-contract";
import type { PostDetails } from "../../types/posts/types";
import { useEffect, useState } from "react";
import ShareablePostComponent from "../../components/ShareablePostComponent";
import Comments from "../../components/Comments";
import type { ParsedUrlQuery } from "node:querystring";
import { readContract } from "@wagmi/core";
import config from "../../wagmi";
import Link from "next/link";
import CommentForm from "../../components/CommentForm";
import Poll from "../../components/Poll";

export interface PostIdParams extends ParsedUrlQuery {
	id?: string;
}

export default function Post() {
	const router = useRouter();
	const { id: postId } = router.query as PostIdParams;
	const [postDetails, setPostDetails] = useState<PostDetails>();

	useEffect(() => {
		if (!postId) {
			return;
		}
		const fetchDetails = async () => {
			const postDetails: PostDetails | unknown | undefined = await readContract(
				config,
				{
					address: deployedAddress,
					functionName: "getPost",
					args: [Number.parseInt(postId.trim(), 10)],
					abi: ABI,
				},
			);

			if (postDetails) {
				setPostDetails(postDetails as PostDetails);
			}
		};

		fetchDetails();
	}, [postId]);

	return (
		<>
			{postDetails && (
				<>
					<ShareablePostComponent post={postDetails} />
					<Poll postId={postDetails.id} />
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

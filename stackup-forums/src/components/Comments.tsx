import { useEffect, useState } from "react";
import { ABI, deployedAddress } from "../contracts/deployed-contract";
import type { CommentDetails, PostDetails } from "../types/posts/types";
import { useReadContract } from "wagmi";
import { readContract } from "wagmi/actions";
import config from "../wagmi";
import Link from "next/link";
import VoteCommentStubs from "./VoteCommentStubs";
import styles from "../styles/Custom.module.css";

const ShareableCommentComponent = ({
	comment,
	post,
}: { comment: CommentDetails; post: PostDetails }) => {
	return (
		<article key={comment.id} className={styles.cardPlain}>
			<h2>
				{comment.title} on{" "}
				<Link href={`/posts/${post.id.toString()}`}>{post.title}</Link>
			</h2>
			<h3>
				from <span className={styles.address}>{comment.owner}</span>
			</h3>
			<p>{comment.description}</p>
			<VoteCommentStubs
				likes={comment.likes}
				key={comment.id}
				commentId={comment.id}
			/>
		</article>
	);
};

const Comments = ({ post }: { post: PostDetails }) => {
	const {
		data: postToCommentIds,
		isLoading,
	}: { data: bigint[] | undefined; isLoading: boolean } = useReadContract({
		abi: ABI,
		address: deployedAddress,
		functionName: "getCommentsFromPost",
		args: [Number(post.id)],
	});

	const [comments, setComments] = useState<CommentDetails[]>([]);

	useEffect(() => {
		if (!postToCommentIds) {
			return;
		}
		const fetchCommentsFromCommentIds = async () => {
			const comments: CommentDetails[] = [];
			const binding = postToCommentIds as bigint[];
			for await (const commentId of binding) {
				const comment: CommentDetails = (await readContract(config, {
					abi: ABI,
					address: deployedAddress,
					functionName: "getComment",
					args: [commentId],
				})) as CommentDetails;

				comments.push(comment);
			}
			setComments(comments);
		};

		if (!isLoading) {
			fetchCommentsFromCommentIds();
		}
	}, [isLoading, postToCommentIds]);

	return (
		<>
			{comments?.map((comment) => (
				<ShareableCommentComponent
					comment={comment}
					post={post}
					key={comment.id}
				/>
			))}
		</>
	);
};

export default Comments;

import { useWriteContract } from "wagmi";
import type { CommentDetails } from "../types/posts/types";
import { useEffect, useState } from "react";
import { getAccount } from "@wagmi/core";
import config from "../wagmi";
import type { Address } from "viem";
import { ABI, deployedAddress } from "../contracts/deployed-contract";

const CommentForm = ({ postId }: { postId: bigint }) => {
	// This is okay for now??? I don't like that we have an initialiser
	// TODO: investigate if our field should also be optional nullable types.
	const initialiser: CommentDetails = {
		id: BigInt(0),
		title: "",
		owner: getAccount(config).address as Address,
		description: "",
		spoiler: false,
		likes: BigInt(0),
		timestamp: BigInt(0),
	};
	const [comment, setComment] = useState<CommentDetails>(initialiser);
	const { writeContract, isPending, isSuccess, isError } = useWriteContract();

	useEffect(() => {
		if (isSuccess) {
			alert("Successfully commented on post");
		}
		if (isError) {
			alert("Failed to comment on post");
		}
	})

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				writeContract({
					abi: ABI,
					address: deployedAddress,
					functionName: "createComment",
					args: [postId, comment.title, comment.description, comment.spoiler],
				});
			}}
		>
			<h1>Comment something wonderful!</h1>
			<input
				type="text"
				name="comment-title"
				placeholder="Comment title"
				onChange={(e) => setComment({ ...comment, title: e.target.value })}
				required
			/>
			<textarea
				rows={5}
				name="comment-description"
				placeholder="What's on your mind?"
				onChange={(e) =>
					setComment({ ...comment, description: e.target.value })
				}
			/>
			<label htmlFor="spoiler">
				Spoil or not to spoil
				<input
					onChange={(e) =>
						setComment({ ...comment, spoiler: e.target.value === "on" })
					}
					type="checkbox"
					name="comment-spoiler"
					defaultChecked={false}
				/>
			</label>
			<button type="submit">
				{isPending ? "Submitting..." : "Submit comment"}
			</button>
			{isSuccess && <p>Successfully commented</p>}
			{isError && <p>Failed to comment on post</p>}
		</form>
	);
};

export default CommentForm;

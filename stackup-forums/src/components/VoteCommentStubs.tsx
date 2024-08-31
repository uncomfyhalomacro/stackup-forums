import config from "../wagmi";
import { useState } from "react";
import {
	simulateContract,
	writeContract,
	waitForTransactionReceipt,
	readContract,
} from "wagmi/actions";
import { deployedAddress, ABI } from "../contracts/deployed-contract";
import type { CommentDetails } from "../types/posts/types";

const VoteCommentStubs = ({
	commentId,
	likes,
}: { commentId: bigint; likes: bigint }) => {
	const [likeCounter, setLikeCounter] = useState(likes);

	const handleUpvote = async () => {
		const { result } = await simulateContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: "upVoteComment",
			args: [commentId],
		});

		console.log(result);

		const upvoteTxHash = await writeContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: "upVoteComment",
			args: [commentId],
		});

		const transaction = await waitForTransactionReceipt(config, {
			hash: upvoteTxHash,
		});

		if (transaction.status === "reverted") {
			alert(
				"Upvoting Comment failed! Transaction was reverted due to an error!",
			);
			return;
		}

		const comment: CommentDetails = (await readContract(config, {
			abi: ABI,
			address: deployedAddress,
			functionName: "getComment",
			args: [commentId],
		})) as CommentDetails;

		setLikeCounter(comment.likes);
	};

	const handleDownVote = async () => {
		const { result } = await simulateContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: "downVoteComment",
			args: [commentId],
		});

		console.log(result);

		const downvoteTxHash = await writeContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: "downVoteComment",
			args: [commentId],
		});

		const transaction = await waitForTransactionReceipt(config, {
			hash: downvoteTxHash,
		});

		if (transaction.status === "reverted") {
			alert(
				"Downvoting Comment failed! Transaction was reverted due to an error!",
			);
			return;
		}

		const comment: CommentDetails = (await readContract(config, {
			abi: ABI,
			address: deployedAddress,
			functionName: "getComment",
			args: [commentId],
		})) as CommentDetails;

		setLikeCounter(comment.likes);
	};

	return (
		<>
			<div
				style={{
					display: "inline-block",
				}}
			>
				Number of upvotes {likeCounter.toString()}{" "}
				<button type="button" onClick={handleUpvote}>
					⏫
				</button>
				<button type="button" onClick={handleDownVote}>
					⏬
				</button>
			</div>
		</>
	);
};

export default VoteCommentStubs;

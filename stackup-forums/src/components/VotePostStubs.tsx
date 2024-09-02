import config from "../wagmi";
import { useState } from "react";
import {
	simulateContract,
	writeContract,
	waitForTransactionReceipt,
	readContract,
} from "wagmi/actions";
import { deployedAddress, ABI } from "../contracts/deployed-contract";
import type { PostDetails } from "../types/posts/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faLongArrowDown,
	faLongArrowUp,
} from "@fortawesome/free-solid-svg-icons";

const VotePostStubs = ({
	postId,
	likes,
}: { postId: bigint; likes: bigint }) => {
	const [likeCounter, setLikeCounter] = useState(likes);

	const handleUpvote = async () => {
		const { result } = await simulateContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: "upVotePost",
			args: [postId],
		});

		console.log(result);

		const upvoteTxHash = await writeContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: "upVotePost",
			args: [postId],
		});

		const transaction = await waitForTransactionReceipt(config, {
			hash: upvoteTxHash,
		});

		if (transaction.status === "reverted") {
			alert("Upvoting post failed! Transaction was reverted due to an error!");
			return;
		}

		const post: PostDetails = (await readContract(config, {
			abi: ABI,
			address: deployedAddress,
			functionName: "getPost",
			args: [postId],
		})) as PostDetails;

		setLikeCounter(post.likes);
	};

	const handleDownVote = async () => {
		const { result } = await simulateContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: "downVotePost",
			args: [postId],
		});

		console.log(result);

		const downvoteTxHash = await writeContract(config, {
			address: deployedAddress,
			abi: ABI,
			functionName: "downVotePost",
			args: [postId],
		});

		const transaction = await waitForTransactionReceipt(config, {
			hash: downvoteTxHash,
		});

		if (transaction.status === "reverted") {
			alert(
				"Downvoting post failed! Transaction was reverted due to an error!",
			);
			return;
		}

		const post: PostDetails = (await readContract(config, {
			abi: ABI,
			address: deployedAddress,
			functionName: "getPost",
			args: [postId],
		})) as PostDetails;

		setLikeCounter(post.likes);
	};

	return (
		<>
			<div
				style={{
					display: "inline-block",
				}}
			>
				<button type="button" onClick={handleUpvote}>
					<FontAwesomeIcon icon={faLongArrowUp} /> {likeCounter.toString()}
				</button>
				<button type="button" onClick={handleDownVote}>
					<FontAwesomeIcon icon={faLongArrowDown} />
				</button>
			</div>
		</>
	);
};

export default VotePostStubs;

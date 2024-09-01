import { useReadContract, useWriteContract } from "wagmi";
import type { PollAllDetails } from "../types/posts/types";
import { ABI, deployedAddress } from "../contracts/deployed-contract";
import { useEffect, useState } from "react";

const Poll = ({ postId }: { postId: bigint }) => {
	const {
		data: poll,
		isLoading,
	}: { data: PollAllDetails | undefined; isLoading: boolean } = useReadContract(
		{
			abi: ABI,
			address: deployedAddress,
			functionName: "getPollFromPost",
			args: [postId],
		},
	);

	const pollInitialiser: PollAllDetails = {
		id: BigInt(0),
		question: "",
		option1: "",
		option2: "",
		option1Counter: BigInt(0),
		option2Counter: BigInt(0),
	};

	const [pollDetails, setPollDetails] =
		useState<PollAllDetails>(pollInitialiser);

	const {
		writeContract: votingOption1,
		isPending: isPendingOption1,
		isSuccess: isSuccess1,
	} = useWriteContract();
	const {
		writeContract: votingOption2,
		isPending: isPendingOption2,
		isSuccess: isSuccess2,
	} = useWriteContract();

	useEffect(() => {
		if (!isLoading) {
			const binding = poll as PollAllDetails;
			setPollDetails(binding);
		}
		if (isSuccess1 || isSuccess2) {
			alert("Successfully submitted your vote!");
			window.location.reload();
		}
	});

	return (
		<div>
			{pollDetails !== undefined && (
				<>
					<h1>Poll: {pollDetails?.question}</h1>
					{isSuccess1 && <h2>Successfully voted on {pollDetails?.option1}</h2>}
					{isSuccess2 && <h2>Successfully voted on {pollDetails?.option2}</h2>}
					<button
						type="button"
						onClick={() => {
							votingOption1({
								abi: ABI,
								address: deployedAddress,
								functionName: "upVotePollOption",
								args: [postId, pollDetails?.option1.trim()],
							});
						}}
					>
						{pollDetails?.option1}:{isPendingOption1 ? "Voting..." : ""}
						{pollDetails?.option1Counter.toString()}
					</button>
					<button
						type="button"
						onClick={() => {
							votingOption2({
								abi: ABI,
								address: deployedAddress,
								functionName: "upVotePollOption",
								args: [postId, pollDetails?.option2.trim()],
							});
						}}
					>
						{pollDetails?.option2}:{isPendingOption2 ? "Voting..." : ""}
						{pollDetails?.option2Counter.toString()}
					</button>
				</>
			)}
		</div>
	);
};

export default Poll;

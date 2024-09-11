import { useWriteContract } from "wagmi";
import type { PollAllDetails } from "../types/posts/types";
import { ABI, deployedAddress } from "../contracts/deployed-contract";
import { useEffect, useState } from "react";
import styles from "../styles/Custom.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpLong } from "@fortawesome/free-solid-svg-icons";
import { readContract } from "@wagmi/core";
import config from "../wagmi";

const Poll = ({ postId }: { postId: bigint }) => {
	const [pollDetails, setPollDetails] = useState<PollAllDetails | undefined>();

	const { writeContract: votingOption1, isPending: isPendingOption1 } =
		useWriteContract();
	const { writeContract: votingOption2, isPending: isPendingOption2 } =
		useWriteContract();

	const fetchUpdatedPoll = async () => {
		const newPoll = (await readContract(config, {
			abi: ABI,
			address: deployedAddress,
			functionName: "getPollFromPost",
			args: [Number(postId)],
		})) as PollAllDetails | undefined;
		if (newPoll !== undefined) {
			setPollDetails(newPoll);
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: Lint is wrong. This causes an infinite useEffect loop
	useEffect(() => {
		if (!isPendingOption1) {
			fetchUpdatedPoll();
			console.log("Updating???");
		}
	}, [isPendingOption1]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Lint is wrong. This causes an infinite useEffect loop
	useEffect(() => {
		if (!isPendingOption2) {
			fetchUpdatedPoll();
			console.log("Updating???");
		}
	}, [isPendingOption2]);

	return (
		<>
			{pollDetails?.id && (
				<div className={styles.card}>
					<div className={styles.form}>
						<h1>Here is the poll: {pollDetails?.question}</h1>
						<button
							className={styles.pollButton}
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
							{isPendingOption1 ? (
								<>Voting... {pollDetails?.option1}</>
							) : (
								<>
									<FontAwesomeIcon icon={faArrowUpLong} />{" "}
									{pollDetails?.option1}
								</>
							)}
							{": "}
							{pollDetails?.option1Counter.toString()}
						</button>
						<button
							className={styles.pollButton}
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
							{isPendingOption2 ? (
								<>Voting... {pollDetails?.option2}</>
							) : (
								<>
									<FontAwesomeIcon icon={faArrowUpLong} />{" "}
									{pollDetails?.option2}
								</>
							)}
							{": "}
							{pollDetails?.option2Counter.toString()}
						</button>
					</div>
				</div>
			)}
		</>
	);
};

export default Poll;

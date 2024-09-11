import { useRouter } from "next/router";
import { ABI, deployedAddress } from "../../contracts/deployed-contract";
import type { CommentDetails, PostDetails } from "../../types/posts/types";
import { useEffect, useState } from "react";
import ShareablePostComponent from "../../components/ShareablePostComponent";
import Comments from "../../components/Comments";
import type { ParsedUrlQuery } from "node:querystring";
import { getAccount, readContract } from "@wagmi/core";
import config from "../../wagmi";
import Link from "next/link";
import Poll from "../../components/Poll";
import styles from "../../styles/Custom.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useWriteContract } from "wagmi";
import type { Address } from "viem";
import { faPencil, faWarning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface PostIdParams extends ParsedUrlQuery {
	id?: string;
}

export default function Post() {
	const router = useRouter();
	const account = getAccount(config);
	const { id: postId } = router.query as PostIdParams;
	const [postDetails, setPostDetails] = useState<PostDetails | undefined>();
	const { writeContract, isPending, isSuccess, isError } = useWriteContract();

	// This is okay for now??? I don't like that we have an initialiser
	// TODO: investigate if our field should also be optional nullable types.
	const initialiser: CommentDetails = {
		id: BigInt(0),
		title: "",
		owner: account.address as Address,
		description: "",
		spoiler: false,
		likes: BigInt(0),
		timestamp: BigInt(0),
	};
	const [comment, setComment] = useState<CommentDetails>(initialiser);

	useEffect(() => {
		if (postId === undefined) {
			return;
		}
		const fetchDetails = async () => {
			const postDetails: PostDetails | undefined | unknown = await readContract(
				config,
				{
					address: deployedAddress,
					functionName: "getPost",
					args: [Number.parseInt(postId.trim(), 10)],
					abi: ABI,
				},
			);

			if (postDetails !== undefined) {
				setPostDetails(postDetails as PostDetails);
			}
		};

		if (isSuccess) {
			alert("Successfully commented on post");
			fetchDetails();
		}
		if (isError) {
			alert("Failed to comment on post");
		}
		if (!isPending) {
			fetchDetails();
		}
	}, [postId, isSuccess, isError, isPending]);

	return (
		<>
			{postDetails?.id && (
				<div className={styles.main}>
					<ConnectButton />
					<h3>
						<Link href="/forum">Go back to forum</Link>{" "}
						<Link href={"/comments"}>See all comments</Link>
					</h3>
					<ShareablePostComponent post={postDetails} />
					<Poll postId={postDetails.id} />
					<div className={styles.card}>
						{account.isConnected ? (
							<form
								className={styles.form}
								onSubmit={(e) => {
									e.preventDefault();
									if (!comment.title.trim() || !comment.description.trim()) {
										alert("Empty title or description not allowed.");
										return;
									}
									writeContract({
										abi: ABI,
										address: deployedAddress,
										functionName: "createComment",
										args: [
											postDetails.id,
											comment.title,
											comment.description,
											comment.spoiler,
										],
									});
									setComment(initialiser);
								}}
							>
								<h1>Comment something wonderful!</h1>
								<input
									type="text"
									name="comment-title"
									placeholder="Comment title"
									value={comment.title}
									onChange={(e) =>
										setComment({ ...comment, title: e.target.value })
									}
									required
								/>
								<textarea
									rows={5}
									name="comment-description"
									placeholder="What's on your mind?"
									value={comment.description}
									onChange={(e) =>
										setComment({ ...comment, description: e.target.value })
									}
								/>
								<div className={styles.secondary}>
									<label htmlFor="spoiler">
										<button
											type="button"
											onClick={() =>
												setComment({ ...comment, spoiler: !comment.spoiler })
											}
										>
											<FontAwesomeIcon
												icon={faWarning}
												color={!comment.spoiler ? "#359AECff" : "#FF5D64ff"}
											/>{" "}
											Spoiler
										</button>
									</label>
									<button type="submit" className={styles.submit}>
										<FontAwesomeIcon
											icon={faPencil}
											color={!isPending ? "#359AECff" : "#FF5D64ff"}
										/>{" "}
										{isPending ? "Submitting..." : "Submit comment"}
									</button>
									{isSuccess && <p>Successfully commented</p>}
									{isError && <p>Failed to comment on post</p>}
								</div>
							</form>
						) : (
							<h3>You must sign in to comment</h3>
						)}
					</div>
					<h3>⇓⇓⇓ Comments ⇓⇓⇓</h3>
					<Comments post={postDetails} />
				</div>
			)}
		</>
	);
}

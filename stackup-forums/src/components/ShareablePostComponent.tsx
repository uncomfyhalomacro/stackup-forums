import Link from "next/link";
import VotePostStubs from "./VotePostStubs";
import type { PostDetails } from "../types/posts/types";
import styles from "../styles/Custom.module.css";

const ShareablePostComponent = ({ post }: { post: PostDetails }) => {
	return (
		<article key={post.id} className={styles.card}>
			<Link href={`/posts/${encodeURIComponent(post.id.toString())}`}>
				<h2>{post.title}</h2>
			</Link>
			<h3>
				from <span className={styles.address}>{post.owner}</span>
			</h3>
			<div className={styles.description}>
				<p>{post.description}</p>
			</div>
			<VotePostStubs postId={post.id} likes={post.likes} key={post.id} />
		</article>
	);
};

export default ShareablePostComponent;

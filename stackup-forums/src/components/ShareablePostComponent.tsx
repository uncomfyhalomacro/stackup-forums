import Link from "next/link";
import VotePostStubs from "./VotePostStubs";
import type { PostDetails } from "../types/posts/types";

const ShareablePostComponent = ({ post }: { post: PostDetails }) => {
	return (
		<article key={post.id}>
			<Link href={`/posts/${encodeURIComponent(post.id.toString())}`}>
				<h2>{post.title}</h2>
			</Link>
			<h3>from `{post.owner}`</h3>
			<p>{post.description}</p>
			<VotePostStubs postId={post.id} likes={post.likes} key={post.id} />
		</article>
	);
};

export default ShareablePostComponent;

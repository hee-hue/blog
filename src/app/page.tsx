import { PostList } from "@/components/post-list";
import { getAllTags, getPublishedPosts } from "@/lib/mock-posts";
import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">{SITE.name}</h1>
        <p className="mt-3 text-muted-foreground">{SITE.description}</p>
      </section>
      <PostList posts={getPublishedPosts()} tags={getAllTags()} />
    </>
  );
}

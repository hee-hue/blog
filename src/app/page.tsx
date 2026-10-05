import { PostList, TagChips } from "@/components/post-list";
import { getAllTags, getPublishedPosts, toMeta } from "@/lib/posts";
import { SITE } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      <section className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">{SITE.name}</h1>
        <p className="mt-3 text-muted-foreground">{SITE.description}</p>
      </section>
      <TagChips tags={getAllTags()} />
      <div className="mt-8">
        <PostList posts={getPublishedPosts().map(toMeta)} />
      </div>
    </>
  );
}

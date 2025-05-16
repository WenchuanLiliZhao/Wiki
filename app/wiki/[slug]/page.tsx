import { getPageBySlug, getAllPages } from "@/lib/wiki-utils";
import { notFound } from "next/navigation";
import { WikiContent } from "@/components/wiki-content";
import styles from "./page.module.scss";

export async function generateStaticParams() {
  const pages = await getAllPages();

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${page.title} | Math Wiki`,
  };
}

export default async function WikiPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className={styles["container"]}>
      <article className={styles["article"]}>
        {/* Title */}
        <h1 className={styles["title"]}>{page.title}</h1>

        {/* Updated date */}
        {page.update && (
          <p className="text-gray-500 text-sm mb-6">
            Last updated: {page.update}
          </p>
        )}

        {/* Cover image */}
        {page.cover && (
          <div className="mb-6">
            <img
              src={page.cover}
              alt={page.title}
              className="w-full h-auto rounded-md"
            />
          </div>
        )}

        <div className={styles["content"]}>
          <WikiContent content={page.content} />
        </div>
      </article>
    </div>
  );
}

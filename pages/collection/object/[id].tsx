import { useEffect, useState } from "react";
import Head from "next/head"
import Link from "next/link"
import { Layout } from "@/components/layout/layout"
import { ObjectDescription } from "@/components/search/object-description";
import { useRouter } from 'next/router'
import { ImageViewer } from "@/components/search/image-viewer";
import { SimilarItemCard } from "@/components/search/similar-item-card";
import { Button } from "@/components/ui/button";
import { getDocument, similar } from "@/util/elasticsearch";
import { getSchemaVisualArtwork } from "@/util/schema"
import { LanguageDisclaimer } from "@/components/search/language-disclaimer";

export default function IndexPage({ item, similar }) {
  const router = useRouter()
  const { id } = router.query

  const [visibleSimilar, setVisibleSimilar] = useState([]);
  const [showAllSimilar, setShowAllSimilar] = useState(false);

  useEffect(() => {
    if (showAllSimilar)
      setVisibleSimilar(similar);
    else
      setVisibleSimilar(similar.slice(0, 12));
  }, [similar, showAllSimilar]);

  useEffect(() => {
    setShowAllSimilar(false);
  }, [router.query]);

  return (
    <Layout>
      <Head>
        <title>{item?.title} : Brooklyn Museum</title>
        <meta
          name="description"
          content="Elasticsearch + Next.js Search Prototype"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script type="application/ld+json">
          {JSON.stringify(getSchemaVisualArtwork(item), null, 2)}
        </script>
      </Head>
      <section className="container grid gap-y-6 gap-x-12 pt-6 pb-8 md:grid-cols-2 md:py-10 lg:grid-cols-8">
        <div className="flex items-start justify-center md:col-span-1 lg:col-span-3">
          <ImageViewer item={item} />
        </div>
        <div className="md:col-span-1 lg:col-span-5">
          <h1 className="mb-3 text-2xl font-bold leading-tight tracking-tighter sm:text-2xl md:text-3xl lg:text-4xl">
            {item?.title}
          </h1>
          <div className="mb-4 text-neutral-700 dark:text-neutral-400">
            {item?.date}
          </div>
          <h2 className="mb-4 text-lg md:text-xl">
            {item?.primaryConstituent || 'Maker Unknown'}
          </h2>
          <h4 className="mb-4 font-semibold uppercase text-neutral-700 dark:text-neutral-400">
            {item?.collections?.map(
              (collection, i) =>
                collection && (
                  <span key={i}>{collection}{(i > 0) ? ', ' : ''}</span>
                )
            )}
          </h4>
          <div className="mb-4 text-neutral-700 dark:text-neutral-400"
            dangerouslySetInnerHTML={{ __html: item?.description }}>
          </div>
          <div className="pt-4">
            <ObjectDescription item={item} />
          </div>
          <div>
            <LanguageDisclaimer />
          </div>
        </div>
      </section>
      <section className="container bg-neutral-100 pt-6 pb-8 dark:bg-neutral-800 md:py-8">
        <h2 className="mb-6 text-xl font-bold leading-tight tracking-tighter md:text-2xl lg:text-3xl">
          Similar Objects
        </h2>
        <div className="grid grid-cols-2 gap-6 pb-8 md:grid-cols-4 md:pb-10 lg:grid-cols-6">
          {
            visibleSimilar?.length > 0 && visibleSimilar.map(
              (item, i) =>
                item && (
                  <div className="" key={i}>
                    <SimilarItemCard item={item} />
                  </div>
                )
            )
          }
        </div>
        {
          !showAllSimilar && (
            <Button
              onClick={() => setShowAllSimilar(true)}
              variant="default"
              size="sm"
            >
              Show more
            </Button>
          )
        }

      </section>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const { id } = context.query;
  const item = await getDocument('collections', id);
  const similarItems = await similar(id);
  return { props: { item: item.data, similar: similarItems } }
}
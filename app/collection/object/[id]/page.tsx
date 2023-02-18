import { ObjectDescription } from "@/components/search/object-description";
import { ImageViewer } from "@/components/search/image-viewer";
import { getDocument, similar } from "@/util/elasticsearch";
import { LanguageDisclaimer } from "@/components/search/language-disclaimer";
import { getSmallOrRestrictedImageUrl } from "@/util/image";
import { SimilarObjects } from "@/components/object/similar-objects";

export default async function Page({ params }) {

  const { id } = params;
  const data = await getDocument('collections', id);
  const item : any = data?.data;
  const similarItems = await similar(id);

  const thumb = getSmallOrRestrictedImageUrl(item?.image, item?.copyrightRestricted)

  return (
    <>
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
            dangerouslySetInnerHTML={{ __html: item?.description || '' }}>
          </div>
          <div className="pt-4">
            <ObjectDescription item={item} />
          </div>
          <div>
            <LanguageDisclaimer item={item} />
          </div>
        </div>
      </section>
      <section className="container bg-neutral-100 pt-6 pb-8 dark:bg-neutral-800 md:py-8">
        <h2 className="mb-6 text-xl font-bold leading-tight tracking-tighter md:text-2xl lg:text-3xl">
          Similar Objects
        </h2>
        <SimilarObjects similar={similarItems} />
      </section>
    </>
  )
}
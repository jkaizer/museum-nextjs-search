import { useState, useEffect } from "react";
import dynamic from 'next/dynamic'
import Link from "next/link"
import Image from 'next/image'
import {
  getRestrictedImageUrl,
  getSmallOrRestrictedImageUrl,
  getLargeImageUrl
} from '@/util/image.js';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { getCaption } from "@/util/various";

const OpenSeaDragonViewer = dynamic(() => import('./open-seadragon-viewer'), {
  ssr: false
})

export function ImageViewer({ item }) {
  const [sortedImages, setSortedImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isCopyrightRestricted, setIsCopyrightRestricted] = useState(false);

  /**
   * Sometimes the item's main image (item.image) is ranked at the same level
   * as other item images.  Force the main image to have the highest rank (0).
   */
  function getSortedImages(item) {
    if (item?.images?.length) {
      if (item.image) {
        const index = item.images.findIndex(o => o.filename === item.image);
        if ( index !== -1 && item.images[index]?.rank) { item.images[index].rank = 0; }
      }
      return item?.images?.sort((a, b) => a.rank - b.rank) || [];
    }
  }

  useEffect(() => {
    setSortedImages(getSortedImages(item))
    setSelectedImageIndex(0);
    setIsCopyrightRestricted(item.copyrightRestricted)
  }, [item])

  useEffect(() => {
    setSelectedImage(sortedImages[selectedImageIndex])
  }, [selectedImageIndex, sortedImages])

  if (!item?.id || !(item?.images?.length > 0)) return;

  function getThumbnailClass(filename) {
    const base = 'flex w-16 items-center justify-center p-1 cursor-pointer';
    if (filename === selectedImage?.filename)
      return `${base} border border-neutral-400`
    return base
  }

  return (
    <div className="flex flex-col items-center">
      {selectedImage && (
        <div>
          {isCopyrightRestricted ? (
            <>
              <figure>
                <Image
                  src={getSmallOrRestrictedImageUrl(selectedImage?.filename, isCopyrightRestricted)}
                  className="max-h-96 object-contain"
                  alt=""
                  width={800}
                  height={800}
                />
                <figcaption className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                  {getCaption(item, selectedImage?.filename)}
                </figcaption>
              </figure>
              <p className="mt-4 text-xs italic text-neutral-500 dark:text-neutral-400">
                This image is presented as a &quot;thumbnail&quot; because it is protected by copyright.
                The Brooklyn Museum respects the rights of artists who retain the copyright to their work
              </p>
            </>
          ) : (
            <Dialog>
              <DialogTrigger>
                <figure>
                  <Image
                    src={getSmallOrRestrictedImageUrl(selectedImage?.filename, isCopyrightRestricted)}
                    className="max-h-96 object-contain"
                    alt=""
                    width={800}
                    height={800}
                  />
                  <figcaption className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                    {getCaption(item, selectedImage?.filename)}
                  </figcaption>
                </figure>
              </DialogTrigger>
              <DialogContent className="h-full min-w-full">
                <DialogHeader className="">
                  <DialogTitle className="z-50">
                    <span className="rounded-lg bg-white bg-opacity-50 px-4 py-3 dark:bg-neutral-900">
                      {item.title}
                    </span>
                  </DialogTitle>
                  <DialogDescription>
                    <div>
                      {item?.image && (
                        <OpenSeaDragonViewer image={getLargeImageUrl(selectedImage?.filename)} />
                      )}
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          )}
        </div>
      )}
      {sortedImages.length > 1 && (
        <div className="my-6 flex flex-wrap justify-start gap-2">
          {sortedImages.map(
            (image, index) =>
              image?.filename && (
                <div
                  key={index}
                  className={getThumbnailClass(image.filename)}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <figure key={index}>
                    <Image
                      src={getRestrictedImageUrl(image.filename)}
                      className="max-h-16 object-contain"
                      alt=""
                      width={200}
                      height={200}
                    />
                    <figcaption></figcaption>
                  </figure>
                </div>
              )
          )}
        </div>
      )}
    </div>
  )
}



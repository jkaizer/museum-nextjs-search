import * as React from "react"
import Link from "next/link"

export function DescriptionRow({ name, value }) {
  if (!name || !value) return;
  let val = '';
  if (Array.isArray(value) && value.length > 0) {
    for (const v of value) {
      val += `${val.length > 0 ? ', ' : ''}${v}`
    } 
  }
  else val = value

  return (
    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-3">
      <dt className="text-sm font-medium text-gray-500">{name}</dt>
      <dd className="mt-1 flex text-sm text-gray-900 sm:col-span-2 sm:mt-0">
        <span className="flex-grow">{val}</span>
      </dd>
    </div>
  )
}


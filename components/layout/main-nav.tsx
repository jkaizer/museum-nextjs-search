import * as React from "react"
import Link from "next/link"

import { NavItem } from "@/types/nav"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { AltNav } from "./alt-nav"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { getDictionary } from '@/dictionaries/dictionaries';

interface MainNavProps {
  items?: NavItem[]
}

export function MainNav({ items }: MainNavProps) {

  const dict = getDictionary();

  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/" className="hidden items-center space-x-2 md:flex">
        <Icons.logo className="w-52 fill-current" />
        <span className="hidden font-bold">
          {dict['site.title']}
        </span>
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-semibold text-neutral-600 hover:text-neutral-900 dark:text-neutral-100 sm:text-sm",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {dict[item.dict]}
                </Link>
              )
          )}
        </nav>
      ) : null}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="-ml-4 text-base hover:bg-transparent focus:ring-0 md:hidden"
            aria-label="Open Menu"
          >
            <Icons.menu className="mr-4 h-5 w-5" />
            <Icons.logo className="mr-2 w-48 fill-current" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          sideOffset={24}
          className="w-[300px] overflow-scroll"
        >
          <DropdownMenuLabel>
            <Link href="/" className="flex items-center">
              {dict['site.title']}
            </Link>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {items?.map(
            (item, index) =>
              item.href && (
                <DropdownMenuItem key={index} asChild>
                  <Link href={item.href}>{dict[item.dict]}</Link>
                </DropdownMenuItem>
              )
          )}
          <DropdownMenuItem asChild>
            <AltNav />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

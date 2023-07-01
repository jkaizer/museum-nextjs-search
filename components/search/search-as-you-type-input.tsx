'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getDictionary } from '@/dictionaries/dictionaries';
import { useDebounce } from '@/util/debounce';

import type { Term } from '@/types/term';
import { SearchInput } from '@/components/search/search-input';
import { Badge } from '@/components/ui/badge';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover-local';

interface SearchAsYouTypeInputProps {
  params?: any;
}

export function SearchAsYouTypeInput({ params }: SearchAsYouTypeInputProps) {
  const dict = getDictionary();
  const router = useRouter();
  const pathname = usePathname();
  // const popoverRef = useRef<HTMLDivElement>(null);

  const [value, setValue] = useState(params?.q || '');
  const [searchOptions, setSearchOptions] = useState<Term[]>([]);

  const debouncedSuggest = useDebounce(() => {
    if (value?.length < 3) {
      setSearchOptions([]);
      return;
    }
    if (value)
      fetch(`/api/suggest?q=${value}`)
        .then((res) => res.json())
        .then((data) => {
          if (data?.data?.length > 0) setSearchOptions(data.data);
          else setSearchOptions([]);
        });
  }, 50);

  function searchForQuery(currentValue = '') {
    const updatedParams = new URLSearchParams(params);
    if (currentValue) updatedParams.set('q', currentValue);
    else updatedParams.delete('q');
    updatedParams.delete('p');
    setSearchOptions([]);
    setValue(currentValue);
    router.push(`${pathname}?${updatedParams}`);
  }

  function searchForTerm(term: Term) {
    const updatedParams = new URLSearchParams(params);
    if (!term.value || !term.field) return;
    if (term.field === 'primaryConstituent') {
      updatedParams.set('primaryConstituent.name', term.value);
    } else if (term.field === 'classification') {
      updatedParams.set('classification', term.value);
    } else if (term.field === 'collections') {
      updatedParams.set('collections', term.value);
    }
    updatedParams.delete('q');
    updatedParams.delete('p');
    setSearchOptions([]);
    setValue('');
    router.push(`${pathname}?${updatedParams}`);
  }

  const onQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    debouncedSuggest();
  };

  function handleOnSubmit(event: FormEvent) {
    event.preventDefault();
    searchForQuery(value);
  }

  /*
  TODO: Figure out a way to focus the popover on arrow down
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (popoverRef.current && typeof popoverRef.current.focus === 'function') {
        popoverRef.current.focus();
      }
    }
  };
  */

  const handleOpenChange = (event) => {
    event?.preventDefault();
  };

  function getFieldName(field: string) {
    switch (field) {
      case 'primaryConstituent':
        return dict['index.collections.agg.primaryConstituent.name'];
      case 'classification':
        return dict['index.collections.agg.classification'];
      case 'collections':
        return dict['index.collections.agg.collections'];
    }
  }

  return (
    <Popover open={searchOptions?.length > 0} onOpenChange={handleOpenChange}>
      <PopoverAnchor asChild>
        <form onSubmit={handleOnSubmit}>
          <SearchInput
            name="query"
            placeholder={dict['search.search']}
            onChange={onQueryChange}
            value={value}
            autoComplete="off"
          />
        </form>
      </PopoverAnchor>
      <PopoverContent className="p-0" onOpenAutoFocus={handleOpenChange}>
        <Command>
          <CommandGroup>
            {searchOptions.map((term) => (
              <CommandItem
                key={term.value}
                onSelect={() => {
                  searchForTerm(term);
                }}
                className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-700"
              >
                <div className="flex w-full items-center justify-between ">
                  <div className="ml-2">{term.value}</div>
                  <Badge variant="default">{getFieldName(term.field)}</Badge>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

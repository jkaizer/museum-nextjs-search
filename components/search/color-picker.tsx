'use client';

import { Key } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { Icons } from '@/components/icons';

interface ColorChoice {
  hex: string;
  color: string;
  text: string;
}

interface ColorPickerProps {
  params?: any;
}

export function ColorPicker({ params }: ColorPickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentHexColor = params?.color || '';

  // colors should be an array of objects with name, color and border color:
  const colors: ColorChoice[] = [
    {
      hex: 'db2777',
      color: 'bg-pink-600',
      text: 'text-pink-800',
    },
    { hex: 'dc2626', color: 'bg-red-600', text: 'text-red-800' },
    {
      hex: 'ea580c',
      color: 'bg-orange-600',
      text: 'text-orange-800',
    },
    {
      hex: 'facc15',
      color: 'bg-yellow-400',
      text: 'text-yellow-600',
    },
    {
      hex: '16a34a',
      color: 'bg-green-600',
      text: 'text-green-800',
    },
    {
      hex: '0891b2',
      color: 'bg-cyan-600',
      text: 'text-cyan-800',
    },
    {
      hex: '2563eb',
      color: 'bg-blue-600',
      text: 'text-blue-800',
    },
    {
      hex: '9333ea',
      color: 'bg-purple-600',
      text: 'text-purple-800',
    },
    {
      hex: '000000',
      color: 'bg-black',
      text: 'text-neutral-400',
    },
    {
      hex: 'ffffff',
      color: 'bg-white',
      text: 'text-neutral-600',
    },
  ];

  function getColorClass(color: ColorChoice) {
    const myText =
      currentHexColor === color.hex && color.hex !== '000000'
        ? 'text-black'
        : color.text;
    return `cursor-pointer h-6 w-6 rounded-full ${color.color} ${myText}`;
  }

  function clickColor(color?: ColorChoice) {
    const updatedParams = new URLSearchParams(params);
    if (!color || currentHexColor === color.hex) updatedParams.delete('color');
    else updatedParams.set('color', color.hex);
    updatedParams.delete('p');
    router.push(`${pathname}?${updatedParams}`);
  }

  return (
    <div className="flex w-full flex-wrap gap-1">
      {colors.map((color: ColorChoice, i: Key) =>
        currentHexColor === color.hex ? (
          <Icons.checkCircle
            key={i}
            className={getColorClass(color)}
            onClick={() => clickColor(color)}
          />
        ) : (
          <Icons.circle
            key={i}
            className={getColorClass(color)}
            onClick={() => clickColor(color)}
          />
        )
      )}
      <Icons.circleSlashed
        onClick={() => clickColor()}
        className="mr-4 h-6 w-6 cursor-pointer text-neutral-600"
      />
    </div>
  );
}

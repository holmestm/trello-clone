interface Item {
  id: string
}

export const findItemIndexById = <T extends Item> (items: T[], id: string) => {
  return items.findIndex((item: T) => item.id === id)
}

export function overrideItemAtIndex<T>(
  array: T[],
  newItem: T,
  targetIndex: number
) {
  return array.map((item, index) => {
    return (index === targetIndex ? newItem : item)
  })
}

export function removeItemAtIndex<T>(array: T[], index: number) {
  return [...array.slice(0, index), ...array.slice(index + 1)]
}

export const moveItem = <T>(array: T[], from: number, to: number) => {
  const item = array[from];
  const t = [...array.slice(0, from), ...array.slice(from + 1)];
  return [...t.slice(0,to), item, ...t.slice(to) ]
}
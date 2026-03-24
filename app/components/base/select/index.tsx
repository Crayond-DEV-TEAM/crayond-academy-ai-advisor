'use client'
import type { FC } from 'react'
import React, { useEffect, useState } from 'react'
import { Combobox, Listbox } from '@headlessui/react'
import classNames from 'classnames'
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'

const defaultItems = [
  { value: 1, name: 'option1' },
  { value: 2, name: 'option2' },
  { value: 3, name: 'option3' },
  { value: 4, name: 'option4' },
  { value: 5, name: 'option5' },
  { value: 6, name: 'option6' },
  { value: 7, name: 'option7' },
]

export interface Item {
  value: number | string
  name: string
}

export interface ISelectProps {
  className?: string
  items?: Item[]
  defaultValue?: number | string
  disabled?: boolean
  onSelect: (value: Item) => void
  allowSearch?: boolean
  bgClassName?: string
}
const Select: FC<ISelectProps> = ({
  className,
  items = defaultItems,
  defaultValue = 1,
  disabled = false,
  onSelect,
  allowSearch = true,
  bgClassName = 'bg-gray-100',
}) => {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)

  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  useEffect(() => {
    let defaultSelect = null
    const existed = items.find((item: Item) => item.value === defaultValue)
    if (existed) { defaultSelect = existed }

    setSelectedItem(defaultSelect)
  }, [defaultValue])

  const filteredItems: Item[]
    = query === ''
      ? items
      : items.filter((item) => {
        return item.name.toLowerCase().includes(query.toLowerCase())
      })

  return (
    <Combobox
      as="div"
      disabled={disabled}
      value={selectedItem}
      className={className}
      onChange={(value: Item) => {
        if (!disabled) {
          setSelectedItem(value)
          setOpen(false)
          onSelect(value)
        }
      }}>
      <div className={classNames('relative')}>
        <div className='group text-gray-300'>
          {allowSearch
            ? <Combobox.Input
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-3 pr-10 text-sm text-white placeholder-gray-500 focus-visible:outline-none focus-visible:border-[#665cd7]/50 focus-visible:bg-white/[0.06] transition-colors"
              onChange={(event) => {
                if (!disabled) { setQuery(event.target.value) }
              }}
              displayValue={(item: Item) => item?.name}
            />
            : <Combobox.Button onClick={
              () => {
                if (!disabled) { setOpen(!open) }
              }
            } className="flex items-center h-10 w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-3 pr-10 text-sm text-white focus-visible:outline-none focus-visible:border-[#665cd7]/50 focus-visible:bg-white/[0.06] transition-colors">
              {selectedItem?.name || <span className="text-gray-500">Select...</span>}
            </Combobox.Button>}
          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-2 focus:outline-none text-gray-400" onClick={
            () => {
              if (!disabled) { setOpen(!open) }
            }
          }>
            {open ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
          </Combobox.Button>
        </div>

        {filteredItems.length > 0 && (
          <Combobox.Options className="absolute z-10 mt-1 px-1 max-h-60 w-full overflow-auto rounded-xl bg-[#1e1d2e] border border-white/[0.08] py-1 text-base shadow-xl shadow-black/40 focus:outline-none sm:text-sm">
            {filteredItems.map((item: Item) => (
              <Combobox.Option
                key={item.value}
                value={item}
                className={({ active }: { active: boolean }) =>
                  classNames(
                    'relative cursor-pointer select-none py-2.5 pl-3 pr-9 rounded-lg text-gray-300 transition-colors',
                    active ? 'bg-white/[0.06] text-white' : '',
                  )
                }
              >
                {({ /* active, */ selected }) => (
                  <>
                    <span className={classNames('block truncate', selected && 'text-[#a89df0] font-medium')}>{item.name}</span>
                    {selected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#a89df0]">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox >
  )
}

const SimpleSelect: FC<ISelectProps> = ({
  className,
  items = defaultItems,
  defaultValue = 1,
  disabled = false,
  onSelect,
}) => {
  const [selectedItem, setSelectedItem] = useState<Item | null>(() => {
    const existed = items.find((item: Item) => item.value === defaultValue)
    return existed || null
  })

  useEffect(() => {
    const existed = items.find((item: Item) => item.value === defaultValue)
    setSelectedItem(existed || null)
  }, [defaultValue])

  return (
    <Listbox
      value={selectedItem}
      onChange={(value: Item) => {
        if (!disabled) {
          setSelectedItem(value)
          onSelect(value)
        }
      }}
    >
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className={`w-full rounded-xl border border-white/[0.08] bg-white/[0.04] py-2.5 pl-3 pr-10 text-sm text-left text-white focus-visible:outline-none focus-visible:border-[#665cd7]/50 focus-visible:bg-white/[0.06] cursor-pointer transition-colors ${className}`}>
            <span className="block truncate">{selectedItem?.name || <span className="text-gray-500">Select...</span>}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronDownIcon
                className={classNames('h-5 w-5 text-gray-400 transition-transform', open && 'rotate-180')}
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Listbox.Options className="absolute z-10 mt-1 px-1 max-h-60 w-full overflow-auto rounded-xl bg-[#1e1d2e] border border-white/[0.08] py-1 text-base shadow-xl shadow-black/40 focus:outline-none sm:text-sm">
            {items.map((item: Item) => (
              <Listbox.Option
                key={item.value}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2.5 pl-3 pr-9 rounded-lg text-gray-300 transition-colors ${active ? 'bg-white/[0.06] text-white' : ''}`
                }
                value={item}
                disabled={disabled}
              >
                {({ selected }) => (
                  <>
                    <span className={classNames('block truncate', selected && 'text-[#a89df0] font-medium')}>{item.name}</span>
                    {selected && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-[#a89df0]">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      )}
    </Listbox>
  )
}
export { SimpleSelect }
export default React.memo(Select)

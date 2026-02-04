import * as Lucide from 'lucide-react'
import {
  Autocomplete,
  AutocompleteInput,
  AutocompleteEmpty,
  AutocompleteList,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteCollection,
  AutocompleteItem
} from '#/components/autocomplete'
import { Button } from '#/components/button'
import {
  Command,
  CommandTrigger,
  CommandContent,
  CommandBody,
  CommandFooter,
  CommandFooterItem,
  CommandFooterText
} from '#/components/command'
import { InputGroup, InputGroupAddon } from '#/components/input-group'
import { Kbd, KbdGroup } from '#/components/kbd'

interface CommandBarProps {
  open: boolean
  setOpen: (value: boolean) => void
}

export function CommandBar({ open, setOpen }: CommandBarProps) {
  const items = [
    {
      label: 'Suggestions',
      items: [
        { label: 'Figma', value: 'figma' },
        { label: 'Adobe XD', value: 'adobe-xd' },
        { label: 'Sketch', value: 'sketch' }
      ]
    },
    {
      label: 'File Management',
      items: [
        { label: 'File Explorer', value: 'file-explorer' },
        { label: 'File Search', value: 'file-search' },
        { label: 'File Transfer', value: 'file-transfer' }
      ]
    },
    {
      label: 'Settings',
      items: [
        { label: 'General', value: 'general' },
        { label: 'Appearance', value: 'appearance' },
        { label: 'Accessibility', value: 'accessibility' }
      ]
    }
  ]

  return (
    <Command open={open} onOpenChange={setOpen}>
      <CommandTrigger render={<Button variant='plain' size='icon-sm' />}>
        <Lucide.Search />
      </CommandTrigger>
      <CommandContent>
        <CommandBody>
          <Autocomplete items={items} autoHighlight open>
            <InputGroup variant='plain'>
              <InputGroupAddon>
                <Lucide.SearchIcon />
              </InputGroupAddon>
              <AutocompleteInput
                placeholder='Search apps or commands...'
                variant='plain'
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    setOpen(false)
                  }
                }}
              />
            </InputGroup>
            <AutocompleteEmpty>No results found.</AutocompleteEmpty>
            <AutocompleteList>
              {(group) => (
                <AutocompleteGroup key={group.label} items={group.items}>
                  <AutocompleteGroupLabel>{group.label}</AutocompleteGroupLabel>
                  <AutocompleteCollection>
                    {(item) => (
                      <AutocompleteItem
                        key={item.value}
                        value={item.value}
                        onClick={() => console.log(item)}
                      >
                        {item.icon}
                        {item.label}
                      </AutocompleteItem>
                    )}
                  </AutocompleteCollection>
                </AutocompleteGroup>
              )}
            </AutocompleteList>
          </Autocomplete>
        </CommandBody>
        <CommandFooter className='justify-between'>
          <CommandFooterItem>
            <KbdGroup className='gap-2'>
              <Kbd variant='outline' className='rounded-xs pb-1'>
                ↑
              </Kbd>
              <Kbd variant='outline' className='rounded-xs pb-1'>
                ↓
              </Kbd>
            </KbdGroup>
            <CommandFooterText>Navigate</CommandFooterText>
          </CommandFooterItem>
          <CommandFooterItem>
            <Kbd variant='outline' className='rounded-xs pb-1'>
              ↵
            </Kbd>
            <CommandFooterText>Select Item</CommandFooterText>
          </CommandFooterItem>
        </CommandFooter>
      </CommandContent>
    </Command>
  )
}

import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import * as React from 'react'
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

const meta = {
  title: 'Components/Command',
  component: Command,
  parameters: { layout: 'centered' },
  argTypes: {},
  tags: [], // ['autodocs']
  args: {},
  decorators: [
    (Story) => (
      <div className='flex w-full min-w-md items-center justify-center'>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Command>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => {
    const [open, setOpen] = React.useState(false)

    const items = [
      {
        label: 'Spells',
        items: [
          { label: 'Expelliarmus', value: 'expelliarmus' },
          { label: 'Expecto Patronum', value: 'expecto-patronum' },
          { label: 'Wingardium Leviosa', value: 'wingardium-leviosa' }
        ]
      },
      {
        label: 'Books',
        items: [
          { label: 'The Da Vinci Code', value: 'da-vinci-code' },
          { label: 'Angels & Demons', value: 'angels-demons' },
          { label: "The Sorcerer's Stone", value: 'sorcerers-stone' }
        ]
      },
      {
        label: 'Settings',
        items: [
          { label: 'Wand Settings', value: 'wand-settings' },
          { label: 'Hogwarts House', value: 'hogwarts-house' },
          { label: 'Magical Abilities', value: 'magical-abilities' }
        ]
      }
    ]

    return (
      <Command open={open} onOpenChange={setOpen}>
        <CommandTrigger render={<Button>Open Magical Command</Button>} />
        <CommandContent>
          <CommandBody>
            <Autocomplete items={items} autoHighlight open>
              <InputGroup variant='plain'>
                <InputGroupAddon>
                  <Lucide.SearchIcon />
                </InputGroupAddon>
                <AutocompleteInput
                  placeholder='Search spells or books...'
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
}

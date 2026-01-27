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
} from '#/components/selia/autocomplete'
import { Button } from '#/components/selia/button'
import {
  Command,
  CommandTrigger,
  CommandContent,
  CommandBody,
  CommandFooter,
  CommandFooterItem,
  CommandFooterText
} from '#/components/selia/command'
import { InputGroup, InputGroupAddon } from '#/components/selia/input-group'
import { Kbd, KbdGroup } from '#/components/selia/kbd'

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
        label: 'Suggestions',
        items: [
          {
            label: 'Figma',
            value: 'figma'
          },
          {
            label: 'Adobe XD',
            value: 'adobe-xd'
          },
          {
            label: 'Sketch',
            value: 'sketch'
          }
        ]
      },
      {
        label: 'File Management',
        items: [
          {
            label: 'File Explorer',
            value: 'file-explorer'
          },
          {
            label: 'File Search',
            value: 'file-search'
          },
          {
            label: 'File Transfer',
            value: 'file-transfer'
          }
        ]
      },
      {
        label: 'Settings',
        items: [
          {
            label: 'General',
            value: 'general'
          },
          {
            label: 'Appearance',
            value: 'appearance'
          },
          {
            label: 'Accessibility',
            value: 'accessibility'
          }
        ]
      }
    ]

    return (
      <Command open={open} onOpenChange={setOpen}>
        <CommandTrigger render={<Button>Open Command</Button>} />
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
          <CommandFooter>
            <CommandFooterItem>
              <Kbd>↵</Kbd>
              <CommandFooterText>Select Item</CommandFooterText>
            </CommandFooterItem>
            <CommandFooterItem>
              <KbdGroup>
                <Kbd>↑</Kbd>
                <Kbd>↓</Kbd>
              </KbdGroup>
              <CommandFooterText>Navigate</CommandFooterText>
            </CommandFooterItem>
          </CommandFooter>
        </CommandContent>
      </Command>
    )
  }
}

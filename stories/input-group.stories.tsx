import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Button } from '#/components/button'
import { Input } from '#/components/input'
import { InputGroup, InputGroupAddon, InputGroupText } from '#/components/input-group'
import { Label } from '#/components/label'
import { Menu, MenuPopup, MenuItem, MenuTrigger } from '#/components/menu'
import {
  Select,
  SelectPopup,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectList
} from '#/components/select'
import { Textarea } from '#/components/textarea'

const meta = {
  title: 'Components/InputGroup',
  component: InputGroup,
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
} satisfies Meta<typeof InputGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex w-full flex-col gap-4 xl:w-10/12 2xl:w-8/12'>
      <InputGroup>
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <Input placeholder='example.com' />
      </InputGroup>
      <InputGroup>
        <Input placeholder='yourname' />
        <InputGroupAddon align='end'>
          <InputGroupText>@company.com</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupAddon align='start'>
          <Lucide.SearchIcon />
        </InputGroupAddon>
        <Input placeholder='Search' />
      </InputGroup>
    </div>
  )
}

export const WithLabel: Story = {
  args: {},
  render: () => (
    <div className='w-full'>
      <InputGroup>
        <InputGroupAddon render={<Label htmlFor='url' />}>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <Input id='url' placeholder='example.com' className='pl-1' />
      </InputGroup>
    </div>
  )
}

export const WithMenu: Story = {
  args: {},
  render: () => (
    <div className='w-full max-w-xs'>
      <InputGroup>
        <Input placeholder='Spell Message' />
        <InputGroupAddon align='end'>
          <Menu>
            <MenuTrigger render={<Button variant='plain' size='xs' pill />}>
              <Lucide.MoreHorizontalIcon />
            </MenuTrigger>
            <MenuPopup align='end'>
              <MenuItem>Send by Owl</MenuItem>
              <MenuItem>Send by Patronus</MenuItem>
              <MenuItem>Send to All Wizards</MenuItem>
            </MenuPopup>
          </Menu>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export const WithSelect: Story = {
  args: {},
  render: () => (
    <div className='w-full max-w-xs'>
      <InputGroup>
        <InputGroupAddon>
          <Select defaultValue='USD'>
            <SelectTrigger>
              <SelectValue placeholder='USD' />
            </SelectTrigger>
            <SelectPopup className='max-lg:w-auto' align='start'>
              <SelectList>
                <SelectItem value='USD'>USD</SelectItem>
                <SelectItem value='EUR'>EUR</SelectItem>
                <SelectItem value='GBP'>GBP</SelectItem>
                <SelectItem value='JPY'>JPY</SelectItem>
                <SelectItem value='KRW'>KRW</SelectItem>
                <SelectItem value='CNY'>CNY</SelectItem>
                <SelectItem value='INR'>INR</SelectItem>
                <SelectItem value='BRL'>BRL</SelectItem>
                <SelectItem value='ARS'>ARS</SelectItem>
              </SelectList>
            </SelectPopup>
          </Select>
        </InputGroupAddon>
        <Input placeholder='Amount' />
      </InputGroup>
    </div>
  )
}

export const WithButton: Story = {
  args: {},
  render: () => (
    <div className='w-full max-w-xs'>
      <InputGroup>
        <Input placeholder='Search' />
        <InputGroupAddon align='end'>
          <Button variant='tertiary' size='xs'>
            Search
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

export const WithTextArea: Story = {
  args: {},
  render: () => {
    const books = [
      { value: 'da-vinci', label: 'Da Vinci' },
      { value: 'angels', label: 'Angels' },
      { value: 'inferno', label: 'Inferno' },
      { value: 'sorcerer', label: 'Sorcerer' },
      { value: 'azkaban', label: 'Azkaban' }
    ]

    return (
      <div className='w-full max-w-md'>
        <InputGroup className='w-full'>
          <Textarea placeholder='Ask the sorting hat ...' className='resize-none' />
          <InputGroupAddon
            align='block-end'
            className='border-border rounded-tl-none rounded-tr-none border-t pt-2.5'
          >
            <Menu>
              <MenuTrigger
                render={
                  <Button size='icon-xs' variant='outline' pill>
                    <Lucide.PlusIcon />
                  </Button>
                }
              />
              <MenuPopup align='start' className='w-48'>
                <MenuItem>
                  <Lucide.ScrollIcon /> Add Clue
                </MenuItem>
              </MenuPopup>
            </Menu>

            <Select defaultValue={books[1]} items={books}>
              <SelectTrigger className='ml-auto w-auto' variant='plain'>
                <SelectValue placeholder='Book' />
              </SelectTrigger>
              <SelectPopup align='center'>
                <SelectList>
                  {books.map((book) => (
                    <SelectItem key={book.value} value={book}>
                      {book.label}
                    </SelectItem>
                  ))}
                </SelectList>
              </SelectPopup>
            </Select>

            <Button size='icon-xs' className='ml-auto'>
              <Lucide.ArrowUpIcon />
            </Button>
          </InputGroupAddon>
        </InputGroup>
      </div>
    )
  }
}

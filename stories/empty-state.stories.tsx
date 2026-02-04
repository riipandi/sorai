import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '#/components/avatar'
import { Button } from '#/components/button'
import { Empty, EmptyHeader, EmptyTitle } from '#/components/empty-state'
import { EmptyContent, EmptyDescription, EmptyMedia } from '#/components/empty-state'
import { Input } from '#/components/input'
import { InputGroup, InputGroupAddon } from '#/components/input-group'
import { Kbd } from '#/components/kbd'
import { TextLink } from '#/components/typography'

const meta = {
  title: 'Components/EmptyState',
  component: Empty,
  parameters: { layout: 'centered' },
  argTypes: {},
  tags: [],
  args: {},
  decorators: [
    (Story) => (
      <div className='flex w-full max-w-lg items-center justify-center p-4'>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Empty>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <Lucide.InboxIcon className='size-12' />
        </EmptyMedia>
        <EmptyTitle>No Books Found</EmptyTitle>
      </EmptyHeader>
      <EmptyContent>
        <EmptyDescription>
          Start building your library by adding Dan Brown or Harry Potter books.
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}

export const Complex: Story = {
  args: {},
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <Lucide.BookOpen strokeWidth={2.0} />
        </EmptyMedia>
        <EmptyTitle>No Reading Lists Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any reading lists yet. Get started by organizing your favorite
          Dan Brown and Harry Potter books.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className='flex flex-col gap-6'>
        <div className='flex flex-row justify-center gap-4'>
          <Button>Create List</Button>
          <Button variant='outline'>Import Books</Button>
        </div>
        <div>
          <TextLink render={<a href='/recommendations' aria-label='Browse book recommendations' />}>
            <span>Browse Recommendations</span> <Lucide.ArrowUpRightIcon />
          </TextLink>
        </div>
      </EmptyContent>
    </Empty>
  )
}

export const Outline: Story = {
  args: {},
  render: () => (
    <Empty className='border-border border border-dashed'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <Lucide.Book />
        </EmptyMedia>
        <EmptyTitle>Library Empty</EmptyTitle>
        <EmptyDescription>
          Add The Da Vinci Code or Harry Potter and the Sorcerer's Stone to begin your collection.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant='outline' size='sm'>
          Add Books
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export const Background: Story = {
  args: {},
  render: () => (
    <Empty className='bg-dimmed/5 border-border h-full border'>
      <EmptyHeader>
        <EmptyMedia variant='icon'>
          <Lucide.Bookmark />
        </EmptyMedia>
        <EmptyTitle>No Bookmarks</EmptyTitle>
        <EmptyDescription className='max-w-xs text-pretty'>
          You haven&apos;t bookmarked any pages from Angels & Demons or Harry Potter series. Start
          marking your favorite passages.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant='outline'>
          <Lucide.RefreshCcwIcon data-icon='inline-start' />
          Discover Books
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export const WithAvatar: Story = {
  args: {},
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant='default'>
          <Avatar className='size-12'>
            <AvatarImage
              src='https://api.dicebear.com/9.x/avataaars/svg?radius=50&seed=Robert+Langdon'
              alt='Robert Langdon'
              className='grayscale'
            />
            <AvatarFallback>RL</AvatarFallback>
          </Avatar>
        </EmptyMedia>
        <EmptyTitle>Author Not Found</EmptyTitle>
        <EmptyDescription>
          Dan Brown's profile is not available. Explore his Robert Langdon series or try J.K.
          Rowling's works.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant='tertiary' size='sm'>
          View Authors
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export const AvatarGroup: Story = {
  args: {},
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyMedia>
          <div className='*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:size-12 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:grayscale'>
            <Avatar>
              <AvatarImage
                src='https://upload.wikimedia.org/wikipedia/en/8/86/Harry_Potter_character_poster.jpg'
                alt='Harry Potter'
              />
              <AvatarFallback>HP</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src='https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Ron_Weasley_poster.jpg/220px-Ron_Weasley_poster.jpg'
                alt='Ron Weasley'
              />
              <AvatarFallback>RW</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarImage
                src='https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/Hermione_Granger_poster.jpg/220px-Hermione_Granger_poster.jpg'
                alt='Hermione'
              />
              <AvatarFallback>HG</AvatarFallback>
            </Avatar>
          </div>
        </EmptyMedia>
        <EmptyTitle>No Characters Found</EmptyTitle>
        <EmptyDescription>
          Explore the magical world of Harry Potter or follow Robert Langdon's adventures.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant='tertiary' size='xs'>
          <Lucide.PlusIcon />
          Browse Characters
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export const WithInputGroup: Story = {
  args: {},
  render: () => (
    <Empty>
      <EmptyHeader>
        <EmptyTitle className='text-2xl'>404 - Book Not Found</EmptyTitle>
        <EmptyDescription>
          The Lost Symbol or Harry Potter book you&apos;re looking for doesn&apos;t exist. Try
          searching for what you need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup className='sm:w-3/4'>
          <InputGroupAddon align='start'>
            <Lucide.SearchIcon />
          </InputGroupAddon>
          <Input placeholder='Search books...' />
          <InputGroupAddon align='end'>
            <Kbd variant='plain' className='text-dimmed'>
              /
            </Kbd>
          </InputGroupAddon>
        </InputGroup>
        <EmptyDescription>
          Looking for recommendations? <a href='/bestsellers'>Browse bestsellers</a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}

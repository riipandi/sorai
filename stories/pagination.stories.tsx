import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import {
  Pagination,
  PaginationList,
  PaginationItem,
  PaginationButton
} from '#/components/selia/pagination'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
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
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Pagination>
      <PaginationList>
        <PaginationItem>
          <PaginationButton disabled>
            <Lucide.ChevronLeftIcon />
            <span className='hidden sm:inline'>Previous</span>
          </PaginationButton>
        </PaginationItem>
        <PaginationItem>
          <PaginationButton active>1</PaginationButton>
        </PaginationItem>
        <PaginationItem>
          <PaginationButton>2</PaginationButton>
        </PaginationItem>
        <PaginationItem>
          <PaginationButton>3</PaginationButton>
        </PaginationItem>
        <PaginationItem>
          <PaginationButton>
            <span className='hidden sm:inline'>Next</span>
            <Lucide.ChevronRightIcon />
          </PaginationButton>
        </PaginationItem>
      </PaginationList>
    </Pagination>
  )
}

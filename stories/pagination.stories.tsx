import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import * as React from 'react'
import {
  Pagination,
  PaginationList,
  PaginationItem,
  PaginationButton
} from '#/components/pagination'

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

export const Advance: Story = {
  args: {},
  render: () => {
    const totalPages = 10
    const [current, setCurrent] = React.useState(1)

    const handlePrevious = () => {
      setCurrent((prev) => Math.max(1, prev - 1))
    }

    const handleNext = () => {
      setCurrent((prev) => Math.min(totalPages, prev + 1))
    }

    const handlePageClick = (page: number) => {
      setCurrent(page)
    }

    const getPageNumbers = () => {
      const pages: (number | string)[] = []
      const showEllipsis = totalPages > 7

      if (!showEllipsis) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        if (current <= 3) {
          pages.push(1, 2, 3, 4, '...', totalPages)
        } else if (current >= totalPages - 2) {
          pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
        } else {
          pages.push(1, '...', current - 1, current, current + 1, '...', totalPages)
        }
      }

      return pages
    }

    return (
      <Pagination className='border-border rounded border p-1.5'>
        <PaginationList>
          <PaginationItem>
            <PaginationButton disabled={current === 1} onClick={handlePrevious}>
              <Lucide.ChevronLeftIcon />
              <span className='hidden sm:inline'>Previous</span>
            </PaginationButton>
          </PaginationItem>
          {getPageNumbers().map((page) => {
            const isNumber = typeof page === 'number'
            return (
              <PaginationItem key={isNumber ? `page-${page}` : `ellipsis-${page}`}>
                <React.Activity mode={isNumber ? 'visible' : 'hidden'}>
                  <PaginationButton
                    active={isNumber && page === current}
                    onClick={isNumber ? () => handlePageClick(page) : undefined}
                  >
                    {page}
                  </PaginationButton>
                </React.Activity>
                <React.Activity mode={!isNumber ? 'visible' : 'hidden'}>
                  <span className='text-dimmed flex size-9 items-center justify-center'>
                    {page}
                  </span>
                </React.Activity>
              </PaginationItem>
            )
          })}
          <PaginationItem>
            <PaginationButton disabled={current === totalPages} onClick={handleNext}>
              <span className='hidden sm:inline'>Next</span>
              <Lucide.ChevronRightIcon />
            </PaginationButton>
          </PaginationItem>
        </PaginationList>
      </Pagination>
    )
  }
}

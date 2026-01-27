// FIXME: Toast not showing

import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Button } from '#/components/selia/button'
import { toastManager, Toast } from '#/components/selia/toast'
import { anchoredToastManager } from '#/components/selia/toast'

const meta = {
  title: 'Components/Toast',
  component: Toast,
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
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => {
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const [copied, setCopied] = React.useState(false)

    return (
      <div className='flex space-x-4'>
        <Button
          variant='primary'
          onClick={() =>
            toastManager.add({
              title: 'Added to cart',
              description: 'Item has been added to your cart',
              type: 'success',
              actionProps: {
                children: 'View Cart',
                onClick: () => {
                  console.log('View Cart')
                }
              }
            })
          }
        >
          Add to cart
        </Button>

        <Button
          ref={buttonRef}
          variant='secondary'
          onClick={() => {
            setCopied(true)
            anchoredToastManager.add({
              description: 'Copied',
              positionerProps: {
                anchor: buttonRef.current,
                sideOffset: 8
              },
              data: { size: 'sm' },
              onClose() {
                setCopied(false)
              },
              timeout: 1500
            })
          }}
          disabled={copied}
        >
          Copy Link
        </Button>
      </div>
    )
  }
}

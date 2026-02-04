import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Button } from '#/components/button'
import {
  Toast,
  addToast,
  toastPromise,
  updateToast,
  closeToast,
  anchoredToast
} from '#/components/toast'

const meta = {
  title: 'Components/Toast',
  component: Toast,
  parameters: { layout: 'centered' },
  argTypes: {
    position: {
      control: 'select',
      options: [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right'
      ]
    },
    timeout: { control: 'number' },
    limit: { control: 'number' },
    showCloseButton: { control: 'boolean' }
  },
  tags: [],
  args: {
    position: 'bottom-right',
    timeout: 5000,
    limit: 5,
    showCloseButton: false
  },
  decorators: [
    (Story) => (
      <div className='flex w-full min-w-md items-center justify-center'>
        <Story />
        <Toast position='bottom-right' showCloseButton={false} />
      </div>
    )
  ]
} satisfies Meta<typeof Toast>

export default meta
type Story = StoryObj<typeof meta>

export const Basic: Story = {
  args: {},
  render: () => {
    return (
      <div className='flex flex-wrap items-center gap-3'>
        <Button
          variant='outline'
          onClick={() =>
            addToast({
              title: 'Hogwarts Letter',
              description: 'You have been invited to attend Hogwarts School'
            })
          }
        >
          Default
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            addToast({
              title: 'Spell Cast Successfully',
              description: 'Expelliarmus worked perfectly',
              type: 'success'
            })
          }
        >
          Success
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            addToast({
              title: 'Ancient Symbol Discovered',
              description: 'A new clue has been found in the Louvre',
              type: 'info'
            })
          }
        >
          Info
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            addToast({
              title: 'Dark Mark Detected',
              description: 'Death Eaters have been spotted nearby',
              type: 'warning'
            })
          }
        >
          Warning
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            addToast({
              title: 'Curse Failed',
              description: 'The protective charm deflected the spell',
              type: 'error'
            })
          }
        >
          Error
        </Button>
      </div>
    )
  }
}

export const WithAction: Story = {
  args: {},
  render: () => {
    return (
      <div className='flex flex-wrap items-center gap-3'>
        <Button
          variant='primary'
          onClick={() =>
            addToast({
              title: 'Spell Learned',
              description: 'Expelliarmus has been added to your spellbook',
              type: 'success',
              actionProps: {
                children: 'View Spellbook',
                onClick: () => console.log('View Spellbook clicked')
              }
            })
          }
        >
          With Action
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            addToast({
              title: 'Clue Discovered',
              description: 'Ancient text has been decoded',
              type: 'success',
              actionProps: {
                children: 'View',
                onClick: () => console.log('View clicked')
              }
            })
          }
        >
          Success + Action
        </Button>
      </div>
    )
  }
}

export const WithoutDescription: Story = {
  args: {},
  render: () => {
    return (
      <div className='flex flex-wrap items-center gap-3'>
        <Button
          variant='outline'
          onClick={() =>
            addToast({
              title: 'Prophecy Revealed'
            })
          }
        >
          Title Only
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            addToast({
              title: 'Horcrux Destroyed',
              type: 'success'
            })
          }
        >
          Title + Icon
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            addToast({
              title: 'Broomstick Departing',
              type: 'info'
            })
          }
        >
          Info Icon
        </Button>
      </div>
    )
  }
}

export const WithCloseButton: Story = {
  args: {},
  render: () => {
    return (
      <div className='flex flex-wrap items-center gap-3'>
        <Button
          variant='outline'
          onClick={() =>
            addToast({
              title: 'Mischief Managed',
              description: 'Click the X button to close',
              data: { close: true }
            })
          }
        >
          With Close
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            addToast({
              title: 'Dark Prophecy',
              description: 'This will stay until you dismiss it',
              type: 'warning',
              data: { close: true },
              timeout: 0
            })
          }
        >
          No Timeout
        </Button>
      </div>
    )
  }
}

export const Complex: Story = {
  args: {},
  render: () => {
    return (
      <div className='flex flex-wrap items-center gap-3'>
        <Button
          variant='primary'
          onClick={() =>
            addToast({
              title: 'Spell Mastered',
              description: 'Expelliarmus has been learned successfully',
              type: 'success',
              actionProps: {
                children: 'View Spellbook',
                onClick: () => console.log('View Spellbook clicked')
              },
              data: { close: true }
            })
          }
        >
          Full Features
        </Button>
        <Button
          variant='outline'
          onClick={() =>
            addToast({
              title: 'Curse Backfired',
              description: 'Please try again later',
              type: 'error',
              actionProps: {
                children: 'Retry',
                onClick: () => console.log('Retry clicked')
              },
              data: { close: true }
            })
          }
        >
          Error + Action + Close
        </Button>
      </div>
    )
  }
}

export const Positions: Story = {
  args: {},
  render: () => {
    return (
      <div className='w-full min-w-lg space-y-4'>
        <div className='grid grid-cols-3 gap-4'>
          <Button
            block
            variant='outline'
            onClick={() =>
              addToast({
                title: 'Gryffindor Tower',
                description: 'Located in top left of Hogwarts',
                data: { position: 'top-left' }
              })
            }
          >
            Top Left
          </Button>
          <Button
            block
            variant='outline'
            onClick={() =>
              addToast({
                title: 'Great Hall',
                description: 'Located in the center of Hogwarts',
                data: { position: 'top-center' }
              })
            }
          >
            Top Center
          </Button>
          <Button
            block
            variant='outline'
            onClick={() =>
              addToast({
                title: 'Astronomy Tower',
                description: 'Located in top right of Hogwarts',
                data: { position: 'top-right' }
              })
            }
          >
            Top Right
          </Button>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <Button
            block
            variant='outline'
            onClick={() =>
              addToast({
                title: 'Hufflepuff Basement',
                description: 'Located in bottom left of Hogwarts',
                data: { position: 'bottom-left' }
              })
            }
          >
            Bottom Left
          </Button>
          <Button
            block
            variant='outline'
            onClick={() =>
              addToast({
                title: 'Dungeons',
                description: 'Located in the center below',
                data: { position: 'bottom-center' }
              })
            }
          >
            Bottom Center
          </Button>
          <Button
            block
            variant='outline'
            onClick={() =>
              addToast({
                title: 'Slytherin Dungeon',
                description: 'Located in bottom right of Hogwarts',
                data: { position: 'bottom-right' }
              })
            }
          >
            Bottom Right
          </Button>
        </div>
      </div>
    )
  }
}

export const StackedPositions: Story = {
  args: {},
  render: () => {
    const addStackedToasts = (position: string) => {
      // Add 4 toasts rapidly to test stacking behavior
      for (let i = 1; i <= 4; i++) {
        setTimeout(() => {
          addToast({
            title: `Toast ${i}`,
            description: `Stacked at ${position}`,
            type: i === 1 ? 'success' : i === 2 ? 'info' : i === 3 ? 'warning' : 'error',
            data: { position }
          })
        }, i * 150)
      }
    }

    return (
      <div className='w-full min-w-lg space-y-4'>
        <p className='text-muted mb-4 text-sm'>
          Click buttons to see toast stacking behavior. Top positions stack downward, bottom
          positions stack upward.
        </p>
        <div className='grid grid-cols-3 gap-4'>
          <Button block variant='outline' onClick={() => addStackedToasts('top-left')}>
            Stack Top Left
          </Button>
          <Button block variant='outline' onClick={() => addStackedToasts('top-center')}>
            Stack Top Center
          </Button>
          <Button block variant='outline' onClick={() => addStackedToasts('top-right')}>
            Stack Top Right
          </Button>
        </div>
        <div className='grid grid-cols-3 gap-4'>
          <Button block variant='outline' onClick={() => addStackedToasts('bottom-left')}>
            Stack Bottom Left
          </Button>
          <Button block variant='outline' onClick={() => addStackedToasts('bottom-center')}>
            Stack Bottom Center
          </Button>
          <Button block variant='outline' onClick={() => addStackedToasts('bottom-right')}>
            Stack Bottom Right
          </Button>
        </div>
      </div>
    )
  }
}

export const PromiseToasts: Story = {
  args: {},
  render: () => {
    const createPromise = (willResolve: boolean) =>
      new Promise<string>((resolve, reject) => {
        setTimeout(() => {
          if (willResolve) resolve('Done')
          else reject(new Error('Failed'))
        }, 2000)
      })

    return (
      <div className='flex flex-wrap items-center gap-4'>
        <Button
          variant='primary'
          onClick={() => {
            toastPromise(createPromise(true), {
              loading: 'Processing...',
              success: () => ({
                title: 'Success',
                description: 'Operation completed',
                type: 'success'
              }),
              error: () => ({
                title: 'Error',
                description: 'Something went wrong',
                type: 'error'
              })
            })
          }}
        >
          Promise Success
        </Button>
        <Button
          variant='outline'
          onClick={() => {
            toastPromise(createPromise(false), {
              loading: 'Processing...',
              success: () => ({
                title: 'Success'
              }),
              error: () => ({
                title: 'Failed',
                description: 'Operation failed, please try again',
                type: 'error'
              })
            })
          }}
        >
          Promise Error
        </Button>
      </div>
    )
  }
}

export const UpdateAndClose: Story = {
  args: {},
  render: () => {
    const toastIdRef = React.useRef<string | null>(null)

    const handleAdd = () => {
      const id = addToast({
        title: 'Decoding Ancient Text',
        description: 'Translating the mysterious symbols...',
        type: 'info'
      })
      toastIdRef.current = id
    }

    const handleUpdate = () => {
      if (toastIdRef.current) {
        updateToast(toastIdRef.current, {
          title: 'Code Deciphered',
          description: 'The ancient message has been revealed',
          type: 'success'
        })
      }
    }

    const handleClose = () => {
      if (toastIdRef.current) {
        closeToast(toastIdRef.current)
        toastIdRef.current = null
      }
    }

    return (
      <div className='flex flex-wrap items-center gap-3'>
        <Button variant='outline' onClick={handleAdd}>
          Add Toast
        </Button>
        <Button variant='secondary' onClick={handleUpdate}>
          Update to Success
        </Button>
        <Button variant='tertiary' onClick={handleClose}>
          Close Toast
        </Button>
      </div>
    )
  }
}

export const Anchored: Story = {
  args: {},
  render: () => {
    const copyButtonRef = React.useRef<HTMLButtonElement>(null)
    const tooltipButtonRef = React.useRef<HTMLButtonElement>(null)
    const [copied, setCopied] = React.useState(false)

    return (
      <div className='flex flex-wrap items-center gap-4'>
        <Button
          ref={copyButtonRef}
          variant='secondary'
          onClick={() => {
            setCopied(true)
            anchoredToast.add({
              description: 'Copied to spellbook',
              positionerProps: {
                anchor: copyButtonRef.current,
                sideOffset: 8
              },
              onClose() {
                setCopied(false)
              },
              timeout: 1500
            })
          }}
          disabled={copied}
        >
          {copied ? 'Copied!' : 'Copy Spell'}
        </Button>
        <Button
          ref={tooltipButtonRef}
          variant='outline'
          onClick={() => {
            anchoredToast.add({
              description: 'This is a magical tooltip',
              type: 'info',
              positionerProps: {
                anchor: tooltipButtonRef.current,
                sideOffset: 8
              }
            })
          }}
        >
          Show Tooltip
        </Button>
      </div>
    )
  }
}

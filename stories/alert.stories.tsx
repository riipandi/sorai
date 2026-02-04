import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import { Alert, AlertTitle, AlertDescription, AlertAction } from '#/components/alert'
import { Button } from '#/components/button'

const meta = {
  title: 'Components/Alert',
  component: Alert,
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
} satisfies Meta<typeof Alert>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  render: () => (
    <div className='w-full space-y-4'>
      <Alert>
        <Lucide.InfoIcon />
        Welcome to the wizarding world of Harry Potter.
      </Alert>
      <Alert variant='success'>
        <Lucide.InfoIcon />
        <AlertTitle>You're a Wizard, Harry</AlertTitle>
        <AlertDescription>Hogwarts School of Witchcraft and Wizardry awaits!</AlertDescription>
      </Alert>
    </div>
  )
}

export const VariantShowcase: Story = {
  render: () => (
    <div className='w-full space-y-4'>
      <Alert>
        <Lucide.InfoIcon />
        The Da Vinci Code has been discovered.
      </Alert>
      <Alert variant='tertiary'>
        <Lucide.InfoIcon />
        Professor Dumbledore awaits in his office.
      </Alert>
      <Alert variant='danger'>
        <Lucide.XCircleIcon />
        Lord Voldemort has returned. Stay vigilant!
      </Alert>
      <Alert variant='info'>
        <Lucide.InfoIcon />
        The Philosopher's Stone grants immortality.
      </Alert>
      <Alert variant='success'>
        <Lucide.CheckCircle2Icon />
        You have been sorted into Gryffindor!
      </Alert>
      <Alert variant='warning'>
        <Lucide.TriangleAlertIcon />
        The Ministry of Magic is watching.
      </Alert>
    </div>
  )
}

export const WithDescription: Story = {
  render: () => (
    <div className='w-full space-y-4'>
      <Alert>
        <Lucide.InfoIcon />
        <AlertTitle>Angels & Demons Discovered</AlertTitle>
        <AlertDescription>
          An ancient secret brotherhood has emerged from the shadows.
        </AlertDescription>
      </Alert>
    </div>
  )
}

export const WithActionButton: Story = {
  render: () => (
    <div className='w-full space-y-4'>
      <Alert>
        <Lucide.InfoIcon />
        Spell successfully cast. The chamber is now open.
        <AlertAction>
          <Button variant='tertiary' size='xs'>
            Undo
          </Button>
        </AlertAction>
      </Alert>
    </div>
  )
}

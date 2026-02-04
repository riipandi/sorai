import type { Meta, StoryObj } from '@storybook/react-vite'
import * as React from 'react'
import { Progress, ProgressLabel, ProgressValue } from '#/components/progress'

const meta = {
  title: 'Components/Progress',
  component: Progress,
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
} satisfies Meta<typeof Progress>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: { value: 0 },
  render: (args) => {
    const [value, setValue] = React.useState(args.value || 0)

    React.useEffect(() => {
      const interval = setInterval(() => {
        setValue((value) => Math.min(100, value + 1))
      }, 100)
      return () => clearInterval(interval)
    }, [])

    return (
      <Progress value={value} className='w-full'>
        <ProgressLabel>Casting Spell</ProgressLabel>
        <ProgressValue />
      </Progress>
    )
  }
}

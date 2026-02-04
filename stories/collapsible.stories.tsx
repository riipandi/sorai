import type { Meta, StoryObj } from '@storybook/react-vite'
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '#/components/collapsible'
import { Text } from '#/components/typography'

const meta = {
  title: 'Components/Collapsible',
  component: Collapsible,
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
} satisfies Meta<typeof Collapsible>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <div className='flex h-40 w-full items-center justify-center'>
      <Collapsible className='w-full max-w-sm'>
        <CollapsibleTrigger>What is the Illuminati?</CollapsibleTrigger>
        <CollapsiblePanel>
          <Text className='text-muted'>
            The Illuminati was a secret society formed in Bavaria in 1776, allegedly seeking to
            oppose religious influence and abuses of state power.
          </Text>
        </CollapsiblePanel>
      </Collapsible>
    </div>
  )
}

export const Indicator: Story = {
  args: {},
  render: () => (
    <div className='flex h-40 w-full items-center justify-center'>
      <Collapsible className='w-full max-w-sm'>
        <CollapsibleTrigger expandableIndicator>What is the Illuminati?</CollapsibleTrigger>
        <CollapsiblePanel>
          <Text className='text-muted'>
            The Illuminati was a secret society formed in Bavaria in 1776, allegedly seeking to
            oppose religious influence and abuses of state power.
          </Text>
        </CollapsiblePanel>
      </Collapsible>
    </div>
  )
}

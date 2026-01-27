import type { Meta, StoryObj } from '@storybook/react-vite'
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from '#/components/selia/collapsible'
import { Text } from '#/components/selia/text'

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
    <div className='flex h-40 w-full min-w-xl items-center justify-center'>
      <Collapsible className='w-full lg:w-7/12 xl:w-5/12'>
        <CollapsibleTrigger>What is Linux?</CollapsibleTrigger>
        <CollapsiblePanel>
          <Text className='text-muted'>
            Linux is a free and open-source operating system that is based on the Linux kernel.
          </Text>
        </CollapsiblePanel>
      </Collapsible>
    </div>
  )
}

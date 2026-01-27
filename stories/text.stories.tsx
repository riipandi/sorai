import type { Meta, StoryObj } from '@storybook/react-vite'
import { Text } from '#/components/selia/text'

const meta = {
  title: 'Components/Text',
  component: Text,
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
} satisfies Meta<typeof Text>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Text>
      This is a simple text component. You can use it to display text in your application.
    </Text>
  )
}

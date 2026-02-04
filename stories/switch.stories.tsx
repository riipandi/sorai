import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from '#/components/label'
import { Switch } from '#/components/switch'
import { Text } from '#/components/typography'

const meta = {
  title: 'Components/Switch',
  component: Switch,
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
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Label>
      <Switch />
      <Text>Turn on notifications</Text>
    </Label>
  )
}

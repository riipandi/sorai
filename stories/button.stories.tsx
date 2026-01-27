import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '#/components/selia/button'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select' },
    size: { control: 'select' }
  },
  tags: [], // ['autodocs']
  args: { onClick: fn() },
  decorators: [
    (Story) => (
      <div className='flex w-full min-w-md items-center justify-center'>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: { variant: 'primary' },
  render: (args) => <Button {...args}>Button</Button>
}

export const VariantShowcase: Story = {
  args: {},
  render: (args) => (
    <div className='space-x-4'>
      <Button variant='primary' {...args}>
        Primary
      </Button>
      <Button variant='secondary' {...args}>
        Secondary
      </Button>
      <Button variant='tertiary' {...args}>
        Tertiary
      </Button>
      <Button variant='danger' {...args}>
        Danger
      </Button>
    </div>
  )
}

export const SizeShowcase: Story = {
  args: {},
  render: (args) => (
    <div className='space-x-4'>
      <Button variant='outline' size='xs' {...args}>
        Extra Small
      </Button>
      <Button variant='outline' size='sm' {...args}>
        Small
      </Button>
      <Button variant='outline' size='md' {...args}>
        Medium
      </Button>
      <Button variant='outline' size='lg' {...args}>
        Large
      </Button>
    </div>
  )
}

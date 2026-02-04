import type { Meta, StoryObj } from '@storybook/react-vite'
import * as Lucide from 'lucide-react'
import * as React from 'react'
import { fn } from 'storybook/test'
import { Button } from '#/components/button'

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
    <div className='space-x-3'>
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
      <Button variant='outline' {...args}>
        Outline
      </Button>
      <Button variant='plain' {...args}>
        Plain
      </Button>
      <Button
        variant='plain'
        nativeButton={false}
        render={
          <a
            href='https://base-ui.com/react/overview/quick-start'
            rel='noopener noreferrer'
            target='_blank'
          />
        }
      >
        Link
        <Lucide.ExternalLinkIcon />
      </Button>
    </div>
  )
}

export const SizeShowcase: Story = {
  args: {},
  render: (args) => (
    <div className='space-x-3'>
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

export const FullWidth: Story = {
  args: {},
  render: (args) => (
    <div className='mx-auto w-8/12'>
      <Button variant='primary' size='lg' block {...args}>
        Get Started
      </Button>
    </div>
  )
}

export const PillButton: Story = {
  args: {},
  render: (args) => (
    <div className='space-x-3'>
      <Button variant='primary' pill {...args}>
        Primary
      </Button>
      <Button variant='secondary' pill {...args}>
        Secondary
      </Button>
      <Button variant='tertiary' pill {...args}>
        Tertiary
      </Button>
      <Button variant='danger' pill {...args}>
        Danger
      </Button>
      <Button variant='outline' pill {...args}>
        Outline
      </Button>
      <Button variant='plain' pill {...args}>
        Outline
      </Button>
    </div>
  )
}

export const IconButton: Story = {
  args: {},
  render: () => (
    <div className='space-x-3'>
      <Button variant='tertiary' size='icon'>
        <Lucide.PlayIcon />
      </Button>
      <Button variant='danger'>
        <Lucide.Trash2Icon /> Delete
      </Button>
    </div>
  )
}

export const Indicator: Story = {
  args: {},
  render: () => {
    const [pending1, setPending1] = React.useState(false)
    const [pending2, setPending2] = React.useState(false)

    return (
      <div className='flex flex-col gap-3'>
        <Button
          variant='danger'
          progress={pending1}
          onClick={() => {
            setPending1(true)
            setTimeout(() => setPending1(false), 2000)
          }}
        >
          Progress Indicator
        </Button>
        <Button
          variant='primary'
          progress={pending2}
          onClick={() => {
            setPending2(true)
            setTimeout(() => setPending2(false), 2000)
          }}
        >
          Icon with Progress
          <Lucide.ArrowRightCircleIcon />
        </Button>
      </div>
    )
  }
}

export const Disabled: Story = {
  args: {},
  render: (args) => (
    <div className='space-x-3'>
      <Button variant='primary' disabled {...args}>
        Primary
      </Button>
      <Button variant='secondary' disabled {...args}>
        Secondary
      </Button>
      <Button variant='tertiary' disabled {...args}>
        Tertiary
      </Button>
      <Button variant='danger' disabled {...args}>
        Danger
      </Button>
      <Button variant='outline' disabled {...args}>
        Outline
      </Button>
      <Button variant='plain' disabled {...args}>
        Outline
      </Button>
      <Button
        variant='plain'
        nativeButton={false}
        render={
          <a
            href='https://base-ui.com/react/overview/quick-start'
            rel='noopener noreferrer'
            target='_blank'
          />
        }
        disabled
      >
        Link
        <Lucide.ExternalLinkIcon />
      </Button>
    </div>
  )
}

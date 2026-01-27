import type { Meta, StoryObj } from '@storybook/react-vite'
import { Field, FieldLabel } from '#/components/selia/field'
import { Fieldset, FieldsetLegend } from '#/components/selia/fieldset'
import { Input } from '#/components/selia/input'
import { Tabs, TabsItem, TabsList, TabsPanel } from '#/components/selia/tabs'

const meta = {
  title: 'Components/Tabs',
  component: Tabs,
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
} satisfies Meta<typeof Tabs>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Tabs defaultValue='account' className='w-full min-w-sm lg:w-6/12'>
      <TabsList>
        <TabsItem value='account'>Account</TabsItem>
        <TabsItem value='password'>Password</TabsItem>
      </TabsList>
      <TabsPanel value='account'>
        <Fieldset>
          <FieldsetLegend>Account</FieldsetLegend>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input id='name' placeholder='Enter your name' required />
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input id='email' placeholder='Enter your email' required />
          </Field>
        </Fieldset>
      </TabsPanel>
      <TabsPanel value='password'>
        <Fieldset>
          <FieldsetLegend>Password</FieldsetLegend>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input id='password' type='password' placeholder='Enter your password' required />
          </Field>
          <Field>
            <FieldLabel>Confirm Password</FieldLabel>
            <Input
              id='confirm-password'
              type='password'
              placeholder='Enter your confirm password'
              required
            />
          </Field>
        </Fieldset>
      </TabsPanel>
    </Tabs>
  )
}

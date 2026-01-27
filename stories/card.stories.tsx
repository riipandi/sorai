import type { Meta, StoryObj } from '@storybook/react-vite'
import { Button } from '#/components/selia/button'
import { Card, CardBody, CardHeader, CardTitle } from '#/components/selia/card'
import { Field, FieldLabel } from '#/components/selia/field'
import { Fieldset } from '#/components/selia/fieldset'
import { Input } from '#/components/selia/input'

const meta = {
  title: 'Components/Card',
  component: Card,
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
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <Card className='w-full min-w-sm xl:w-10/12 2xl:w-8/12'>
      <CardHeader>
        <CardTitle>User Settings</CardTitle>
      </CardHeader>
      <CardBody>
        <Fieldset>
          <Field>
            <FieldLabel>Name</FieldLabel>
            <Input placeholder='Enter your name' />
          </Field>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input placeholder='Enter your email' />
          </Field>
          <Field>
            <FieldLabel>Password</FieldLabel>
            <Input placeholder='Enter your password' />
          </Field>
        </Fieldset>
        <Button variant='primary' block className='mt-6'>
          Save Changes
        </Button>
      </CardBody>
    </Card>
  )
}

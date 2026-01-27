import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '#/components/selia/badge'
import { Button } from '#/components/selia/button'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow
} from '#/components/selia/table'

const meta = {
  title: 'Components/Table',
  component: Table,
  parameters: { layout: 'centered' },
  argTypes: {},
  tags: [], // ['autodocs']
  args: {},
  decorators: [
    (Story) => (
      <div className='flex w-full min-w-2xl items-center justify-center'>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Table>

export default meta
type Story = StoryObj<typeof meta>

export const Example: Story = {
  args: {},
  render: () => (
    <TableContainer className='w-full'>
      <Table>
        <TableCaption>A list of users in the workspace.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>John Doe</TableCell>
            <TableCell>john.doe@example.com</TableCell>
            <TableCell>
              <Badge variant='success'>Active</Badge>
            </TableCell>
            <TableCell>
              <Button variant='secondary' size='sm'>
                Edit
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jane Doe</TableCell>
            <TableCell>jane.doe@example.com</TableCell>
            <TableCell>
              <Badge variant='danger'>Blocked</Badge>
            </TableCell>
            <TableCell>
              <Button variant='secondary' size='sm'>
                Edit
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jim Beam</TableCell>
            <TableCell>jim.beam@example.com</TableCell>
            <TableCell>
              <Badge variant='warning'>Suspended</Badge>
            </TableCell>
            <TableCell>
              <Button variant='secondary' size='sm'>
                Edit
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Jill Smith</TableCell>
            <TableCell>jill.smith@example.com</TableCell>
            <TableCell>
              <Badge variant='info'>Pending</Badge>
            </TableCell>
            <TableCell>
              <Button variant='secondary' size='sm'>
                Edit
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

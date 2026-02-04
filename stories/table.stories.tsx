import type { Meta, StoryObj } from '@storybook/react-vite'
import { Badge } from '#/components/badge'
import { Button } from '#/components/button'
import { Card, CardBody, CardHeader, CardTitle } from '#/components/card'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow
} from '#/components/table'

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
        <TableCaption>A list of wizards in the magical community.</TableCaption>
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
            <TableCell>Harry Potter</TableCell>
            <TableCell>harry@hogwarts.edu</TableCell>
            <TableCell>
              <Badge variant='success' size='sm'>
                Active
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant='secondary' size='xs'>
                Edit
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Robert Langdon</TableCell>
            <TableCell>langdon@example.edu</TableCell>
            <TableCell>
              <Badge variant='danger' size='sm'>
                Wanted
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant='secondary' size='xs'>
                Edit
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Hermione Granger</TableCell>
            <TableCell>hermione@ministry.gov</TableCell>
            <TableCell>
              <Badge variant='warning' size='sm'>
                On Mission
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant='secondary' size='xs'>
                Edit
              </Button>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Sophie Neveu</TableCell>
            <TableCell>sophie@dgpj.fr</TableCell>
            <TableCell>
              <Badge variant='info' size='sm'>
                Investigating
              </Badge>
            </TableCell>
            <TableCell>
              <Button variant='secondary' size='xs'>
                Edit
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export const InsideCard: Story = {
  args: {},
  render: () => (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Wizards</CardTitle>
      </CardHeader>
      <CardBody>
        <TableContainer>
          <Table>
            <TableCaption>A list of wizards in the magical community.</TableCaption>
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
                <TableCell>Harry Potter</TableCell>
                <TableCell>harry@hogwarts.edu</TableCell>
                <TableCell>
                  <Badge variant='success' size='sm'>
                    Active
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant='secondary' size='xs'>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Robert Langdon</TableCell>
                <TableCell>langdon@example.edu</TableCell>
                <TableCell>
                  <Badge variant='danger' size='sm'>
                    Wanted
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant='secondary' size='xs'>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hermione Granger</TableCell>
                <TableCell>hermione@ministry.gov</TableCell>
                <TableCell>
                  <Badge variant='warning' size='sm'>
                    On Mission
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant='secondary' size='xs'>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Sophie Neveu</TableCell>
                <TableCell>sophie@dgpj.fr</TableCell>
                <TableCell>
                  <Badge variant='info' size='sm'>
                    Investigating
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant='secondary' size='xs'>
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardBody>
    </Card>
  )
}

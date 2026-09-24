import { useApp } from '@/context';
import { Table } from '@heroui/react';
export default () => {

  const { inventory } = useApp();
  console.log(inventory)

  return (< Table >
    <Table.ScrollContainer>
      <Table.Content aria-label="Example table">
        <Table.Header>
          <Table.Column>Name</Table.Column>
          <Table.Column>Quantity</Table.Column>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell>Plushie</Table.Cell>
            <Table.Cell>1</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table.ScrollContainer>
    <Table.Footer>{/* Optional footer content */}</Table.Footer>
  </Table >
  );

}
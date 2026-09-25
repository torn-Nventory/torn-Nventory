import { Dropdown, Button, Label, Key } from "@heroui/react";
import { useState } from "react";
import { numberWithCommas } from "@/utils"


export default function ({ apiKey, factionBalance }: { apiKey: string | null, factionBalance: IFactionBalance }) {
  const [visible, setVisible] = useState<Key>(localStorage.getItem("BALANCE_DROPDOWN_SETTINGS") || "money")

  console.log(factionBalance);

  if (!apiKey) return null;

  return <Dropdown>
    <Button aria-label="Menu" variant="secondary">
      {visible == "money" ? `$${numberWithCommas(factionBalance.money || 0) || 'Balance'}` : factionBalance.points || 'Balance'}
    </Button>
    <Dropdown.Popover>
      <Dropdown.Menu onAction={(key) => setVisible(key)}>
        <Dropdown.Item id="money" textValue="Money">
          <Label>Money</Label>
          <Label>${numberWithCommas(factionBalance?.money || 0)}</Label>

        </Dropdown.Item>
        <Dropdown.Item id="points" textValue="Points">
          <Label>Points</Label>
          <Label>{factionBalance?.points}</Label>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown.Popover>
  </Dropdown>

}
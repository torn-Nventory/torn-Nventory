import type { ApiKeyAccessTypeEnum, KeyInfoAvailableLog } from "torn-client";
import { SVGProps } from "react";

export {};

declare global {
  // your global declarations here
  type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
  };
  type IKeyInfo = {
    selections: {
      company: string[];
      faction: string[];
      market: string[];
      property: string[];
      torn: string[];
      user: string[];
      racing: string[];
      forum: string[];
      key: string[];
    };
    user: {
      faction_id: number | null;
      company_id: number | null;
      id: number;
    };
    access: {
      level: number;
      type: ApiKeyAccessTypeEnum;
      faction: boolean;
      company: boolean;
      log: {
        custom_permissions: boolean;
        available: KeyInfoAvailableLog[];
      };
    };
  };

  type IFactionBalance = {
    points: number | null;
    money: number | null;
  };
}

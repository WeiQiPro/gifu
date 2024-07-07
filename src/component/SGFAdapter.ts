import sgf from "npm:sgf-parser";

enum Property {
  DT = "DT", 
  PB = "PB",
  PW = "PW",
  BR = "BR", 
  WR = "WR", 
  HA = "HA", 
  AB = "AB", 
  AW = "AW", 
  SZ = "SZ", 
  KM = "KM", 
  RE = "RE", 
  RU = "RU",
  GM = "GM",
  FF = "FF",
  GN = "GN",
  AP = "AP",
  TM = "TM",
  TC = "TC",
  TT = "TT"
}

enum MoveProperty {
  B = "B",
  W = "W"
}

type PropertyValue = string | string[] | number;

interface SGFProperties {
  [Property.DT]?: PropertyValue;
  [Property.PB]?: PropertyValue;
  [Property.PW]?: PropertyValue;
  [Property.BR]?: PropertyValue;
  [Property.WR]?: PropertyValue;
  [Property.HA]?: PropertyValue;
  [Property.AB]?: PropertyValue;
  [Property.AW]?: PropertyValue;
  [Property.SZ]?: PropertyValue;
  [Property.KM]?: PropertyValue;
  [Property.RE]?: PropertyValue;
  [Property.RU]?: PropertyValue;
  [Property.GM]?: PropertyValue;
  [Property.FF]?: PropertyValue;
  [Property.GN]?: PropertyValue;
  [Property.AP]?: PropertyValue;
  [Property.TM]?: PropertyValue;
  [Property.TC]?: PropertyValue;
  [Property.TT]?: PropertyValue;
}

interface Move {
  B?: string;
  W?: string;
}

interface SGFData {
  properties: SGFProperties;
  moves: Move[];
}

class SGFAdapter {
  private sgf: typeof sgf;
  private _data: Record<string, unknown>[];
  private decoder: TextDecoder;

  constructor() {
    this.sgf = sgf;
    this._data = [];
    this.decoder = new TextDecoder('utf-8');
  }

  public parse(path: string): SGFData {
    const data: string = this.decoder.decode(Deno.readFileSync(path));
    this._data = this.sgf.parse(data);
    return this.formatSGFData();
  }

  private formatSGFData(): SGFData {
    const properties: SGFProperties = {};
    const moves: Move[] = [];

    let currentNode = this._data[0];

    while (currentNode) {
      if (Array.isArray(currentNode)) {
        currentNode = currentNode[0];
      }
      
      this.processNode(currentNode as Record<string, unknown>, properties, moves);

      currentNode = currentNode._next as Record<string, unknown>;
    }

    return { properties, moves };
  }

  private processNode(node: Record<string, unknown>, properties: SGFProperties, moves: Move[]) {
    for (const [key, value] of Object.entries(node)) {
      if (Property[key as keyof typeof Property]) {
        properties[key as keyof SGFProperties] = this.parsePropertyValue(value);
      } else if (MoveProperty[key as keyof typeof MoveProperty]) {
        moves.push({ [key]: value as string });
      }
    }
  }

  private parsePropertyValue(value: unknown): PropertyValue {
    if (Array.isArray(value)) {
      return value as string[];
    } else if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'string' && !isNaN(parseFloat(value))) {
      return parseFloat(value);
    } else {
      return value as string;
    }
  }
}

export default SGFAdapter;

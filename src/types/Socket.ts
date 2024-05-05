type ServerToClientEvents = {
  addMerchandise: (message: string) => void;
  modifyMerchandise: (message: string) => void;
  deleteMerchandise: (message: string) => void;
}

type ClientToServerEvents = {
  update: (message: string) => void;
}

export type {ServerToClientEvents, ClientToServerEvents};

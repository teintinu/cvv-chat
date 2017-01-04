
declare class Peer {
  constructor(params: any);
};

var _singleton: Peer;
var key: string='';

export function loaded(_key: string) {
  key=_key;
}

function peer() {
  if (!_singleton)
    _singleton = new Peer({key})
  return _singleton;
}
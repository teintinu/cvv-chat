
import { remote, RemoteOptions } from 'webdriverio';

var url: string = 'http://localhost:4000';

export interface AtorsInfo {
  [nome: string]: AtorInfo
}

export type BrowserName = 'firefox' | 'chrome';
export type BrowserSize = 'iPhone 5' | 'Galaxy S5' | '1024x768';

export type AtorInfo = {
  browser: BrowserName
  size?: BrowserSize
};

export type Client<W> = WebdriverIO.Client<W> 
& {
  sincroniza(fn: (browser: Client<W>) => Client<W>): void
//   checkText(selector: string, expectedText: string): Client<W>
};

export type MatrixClient<W> = Client<W> &
  {
    sync(): MatrixClient<W>
  }
export type Matrix<W, V, O> =
  {
    [name in (keyof V)]: Client<W> & 
      {
        login(): Client<W> 
      } 
  }
  &
  {
    [name in (keyof O)]: Client<W> & 
      {
        chamar(): Client<W> 
      } 
  }
  & {
    init(): Promise<void>;
    end(): Promise<void>;
  };

export function createMatrix<W, V extends AtorsInfo, O extends AtorsInfo>(
  info: { voluntarios: V, OPs: O }):
  Matrix<W, V, O> {
  var ret: any = {};
  var _browsers: Array<Client<W>> = [];
  var _inits: Array<() => void> = [];
  var _ends: Array<() => void> = [];
  ator(info.voluntarios, (c, nome, info_a) => {
    c.addCommand('login', function() {
      return c.click('[tabindex="1004"]')
        .waitForVisible('#vlogin', 2000)
        .setValue('#vlogin', nome)
        .setValue('#vsenha', '123')
        .click('[tabindex="2001"]')
        .waitForExist('#vdisponivel', 6000)
        .selectorExecute('#vdisponivel', (inputs, message) => {
          debugger
          console.dir({ inputs, message })
          return message;
        });
    });
    return c;
  });
  ator(info.OPs, (c) => {
    c.addCommand('chamar', function() {
      return c.click('[tabindex="1001"]');
    });
    return c;
  });
  ret.init = () => all(_inits);
  ret.end = () => all(_ends);
  return ret;
  function ator(infos: AtorsInfo, onInit: (c: Client<W>, nome: string, info_a: AtorInfo) => Client<W>) {
    Object.keys(infos).forEach(function (nome) {
      var info_a = infos[nome];
      var info_b = browserFor(info_a);
      var _remote = remote(info_b);
      var browser: Client<W>;
      _inits.push(init_c)
      _ends.push(()=>browser.end())

      function init_c() {
        browser = _remote.init<W>().url<W>(url) as any; 
        _browsers.push(browser);
        ret[nome] = browser;
        if (info_a.size)
          setSize();
        browser.addCommand('sincroniza', function(fn: (browser: Client<W>)=> void) {
          return _browsers.map( (browser) => fn(browser));
        });          
        return onInit(browser, nome, info_a);
      }
      function setSize() {
        switch (info_a.size) {
          case 'iPhone 5':
            return browser.setViewportSize({ width: 320, height: 568 }, false);
          case 'Galaxy S5':
            return browser.setViewportSize({ width: 360, height: 640 }, false);
          case '1024x768':
            return browser.setViewportSize({ width: 1024, height: 768 }, false);
        }
      }
    });
  }
  function browserFor(info: AtorInfo): RemoteOptions {
    var opts: RemoteOptions = { desiredCapabilities: {} };
    if (info.browser)
      opts.desiredCapabilities.browserName = info.browser;
    return opts;
  }
  function all(fns: Array<() => void>) {
    return Promise.all(fns.map( (f)=> f()));
  }
}
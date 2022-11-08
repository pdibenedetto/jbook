import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import ReactDom from 'react-dom';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';
import { fetchPlugin } from './plugins/fetch-plugin';

const App = () => {
  const esbuildRef = useRef<any>();
  const iframe = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startService = async () => {
    // now we can call ref anywhere in the component
    esbuildRef.current = await esbuild.startService({
      worker: true,
      wasmURL: 'https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm',
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!esbuildRef.current) {
      return;
    }

    // Here, we're bundling
    // Important, we do not have a file system available in the browser
    const result = await esbuildRef.current.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(), fetchPlugin(input)],
      define: {
        'process.env.NODE_ENV': '"production"',
        global: 'window',
      },
    });
    // setCode(result.outputFiles[0].text);

    iframe.current.contentWindow.postMessage(result.outputFiles[0].text, '*')

  };

  const html = `
    <html>
    <head></head>
    <body>
      <div id="root"></div>
      <script>
      window.addEventListener('message', (event) => {
        eval(event.data);
      }, false);
      </script>
    </body>
    </html>
  `;


  return (
    <div>
      <textarea
        onChange={(e) => setInput(e.target.value)}
        value={input}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre>{code}</pre>
      <iframe ref={iframe} srcDoc={html} sandbox="allow-scripts" title='IFrame' />
    </div>
  );
};


ReactDom.render(<App />, document.querySelector('#root'));

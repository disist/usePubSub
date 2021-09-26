# usePubSub

> Simple hook, that realizes PubSub for React apps

This is one channel PubSub.

## Install

```bash
npm i -S @disist/usePubSub
```

## Usage

To use this hook you need to add PubSubProvider to the your App

```jsx
import { PubSubProvider } from '@disist/usepubsub';

function App() {
  return (
    <PubSubProvider>
      ...
    </PubSubProvider>
  );
}

export default App;
```

For publishing, you can use `publish` method from `usePubSub` hook, please see example:

```jsx
import { useCallback } from "react";
import { usePubSub } from "@disist/usepubsub";

function Component1() {
  const { publish } = usePubSub();
  
  const onButtonClick = useCallback(() => publish('TestTopic'), [publish]);

  return (
    <div>Component 1
      <button onClick={onButtonClick}>Publish</button>
      <button onClick={() => publish('TestTopic', 'additional message')}>Publish with message</button>
    </div>
  );
}

export default Component1;
```

For subsribing you can use simple hook `usePubSubListen`: 

```jsx
import { useState } from "react";
import { usePubSubListen } from "@disist/usepubsub";

function Component3() {
  const [message, setMessage] = useState<string>();

  usePubSubListen(
    'TestTopic',
    (value: any) => setMessage(value ?? `Received message ${new Date()}`)
  );

  return (
    <div>Component 3
      <div>{message}</div>
    </div>
  );
}

export default Component3;
```

Or you can custom addListener and removeListener

```jsx
  const { addListener, removeListener } = usePubSub();

  useEffect(() => {
    const listener = (value: string) => setMessage(value ?? `Received message ${new Date()}`);

    addListener('TestTopic', listener);

    return () => {
      removeListener('TestTopic', listener);
    }
  }, [addListener, removeListener]);
```

Besides, please have a look to complete example of usage https://github.com/disist/usePubSub/example

## License

MIT © [disist](https://github.com/disist)

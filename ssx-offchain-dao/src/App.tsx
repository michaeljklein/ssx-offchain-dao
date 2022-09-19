import { useState } from "react";
import logo from './logo.svg';
import { SSX } from '@spruceid/ssx';
import './App.css';
import getSSXConfig from './ssx.config';

import { issueCredential,
  keyToDID,
} from '@spruceid/didkit-wasm';

function AccountInfo({ address, delegator }: { address: string, delegator?: string }) {
  return (
    <div>
      {
        address &&
        <p>
          <b>Address:</b> <code>{address}</code>
        </p>
      }
      {
        delegator &&
        <p>
          <b>Delegator:</b> <code>{delegator}</code>
        </p>
      }
    </div>
  );
};

function CreateProposal() {
  //@ts-ignore
  const key = (window as any).ssx.session.sessionKey;
  console.log('key: ' + key);

  const did = keyToDID('key', key);
  const credential = {
    '@context': [
      "https://www.w3.org/2018/credentials/v1"
    ],
    id: "some-proposal-id",
    issuanceDate: Date.now(),
    issuer: did,
    type: [ 'VerifiableCredential' ],
    credentialSubject: {
      id: did
    }
  };

  const proof_options = {

  };

  const vc = issueCredential(JSON.stringify(credential), JSON.stringify(proof_options), key);
}

function App() {

  const [ssxProvider, setSSX] = useState<SSX | null>(null);

  const ssxHandler = async () => {
    const ssxConfig = await getSSXConfig();
    const ssx = new SSX(ssxConfig);
    await ssx.signIn();
    setSSX(ssx);
    (window as any).ssx = ssx;
  };

  const ssxLogoutHandler = async () => {
    ssxProvider?.signOut();
    setSSX(null);
  };

  return (
    <div className="App">
      <div className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
        />
        <h1>SSX Example dApp</h1>
      </div>
      {
        ssxProvider ?
          <div className="App-content">
            <h2>
              Account Info
            </h2>
            <AccountInfo
              address={ssxProvider?.address() || ''}
            />
            <button onClick={ssxLogoutHandler}>
              Sign-Out
            </button>
          </div> :
          <div className="App-content">
            <h2>
              Connect and Sign-In with your Ethereum account.
            </h2>
            <button onClick={ssxHandler}>
              Sign-In with Ethereum (SSX)
            </button>
          </div>
      }

    <button onClick={CreateProposal}>
      Create Proposal
    </button>

    </div>
  );
}

export default App;